Run on supabase:

```sql
-- Grant usage on the auth schema to the authenticated role or service role
GRANT USAGE ON SCHEMA auth TO postgres;
GRANT SELECT ON auth.users TO postgres;
```
