import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, CreditCard, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Subscription {
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

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

const GAME_LABELS: Record<string, string> = {
  powerball: "Powerball",
  mega_millions: "Mega Millions",
  mass_cash: "Mass Cash",
  megabucks: "Megabucks",
  lucky_for_life: "Lucky for Life",
  keno: "Keno",
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
  const seed = `${date}:${game}`;
  const rng = seededRandom(seed);
  const setCount = game === "keno" ? 10 : 5;
  
  const sets: Array<{ main: number[]; bonus?: number }> = [];
  for (let i = 0; i < setCount; i++) {
    sets.push(generatePickSet(config, rng));
  }
  
  return sets;
}

const Members = () => {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [selectedGame, setSelectedGame] = useState("powerball");
  const [portalLoading, setPortalLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const today = new Date().toISOString().split("T")[0];
  
  const pickSets = useMemo(() => {
    return generateDailySets(selectedGame, today);
  }, [selectedGame, today]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login?next=/members");
        return;
      }

      // Check subscription
      const { data: subs } = await supabase
        .from("subscriptions")
        .select("status, current_period_end, cancel_at_period_end")
        .order("created_at", { ascending: false })
        .limit(1);

      if (subs && subs.length > 0) {
        const sub = subs[0];
        if (sub.status === "active" || sub.status === "trialing") {
          setSubscription(sub);
        } else {
          toast({
            title: "Subscription required",
            description: "Please subscribe to access the dashboard.",
          });
          navigate("/#pricing");
          return;
        }
      } else {
        toast({
          title: "No subscription found",
          description: "Please subscribe to access the dashboard.",
        });
        navigate("/#pricing");
        return;
      }

      setLoading(false);
    };

    checkAuth();

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/");
      }
    });

    return () => authSub.unsubscribe();
  }, [navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login?next=/members");
        return;
      }

      const response = await supabase.functions.invoke("create-portal-session");
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not open billing portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <header className="p-6 flex items-center justify-between border-b border-border bg-background">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">BP</span>
          </div>
          <span className="font-semibold text-lg text-foreground">Better Pick</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManageBilling}
            disabled={portalLoading}
          >
            {portalLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Billing
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 container-narrow py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Today's Structured Sets</h1>
          <p className="text-muted-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          
          {subscription?.status === "trialing" && (
            <div className="mt-4 bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Free Trial Active</strong> — Your trial ends on {new Date(subscription.current_period_end).toLocaleDateString()}.
              </p>
            </div>
          )}
        </div>

        <div className="card-elevated p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(GAMES).map((game) => (
                  <SelectItem key={game} value={game}>
                    {GAME_LABELS[game]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={() => setSelectedGame(selectedGame)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh View
            </Button>
          </div>

          <div className="space-y-4">
            {pickSets.map((set, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium text-muted-foreground w-16">Set {index + 1}</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {set.main.map((num, i) => (
                    <span
                      key={i}
                      className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-semibold text-sm"
                    >
                      {num}
                    </span>
                  ))}
                  {set.bonus !== undefined && (
                    <>
                      <span className="text-muted-foreground mx-2">+</span>
                      <span className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
                        {set.bonus}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        {GAMES[selectedGame].bonus_label}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <p className="disclaimer-text">
            <strong>Disclaimer:</strong> Lottery outcomes are random. Better Pick provides informational tools only. We do not sell tickets, place bets, or guarantee outcomes. These structured sets are for entertainment and educational purposes only.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Members;
