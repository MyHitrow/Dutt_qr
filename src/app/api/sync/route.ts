import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bwdvwtpqgynudsxujigf.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const VENUE_ROW_ID = "cc890a36-95df-4be5-a4f1-a8110c61047f";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("venue_settings")
      .select("service_notice_tr")
      .eq("id", VENUE_ROW_ID)
      .single();

    if (error || !data?.service_notice_tr) {
      return NextResponse.json({ success: true, data: null });
    }

    try {
      const parsed = JSON.parse(data.service_notice_tr);
      if (parsed && typeof parsed === "object") {
        return NextResponse.json({ success: true, data: parsed });
      }
    } catch {}

    return NextResponse.json({ success: true, data: null });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payloadStr = JSON.stringify(body);

    const { data, error } = await supabase
      .from("venue_settings")
      .update({
        service_notice_tr: payloadStr,
        updated_at: new Date().toISOString(),
      })
      .eq("id", VENUE_ROW_ID)
      .select();

    if (error) {
      console.error("Supabase write error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await supabase
      .from("venue_settings")
      .update({
        service_notice_tr: "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", VENUE_ROW_ID);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
