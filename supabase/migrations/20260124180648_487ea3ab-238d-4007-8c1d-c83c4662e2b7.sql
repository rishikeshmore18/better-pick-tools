-- Drop existing RESTRICTIVE policies on profiles table
DROP POLICY IF EXISTS "Prevent user profile deletion" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile except stripe_customer_id" ON public.profiles;

-- Create PERMISSIVE policies (the default type) for profiles table
-- This allows authenticated users to access their own data

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile, but cannot modify stripe_customer_id
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

-- Prevent users from deleting their own profile (RESTRICTIVE to block all deletes)
CREATE POLICY "Prevent user profile deletion" ON public.profiles
  AS RESTRICTIVE
  FOR DELETE
  USING (false);