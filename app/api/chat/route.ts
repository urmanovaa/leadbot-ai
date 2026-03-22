import { NextRequest, NextResponse } from "next/server";
import { getChatCompletion } from "@/lib/openai";
import { buildSystemPrompt } from "@/lib/prompts";
import { parseContact, parseName } from "@/lib/contact-parser";
import { buildLeadSummary, buildRawConversation } from "@/lib/lead-summary";
import { sendLeadToGoogleSheets } from "@/lib/google-sheets";
import { ChatApiRequest, ChatStage, CollectedData, ChatMessage } from "@/lib/types";

function determineNextStage(
  currentStage: ChatStage,
  userText: string,
  data: CollectedData,
  messageCount: number
): { stage: ChatStage; data: CollectedData } {
  const updatedData = { ...data };

  const name = parseName(userText);
  if (name && !updatedData.name) {
    updatedData.name = name;
  }

  const contact = parseContact(userText);
  if (contact) {
    updatedData.contact = contact.contact;
    updatedData.contactType = contact.contactType;
    if (contact.name) updatedData.name = contact.name;
  }

  if (!updatedData.request) {
    updatedData.request = userText;
  } else if (currentStage === "qualification") {
    updatedData.request += ` | ${userText}`;
  }

  switch (currentStage) {
    case "greeting":
      return { stage: "qualification", data: updatedData };

    case "qualification":
      if (updatedData.contact) {
        return { stage: "consent_request", data: updatedData };
      }
      if (messageCount >= 4) {
        return { stage: "contact_request", data: updatedData };
      }
      return { stage: "qualification", data: updatedData };

    case "contact_request":
      if (updatedData.contact) {
        return { stage: "consent_request", data: updatedData };
      }
      return { stage: "contact_request", data: updatedData };

    case "consent_request":
      const consentKeywords = [
        "подтверждаю",
        "согласен",
        "согласна",
        "да",
        "ок",
        "хорошо",
        "принимаю",
      ];
      const isConsent = consentKeywords.some((kw) =>
        userText.toLowerCase().includes(kw)
      );
      if (isConsent || updatedData.consentGiven) {
        updatedData.consentGiven = true;
        return { stage: "completed", data: updatedData };
      }
      return { stage: "consent_request", data: updatedData };

    case "completed":
      return { stage: "completed", data: updatedData };

    default:
      return { stage: currentStage, data: updatedData };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatApiRequest = await request.json();
    const { messages, stage, collectedData } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    const lastUserMessage =
      messages.filter((m) => m.role === "user").pop()?.content ?? "";
    const userMessageCount = messages.filter((m) => m.role === "user").length;

    const { stage: nextStage, data: updatedData } = determineNextStage(
      stage,
      lastUserMessage,
      collectedData,
      userMessageCount
    );

    const systemPrompt = buildSystemPrompt(nextStage, updatedData);

    const chatMessages = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const reply = await getChatCompletion(systemPrompt, chatMessages);

    if (nextStage === "completed" && updatedData.consentGiven) {
      const chatMessageObjects: ChatMessage[] = messages.map((m, i) => ({
        id: String(i),
        role: m.role as "user" | "assistant",
        content: m.content,
        timestamp: Date.now(),
      }));

      const summary = buildLeadSummary(chatMessageObjects, updatedData);
      const rawConversation = buildRawConversation(chatMessageObjects);

      updatedData.summary = summary;

      sendLeadToGoogleSheets({
        name: updatedData.name || "Не указано",
        contact: updatedData.contact || "Не указан",
        contactType: updatedData.contactType || "unknown",
        request: updatedData.request || "Не указан",
        summary,
        consentGiven: true,
        source: "website-chat",
        rawConversation,
      }).catch((err) => {
        console.error("Lead send failed (background):", err);
      });
    }

    return NextResponse.json({
      reply,
      stage: nextStage,
      collectedData: updatedData,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
