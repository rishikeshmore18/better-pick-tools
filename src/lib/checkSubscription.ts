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
  // Check subscription status first - this is the priority
  const hasSubscription = await hasActiveSubscription();

  if (hasSubscription) {
    // User has active subscription (active or trialing), always redirect to dashboard
    // This ensures users with free trials go directly to dashboard after login
    return "/members";
  }

  // If a specific URL was requested and user doesn't have subscription, respect it
  // (e.g., user might want to go to /choose-plan to subscribe)
  if (requestedUrl && requestedUrl !== "/members") {
    return requestedUrl;
  }

  // User doesn't have subscription and no specific URL requested, redirect to plans page
  return "/choose-plan";
}
