-- Add explicit denial RLS policies for subscriptions table
-- These ensure only service role (webhook) can modify subscription data

-- Explicitly deny INSERT for regular users (only service role via webhook can insert)
CREATE POLICY "Service role only can insert subscriptions" 
  ON public.subscriptions 
  FOR INSERT 
  WITH CHECK (false);

-- Explicitly deny UPDATE for regular users (only service role via webhook can update)
CREATE POLICY "Service role only can update subscriptions" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (false);

-- Explicitly deny DELETE for regular users (only service role via webhook can delete)
CREATE POLICY "Service role only can delete subscriptions" 
  ON public.subscriptions 
  FOR DELETE 
  USING (false);