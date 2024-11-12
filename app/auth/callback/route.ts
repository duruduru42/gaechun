import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    const { data: profile } = await supabase
      .from("profile")
      .select("phone_number, name, selection_type")
      .eq("id", data.session.user.id)
      .single();

    if (profile && profile.phone_number && profile.name && profile.selection_type) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      return NextResponse.redirect(`${origin}/authDetail`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
