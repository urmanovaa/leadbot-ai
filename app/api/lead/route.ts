import { NextRequest, NextResponse } from "next/server";
import { sendLeadToGoogleSheets } from "@/lib/google-sheets";
import { LeadPayload } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: LeadPayload = await request.json();

    if (!body.contact || !body.consentGiven) {
      return NextResponse.json(
        { error: "Contact and consent are required" },
        { status: 400 }
      );
    }

    const result = await sendLeadToGoogleSheets(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to save lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
