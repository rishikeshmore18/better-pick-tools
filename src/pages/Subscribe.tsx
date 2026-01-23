import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Plan = "annual" | "monthly";

const Subscribe = () => {
  const [searchParams] = useSearchParams();
  const plan = (searchParams.get("plan") as Plan) || "annual";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const nextUrl = `/subscribe?plan=${plan}`;

    const start = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate(`/login?next=${encodeURIComponent(nextUrl)}`);
          return;
        }

        const response = await supabase.functions.invoke("create-checkout-session", {
          body: { plan },
        });

        if (response.error) throw new Error(response.error.message);

        if (response.data?.url) {
          window.location.href = response.data.url;
          return;
        }

        throw new Error("No checkout URL returned");
      } catch (_err) {
        toast({
          title: "Checkout failed",
          description: "Could not start checkout. Please try again.",
          variant: "destructive",
        });
        navigate("/#pricing");
      } finally {
        if (!cancelled) setStarting(false);
      }
    };

    start();
    return () => {
      cancelled = true;
    };
  }, [navigate, plan, toast]);

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
        <div className="w-full max-w-sm">
          <div className="card-elevated p-8 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" />
            <h1 className="text-xl font-semibold text-foreground mt-4">Starting checkout…</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {starting ? "Preparing your secure checkout." : "Redirecting…"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subscribe;
