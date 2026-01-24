-- Fix subscriptions table RLS policies
-- Currently all policies are RESTRICTIVE which blocks all access
-- We need a PERMISSIVE SELECT policy for users to read their own subscriptions

-- Drop existing policies
DROP POLICY IF EXISTS "Service role only can delete subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Service role only can insert subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Service role only can update subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can read own subscriptions" ON public.subscriptions;

-- Create PERMISSIVE SELECT policy for authenticated users to read their own subscriptions
CREATE POLICY "Users can read own subscriptions" ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Keep RESTRICTIVE policies to block INSERT/UPDATE/DELETE from regular users
-- Only service role (used by edge functions) can modify subscriptions
CREATE POLICY "Service role only can insert subscriptions" ON public.subscriptions
  AS RESTRICTIVE
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Service role only can update subscriptions" ON public.subscriptions
  AS RESTRICTIVE
  FOR UPDATE
  USING (false);

CREATE POLICY "Service role only can delete subscriptions" ON public.subscriptions
  AS RESTRICTIVE
  FOR DELETE
  USING (false);