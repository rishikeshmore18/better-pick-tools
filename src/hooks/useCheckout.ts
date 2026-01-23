import { useNavigate } from "react-router-dom";

export function useCheckout() {
  const navigate = useNavigate();

  const startCheckout = (plan: "annual" | "monthly") => {
    // Always route through /subscribe so we can enforce auth first
    navigate(`/subscribe?plan=${plan}`);
  };

  return { startCheckout, loading: false };
}
