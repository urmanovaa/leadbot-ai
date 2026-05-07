import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    env: {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      GOOGLE_SCRIPT_WEBHOOK_URL: !!process.env.GOOGLE_SCRIPT_WEBHOOK_URL,
      TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID: !!process.env.TELEGRAM_CHAT_ID,
    },
    runtime: process.env.VERCEL ? "vercel" : "local",
    timestamp: new Date().toISOString(),
  });
}
