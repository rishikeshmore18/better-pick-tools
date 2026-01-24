import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ActivationStatus = "checking" | "confirmed" | "timeout";

const Success = () => {
  const [status, setStatus] = useState<ActivationStatus>("checking");
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15; // 15 attempts * 2 seconds = 30 seconds
    let intervalId: NodeJS.Timeout;

    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // User not logged in, redirect to login
          navigate("/login");
          return;
        }

        // Query subscriptions table to check if webhook has processed
        const { data: subscriptions } = await supabase
          .from("subscriptions")
          .select("status, current_period_end")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (subscriptions && subscriptions.length > 0) {
          const sub = subscriptions[0];
          // Check if subscription is active or trialing
          if (sub.status === "active" || sub.status === "trialing") {
            setStatus("confirmed");
            // Auto-redirect to dashboard after 2 seconds
            setTimeout(() => {
              navigate("/members");
            }, 2000);
            clearInterval(intervalId);
            return;
          }
        }

        attempts++;
        setCountdown(30 - (attempts * 2));

        if (attempts >= maxAttempts) {
          // Timeout - subscription not found after 30 seconds
          setStatus("timeout");
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };

    // Initial check
    checkSubscription();

    // Poll every 2 seconds
    intervalId = setInterval(checkSubscription, 2000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <header className="p-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">BP</span>
          </div>
          <span className="font-semibold text-lg text-foreground">Better Pick</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="card-elevated p-8">
            {status === "checking" && (
              <>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-8 h-8 text-accent animate-spin" />
                </div>

                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Activating Your Subscription
                </h1>
                <p className="text-muted-foreground mb-4">
                  Please wait while we confirm your payment with Stripe...
                </p>
                <p className="text-sm text-muted-foreground">
                  This usually takes just a few seconds ({countdown}s remaining)
                </p>
              </>
            )}

            {status === "confirmed" && (
              <>
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>

                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to Better Pick!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Your subscription is active. Redirecting to your dashboard...
                </p>

                <Button asChild className="btn-primary w-full">
                  <Link to="/members">Go to Dashboard</Link>
                </Button>
              </>
            )}

            {status === "timeout" && (
              <>
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-warning" />
                </div>

                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Payment Processing
                </h1>
                <p className="text-muted-foreground mb-6">
                  Your payment is still being processed by Stripe. This can take up to a few minutes.
                </p>

                <div className="space-y-3">
                  <Button asChild className="btn-primary w-full">
                    <Link to="/members">Go to Dashboard</Link>
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    If you don't have access yet, please wait a moment and refresh the page.
                  </p>
                </div>
              </>
            )}
          </div>

          <p className="disclaimer-text mt-6">
            Lottery outcomes are random. Better Pick provides informational tools only. We do not sell tickets, place bets, or guarantee outcomes.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Success;
