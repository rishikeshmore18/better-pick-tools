import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const allowedOrigins = [
  "https://betterpick.lovable.app",
  "https://id-preview--515c2b1d-b9fc-4bd0-bc57-4c8d2286be2a.lovable.app",
];

const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": allowedOrigins.includes(origin || "") ? origin! : allowedOrigins[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
});

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client with auth
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Validate JWT and get user
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);
    
    if (claimsError || !claimsData?.user) {
      console.error("Auth error:", claimsError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = claimsData.user;
    console.log("User authenticated:", user.id, user.email);

    // Parse request body
    const { plan } = await req.json();
    if (!plan || !["annual", "monthly"].includes(plan)) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get price ID based on plan
    const priceId = plan === "annual" 
      ? Deno.env.get("STRIPE_ANNUAL_PRICE_ID")
      : Deno.env.get("STRIPE_MONTHLY_PRICE_ID");

    if (!priceId) {
      console.error("Missing price ID for plan:", plan);
      return new Response(JSON.stringify({ error: "Configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
    });

    // Check for existing Stripe customer
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    // Create or retrieve Stripe customer
    if (!customerId) {
      // Check if customer exists in Stripe by email
      const existingCustomers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { user_id: user.id },
        });
        customerId = customer.id;
      }

      // Save customer ID to profile
      await supabaseAdmin
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          stripe_customer_id: customerId,
        });

      console.log("Created/linked Stripe customer:", customerId);
    }

    const baseUrl = Deno.env.get("APP_BASE_URL") || "https://betterpick.lovable.app";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      subscription_data: {
        trial_period_days: 7,
        metadata: { user_id: user.id },
      },
      metadata: { user_id: user.id },
    });

    console.log("Created checkout session:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...getCorsHeaders(req.headers.get("origin")), "Content-Type": "application/json" },
    });
  }
});