-- Add explicit DELETE policy to profiles table to prevent profile deletion
CREATE POLICY "Prevent user profile deletion" 
  ON public.profiles 
  FOR DELETE 
  USING (false);