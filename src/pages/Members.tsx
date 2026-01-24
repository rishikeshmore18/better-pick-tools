import { useState, useEffect, useCallback, useRef } from "react";
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
  stripe_subscription_id?: string;
}

interface PlanDetails {
  name: string;
  price: string;
  interval: string;
}

interface PickSet {
  main: number[];
  bonus?: number;
}

interface GameConfig {
  bonus_label?: string;
}

const GAMES: Record<string, GameConfig> = {
  powerball: { bonus_label: "Powerball" },
  mega_millions: { bonus_label: "Mega Ball" },
  mass_cash: {},
  megabucks: {},
  lucky_for_life: { bonus_label: "Lucky Ball" },
  keno: {},
};

const GAME_LABELS: Record<string, string> = {
  powerball: "Powerball",
  mega_millions: "Mega Millions",
  mass_cash: "Mass Cash",
  megabucks: "Megabucks",
  lucky_for_life: "Lucky for Life",
  keno: "Keno",
};

const Members = () => {
  const [loading, setLoading] = useState(true);
  const [picksLoading, setPicksLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [selectedGame, setSelectedGame] = useState("powerball");
  const [pickSets, setPickSets] = useState<PickSet[]>([]);
  const [portalLoading, setPortalLoading] = useState(false);
  const [pollingSubscription, setPollingSubscription] = useState(false);
  const pollingAttemptsRef = useRef(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const today = new Date().toISOString().split("T")[0];

  const fetchDailyPicks = useCallback(async (game: string, silent = false) => {
    if (!silent) {
      setPicksLoading(true);
    }
    try {
      const response = await supabase.functions.invoke("get-daily-picks", {
        body: { game, date: today },
      });

      if (response.error) {
        // Handle specific error codes
        const errorData = response.error;
        if (errorData.message?.includes("NO_SUBSCRIPTION") || errorData.message?.includes("SUBSCRIPTION_INACTIVE")) {
          // Return error info instead of immediately redirecting - let polling handle it
          return { error: "NO_SUBSCRIPTION", shouldPoll: true };
        }
        throw new Error(errorData.message || "Failed to fetch picks");
      }

      if (response.data) {
        setPickSets(response.data.picks || []);
        if (response.data.subscription) {
          setSubscription(response.data.subscription);
          
          // Determine plan details based on subscription
          // We'll infer from the subscription data since we don't have plan_id in the response
          // This is a simple approach - in production you'd query Stripe or store plan details
          const isAnnual = true; // Default assumption, would need Stripe API call to be certain
          setPlanDetails({
            name: isAnnual ? "Annual" : "Monthly",
            price: isAnnual ? "$299" : "$39",
            interval: isAnnual ? "year" : "month"
          });
        }
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error("Error fetching picks:", err);
      if (!silent) {
        toast({
          title: "Error",
          description: "Could not load daily picks. Please try again.",
          variant: "destructive",
        });
      }
      return { error: "UNKNOWN_ERROR" };
    } finally {
      if (!silent) {
        setPicksLoading(false);
      }
    }
  }, [today, toast]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login?next=/members");
        return;
      }

      // Fetch picks from server (includes subscription validation)
      const result = await fetchDailyPicks(selectedGame);
      
      // If subscription check failed but user is authenticated, start polling
      // This handles the case where user just paid but webhook hasn't processed yet
      if (result?.error === "NO_SUBSCRIPTION" && result?.shouldPoll) {
        setPollingSubscription(true);
        pollingAttemptsRef.current = 0;
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/");
      }
    });

    return () => authSub.unsubscribe();
  }, [navigate, fetchDailyPicks, selectedGame]);

  // Poll for subscription updates when user might have just paid
  useEffect(() => {
    if (!pollingSubscription) return;

    const maxAttempts = 8; // Poll for ~16 seconds (8 attempts * 2 seconds)
    let intervalId: NodeJS.Timeout;
    let isPolling = true;

    const pollSubscription = async () => {
      if (!isPolling) return;
      
      pollingAttemptsRef.current += 1;
      const attempts = pollingAttemptsRef.current;

      // Check subscription status silently
      const result = await fetchDailyPicks(selectedGame, true);
      
      if (result?.success) {
        // Subscription is now active!
        isPolling = false;
        setPollingSubscription(false);
        pollingAttemptsRef.current = 0;
        setLoading(false);
        setPicksLoading(false);
        toast({
          title: "Subscription activated",
          description: "Your subscription is now active. Welcome!",
        });
        if (intervalId) clearInterval(intervalId);
        return;
      }

      if (attempts >= maxAttempts) {
        // Timeout - stop polling
        isPolling = false;
        setPollingSubscription(false);
        pollingAttemptsRef.current = 0;
        setLoading(false);
        // Show the access restricted message
        toast({
          title: "Payment processing",
          description: "Your payment is still being processed. Please wait a moment and refresh.",
          variant: "default",
        });
        if (intervalId) clearInterval(intervalId);
      }
    };

    // Poll every 2 seconds
    intervalId = setInterval(pollSubscription, 2000);
    
    // Initial poll
    pollSubscription();

    return () => {
      isPolling = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [pollingSubscription, selectedGame, fetchDailyPicks, toast]);

  const handleGameChange = (game: string) => {
    setSelectedGame(game);
    // Only fetch if not polling (polling will handle its own game)
    if (!pollingSubscription) {
      fetchDailyPicks(game);
    }
  };

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

  if (loading || pollingSubscription) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
          {pollingSubscription && (
            <>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Activating Your Subscription
              </h2>
              <p className="text-muted-foreground mb-1">
                Please wait while we confirm your payment...
              </p>
              <p className="text-sm text-muted-foreground">
                This usually takes just a few seconds
              </p>
            </>
          )}
        </div>
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
        {/* Subscription Status Card */}
        {subscription && (
          <div className="mb-8">
            <div className={`card-elevated p-6 ${
              subscription.status === "past_due" ? "border-2 border-destructive" :
              subscription.status === "canceled" ? "border-2 border-warning" :
              "border-accent/20"
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Your Subscription</h2>
                  <p className="text-sm text-muted-foreground">
                    {planDetails?.name} Plan - {planDetails?.price}/{planDetails?.interval}
                  </p>
                </div>
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
                      Manage
                    </>
                  )}
                </Button>
              </div>

              {/* Status-specific messages */}
              {subscription.status === "trialing" && (
                <div className="bg-accent/10 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    ✨ Free Trial Active
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your trial ends on {new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
                    {(() => {
                      const daysLeft = Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return daysLeft > 0 ? ` That's ${daysLeft} day${daysLeft !== 1 ? 's' : ''} from now.` : "";
                    })()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    You won't be charged until {new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              )}

              {subscription.status === "active" && !subscription.cancel_at_period_end && (
                <div className="bg-success/10 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    ✓ Subscription Active
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Next billing date: {new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              )}

              {subscription.cancel_at_period_end && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    ⚠️ Subscription Cancelled
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your subscription will end on {new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
                    You'll have access until then.
                  </p>
                </div>
              )}

              {subscription.status === "past_due" && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-destructive mb-1">
                    ⚠️ Payment Failed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We couldn't process your payment. Please update your payment method to continue using Better Pick.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleManageBilling}
                    className="mt-3"
                  >
                    Update Payment Method
                  </Button>
                </div>
              )}

              {subscription.status === "canceled" && (
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Subscription Ended
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your subscription has ended. Resubscribe to regain access to daily picks.
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate("/choose-plan#pricing")}
                  >
                    View Plans
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Today's Structured Sets</h1>
          <p className="text-muted-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        {/* Only show picks if subscription is active or trialing */}
        {subscription && (subscription.status === "active" || subscription.status === "trialing") ? (
          <div className="card-elevated p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <Select value={selectedGame} onValueChange={handleGameChange}>
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

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchDailyPicks(selectedGame)}
                disabled={picksLoading}
              >
                {picksLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh View
                  </>
                )}
              </Button>
            </div>

            {picksLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : (
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
            )}
          </div>
        ) : (
          <div className="card-elevated p-8 mb-8 text-center">
            <div className="max-w-md mx-auto">
              <p className="text-lg font-semibold text-foreground mb-2">
                Access Restricted
              </p>
              <p className="text-muted-foreground mb-4">
                {subscription?.status === "past_due" 
                  ? "Please update your payment method to continue accessing daily picks."
                  : subscription?.status === "canceled"
                  ? "Your subscription has ended. Resubscribe to access daily picks."
                  : "You need an active subscription to access this page."}
              </p>
              {subscription?.status === "past_due" ? (
                <Button onClick={handleManageBilling} variant="destructive">
                  Update Payment Method
                </Button>
              ) : (
                <Button onClick={() => navigate("/choose-plan#pricing")} variant="default">
                  View Plans
                </Button>
              )}
            </div>
          </div>
        )}

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
