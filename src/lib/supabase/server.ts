import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function supabaseAdmin() {
  return createClient(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")
  );
}

export async function supabaseClient() {
  const cookieStore = await cookies(); // Next.js 15+ requires awaiting cookies

  return createServerClient(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The setAll method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}

function getRequiredEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    LogIfDebug(`Missing environment variable ${key}`);
    throw new Error(
      `Environment variable ${key} is missing. Run 'wrangler secret put ${key}'`
    );
  }
  LogIfDebug(`Using environment variable ${key}=${value}`);
  return value;
}

export function LogIfDebug(str: string) {
  if (process.env.DEBUG === "true") {
    console.log(str);
  }
}
