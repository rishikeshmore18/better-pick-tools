import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startCheckout = async (plan: "annual" | "monthly") => {
    setLoading(true);

    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to signup with next param
        navigate(`/signup?next=/members&plan=${plan}`);
        return;
      }

      // Call checkout endpoint
      const response = await supabase.functions.invoke("create-checkout-session", {
        body: { plan },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast({
        title: "Checkout failed",
        description: "Could not start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { startCheckout, loading };
}
