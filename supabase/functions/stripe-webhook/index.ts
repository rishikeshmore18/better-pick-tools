import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Webhook is server-to-server from Stripe, restrict CORS to app domain only
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://betterpick.lovable.app",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2023-10-16",
  });

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("Missing stripe-signature header");
    return new Response("Missing signature", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  console.log("Received event:", event.type);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout completed:", session.id);

        const userId = session.metadata?.user_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId && customerId) {
          // Update profile with Stripe customer ID
          await supabase
            .from("profiles")
            .upsert({
              id: userId,
              email: session.customer_email,
              stripe_customer_id: customerId,
            });

          console.log("Updated profile for user:", userId);
        }

        // Fetch subscription details
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          await supabase
            .from("subscriptions")
            .upsert({
              user_id: userId,
              stripe_subscription_id: subscriptionId,
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            }, {
              onConflict: "stripe_subscription_id",
            });

          console.log("Created subscription record:", subscriptionId);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription update:", subscription.id, subscription.status);

        const userId = subscription.metadata?.user_id;
        
        if (userId) {
          await supabase
            .from("subscriptions")
            .upsert({
              user_id: userId,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            }, {
              onConflict: "stripe_subscription_id",
            });

          console.log("Updated subscription for user:", userId);
        } else {
          // Try to find user by customer ID
          const customerId = subscription.customer as string;
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("stripe_customer_id", customerId)
            .single();

          if (profile) {
            await supabase
              .from("subscriptions")
              .upsert({
                user_id: profile.id,
                stripe_subscription_id: subscription.id,
                status: subscription.status,
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
              }, {
                onConflict: "stripe_subscription_id",
              });

            console.log("Updated subscription via customer lookup:", profile.id);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription deleted:", subscription.id);

        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            cancel_at_period_end: true,
          })
          .eq("stripe_subscription_id", subscription.id);

        console.log("Marked subscription as canceled:", subscription.id);
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
