Run on supabase:

```sql
-- Grant usage on the auth schema to the authenticated role or service role
GRANT USAGE ON SCHEMA auth TO postgres;
GRANT SELECT ON auth.users TO postgres;
```

Update supabase user role:

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'comprasadelyver@gmail.com';
```
