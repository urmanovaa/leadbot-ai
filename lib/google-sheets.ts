import { LeadPayload } from "./types";

export async function sendLeadToGoogleSheets(
  lead: LeadPayload
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = process.env.GOOGLE_SCRIPT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("GOOGLE_SCRIPT_WEBHOOK_URL is not set");
    return { success: false, error: "Webhook URL not configured" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Google Sheets webhook error:", text);
      return { success: false, error: text };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send lead:", message);
    return { success: false, error: message };
  }
}
