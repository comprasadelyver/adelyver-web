import { TransactionType } from "../../implementations/db";
import { sql } from "drizzle-orm";
import { supabaseClient } from "@/lib/supabase/server";

export function withSessionRls<P extends unknown[], R>(
  tx: TransactionType,
  callback: (...args: P) => Promise<R>
) {
  return async (...args: P): Promise<R> => {
    const supabase = await supabaseClient();
    const { data } = await supabase.auth.getClaims();

    return withRls(
      tx,
      {
        role: data?.claims.role ?? "anon",
        id: data?.claims.sub ?? null,
        isAdmin: data?.claims.app_metadata?.role === "admin",
      },
      callback
    )(...args);
  };
}

export function withNetworkRls<P extends unknown[], R>(
  tx: TransactionType,
  callback: (...args: P) => Promise<R>
) {
  return async (...args: P): Promise<R> => {
    const supabase = await supabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return withRls(
      tx,
      {
        role: user?.role ?? "anon",
        id: user?.id ?? null,
        isAdmin: user?.app_metadata?.role === "admin",
      },
      callback
    )(...args);
  };
}

export function withRls<P extends unknown[], R>(
  tx: TransactionType,
  user: {
    role: string;
    id: string | null;
    isAdmin: boolean;
  },
  callback: (...args: P) => Promise<R>
) {
  return async (...args: P): Promise<R> => {
    const role = user?.role ?? "anon";
    const jwtClaims = JSON.stringify({
      sub: user?.id ?? null,
      role: user.isAdmin ? "admin" : role,
    });

    await tx.execute(sql`SET LOCAL ROLE ${sql.raw(role)}`);
    await tx.execute(
      sql`SELECT set_config('request.jwt.claims', ${jwtClaims}, true)`
    );

    return callback(...args);
  };
}
