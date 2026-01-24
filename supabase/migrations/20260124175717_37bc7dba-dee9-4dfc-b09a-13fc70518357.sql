-- Drop the existing UPDATE policy that allows stripe_customer_id modification
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a new UPDATE policy that prevents stripe_customer_id modification
-- Users can only update their profile if they don't change stripe_customer_id
CREATE POLICY "Users can update own profile except stripe_customer_id" ON public.profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    (
      -- stripe_customer_id must remain unchanged (either both NULL or same value)
      (stripe_customer_id IS NULL AND (SELECT stripe_customer_id FROM public.profiles WHERE id = auth.uid()) IS NULL) OR
      (stripe_customer_id = (SELECT stripe_customer_id FROM public.profiles WHERE id = auth.uid()))
    )
  );