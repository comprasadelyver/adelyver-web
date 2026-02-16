CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS boolean AS $$
DECLARE
  _role text;
BEGIN
  -- 1. Try to get role from the manual Drizzle claims first
  _role := current_setting('request.jwt.claims', true)::jsonb ->> 'role';
  
  -- 2. If that's null, fall back to the native Supabase auth.jwt()
  IF _role IS NULL THEN
    _role := auth.jwt() -> 'app_metadata' ->> 'role';
  END IF;

  RETURN _role = 'admin';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;