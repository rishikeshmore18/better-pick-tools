import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the current user has an active subscription (trialing or active status)
 * @returns Promise<boolean> - true if user has active subscription, false otherwise
 */
export async function hasActiveSubscription(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return false;
    }

    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", session.user.id)
      .in("status", ["active", "trialing"])
      .limit(1);

    if (error) {
      console.error("Error checking subscription:", error);
      return false;
    }

    return subscriptions && subscriptions.length > 0;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}

/**
 * Determines the appropriate redirect URL based on subscription status
 * @param requestedUrl - The URL requested via query params (if any)
 * @returns Promise<string> - The URL to redirect to
 */
export async function getRedirectUrl(requestedUrl: string | null = null): Promise<string> {
  // If a specific URL was requested and it's /members, respect it
  // (user might be trying to access dashboard directly)
  if (requestedUrl === "/members") {
    return "/members";
  }

  // Check subscription status
  const hasSubscription = await hasActiveSubscription();

  if (hasSubscription) {
    // User has active subscription, redirect to dashboard
    return "/members";
  } else {
    // User doesn't have subscription, redirect to plans page
    // But respect requested URL if it's a valid path (like /choose-plan)
    return requestedUrl || "/choose-plan";
  }
}
