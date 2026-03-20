import { supabaseAdmin, supabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = "/auth/confirmed-email";

  if (code) {
    const supabase = await supabaseClient();

    // This exchanges the "code" for an active user session
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const adminClient = supabaseAdmin();

      const phoneNumber = data.user.user_metadata?.phone_number;

      if (phoneNumber) {
        await adminClient.auth.admin.updateUserById(data.user.id, {
          phone: phoneNumber,
          phone_confirm: true,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    if (error.code === "otp_expired") {
      return NextResponse.redirect(`${origin}/auth/otp-expired`);
    }
  }

  // If something went wrong, send them to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
