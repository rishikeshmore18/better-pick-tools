import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const allowedOrigins = [
  "https://betterpick.lovable.app",
  "https://id-preview--515c2b1d-b9fc-4bd0-bc57-4c8d2286be2a.lovable.app",
];

const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": allowedOrigins.includes(origin || "") ? origin! : allowedOrigins[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
});

interface GameConfig {
  main_min: number;
  main_max: number;
  main_count: number;
  bonus_min?: number;
  bonus_max?: number;
  bonus_label?: string;
}

const GAMES: Record<string, GameConfig> = {
  powerball: { main_min: 1, main_max: 69, main_count: 5, bonus_min: 1, bonus_max: 26, bonus_label: "Powerball" },
  mega_millions: { main_min: 1, main_max: 70, main_count: 5, bonus_min: 1, bonus_max: 25, bonus_label: "Mega Ball" },
  mass_cash: { main_min: 1, main_max: 35, main_count: 5 },
  megabucks: { main_min: 1, main_max: 49, main_count: 6 },
  lucky_for_life: { main_min: 1, main_max: 48, main_count: 5, bonus_min: 1, bonus_max: 18, bonus_label: "Lucky Ball" },
  keno: { main_min: 1, main_max: 80, main_count: 10 },
};

// Seeded random generator
function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return function() {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

function generatePickSet(config: GameConfig, rng: () => number): { main: number[]; bonus?: number } {
  const main: number[] = [];
  const range = config.main_max - config.main_min + 1;
  
  while (main.length < config.main_count) {
    const num = Math.floor(rng() * range) + config.main_min;
    if (!main.includes(num)) {
      main.push(num);
    }
  }
  
  main.sort((a, b) => a - b);
  
  let bonus: number | undefined;
  if (config.bonus_min !== undefined && config.bonus_max !== undefined) {
    const bonusRange = config.bonus_max - config.bonus_min + 1;
    bonus = Math.floor(rng() * bonusRange) + config.bonus_min;
  }
  
  return { main, bonus };
}

function generateDailySets(game: string, date: string): Array<{ main: number[]; bonus?: number }> {
  const config = GAMES[game];
  if (!config) {
    throw new Error("Invalid game");
  }
  
  const seed = `${date}:${game}`;
  const rng = seededRandom(seed);
  const setCount = game === "keno" ? 10 : 5;
  
  const sets: Array<{ main: number[]; bonus?: number }> = [];
  for (let i = 0; i < setCount; i++) {
    sets.push(generatePickSet(config, rng));
  }
  
  return sets;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header - JWT already verified by Supabase
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the authenticated user
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    console.log("User authenticated:", userId);

    // Check subscription status server-side
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("status, current_period_end, cancel_at_period_end")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (subError) {
      console.error("Subscription query error:", subError);
      return new Response(JSON.stringify({ error: "Failed to verify subscription" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ error: "No subscription found", code: "NO_SUBSCRIPTION" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subscription = subscriptions[0];
    
    if (subscription.status !== "active" && subscription.status !== "trialing") {
      return new Response(JSON.stringify({ 
        error: "Subscription inactive", 
        code: "SUBSCRIPTION_INACTIVE",
        status: subscription.status 
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body for game and date
    let game = "powerball";
    let date = new Date().toISOString().split("T")[0];

    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (body.game && Object.keys(GAMES).includes(body.game)) {
          game = body.game;
        }
        if (body.date && /^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
          date = body.date;
        }
      } catch {
        // Use defaults if body parsing fails
      }
    }

    // Generate picks server-side
    const picks = generateDailySets(game, date);

    console.log(`Generated ${picks.length} picks for user ${userId}, game: ${game}, date: ${date}`);

    return new Response(JSON.stringify({ 
      picks,
      game,
      date,
      subscription: {
        status: subscription.status,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Get daily picks error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate picks" }), {
      status: 500,
      headers: { ...getCorsHeaders(req.headers.get("origin")), "Content-Type": "application/json" },
    });
  }
});
