import { NextRequest, NextResponse } from "next/server";
import { getChatCompletion } from "@/lib/openai";
import { buildSystemPrompt } from "@/lib/prompts";
import { parseContact, parseName, isLikelyName } from "@/lib/contact-parser";
import {
  buildLeadSummary,
  buildRawConversation,
  extractBusinessFromMessages,
  extractTaskFromMessages,
  extractInterestFromMessages,
} from "@/lib/lead-summary";
import { sendLeadToGoogleSheets } from "@/lib/google-sheets";
import { sendTelegramNotification } from "@/lib/telegram";
import { logger } from "@/lib/logger";
import { ChatApiRequest, ChatStage, CollectedData, ChatMessage } from "@/lib/types";

function determineLeadStatus(data: CollectedData, messageCount: number): string {
  if (data.contact && data.consentGiven) return "hot";
  if (data.contact) return "hot";
  if (data.request && data.request.length > 50) return "warm";
  if (messageCount >= 4) return "warm";
  return "cold";
}

function wasAskingForName(messages: { role: string; content: string }[]): boolean {
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  if (!lastAssistant) return false;
  const lower = lastAssistant.content.toLowerCase();
  return (
    lower.includes("как к вам") ||
    lower.includes("как вас зовут") ||
    lower.includes("как можно обращаться") ||
    lower.includes("ваше имя") ||
    lower.includes("представьтесь")
  );
}

function determineNextStage(
  currentStage: ChatStage,
  userText: string,
  data: CollectedData,
  messageCount: number,
  allMessages: { role: string; content: string }[]
): { stage: ChatStage; data: CollectedData } {
  const updatedData = { ...data };

  const askedForName = wasAskingForName(allMessages);

  if (askedForName && !updatedData.name && isLikelyName(userText)) {
    const capitalized = userText.trim().charAt(0).toUpperCase() + userText.trim().slice(1).toLowerCase();
    updatedData.name = capitalized;
  } else {
    const name = parseName(userText);
    if (name && !updatedData.name) {
      updatedData.name = name;
    }
  }

  const contact = parseContact(userText);
  if (contact) {
    updatedData.contact = contact.contact;
    updatedData.contactType = contact.contactType;
    if (contact.name) updatedData.name = contact.name;
  }

  const isNameOrContact = !!(
    (askedForName && updatedData.name && !data.name) ||
    contact
  );

  if (!isNameOrContact) {
    if (!updatedData.request) {
      updatedData.request = userText;
    } else if (currentStage === "qualification") {
      updatedData.request += ` | ${userText}`;
    }
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

    case "consent_request": {
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
    }

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

    logger.info("chat_message_received", {
      stage,
      userMessageCount,
      messageLength: lastUserMessage.length,
    });

    const { stage: nextStage, data: updatedData } = determineNextStage(
      stage,
      lastUserMessage,
      collectedData,
      userMessageCount,
      messages
    );

    if (nextStage !== stage) {
      logger.info("stage_transition", { from: stage, to: nextStage });
    }

    const systemPrompt = buildSystemPrompt(nextStage, updatedData);

    const chatMessages = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    logger.info("openai_request_started", { stage: nextStage });
    let reply: string;
    try {
      reply = await getChatCompletion(systemPrompt, chatMessages);
      logger.info("openai_request_completed", { stage: nextStage });
    } catch (err) {
      logger.error("openai_request_failed", {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        { error: "AI service error" },
        { status: 500 }
      );
    }

    if (nextStage === "completed" && updatedData.consentGiven) {
      logger.info("consent_given", { name: updatedData.name });

      const chatMessageObjects: ChatMessage[] = messages.map((m, i) => ({
        id: String(i),
        role: m.role as "user" | "assistant",
        content: m.content,
        timestamp: Date.now(),
      }));

      const business = extractBusinessFromMessages(chatMessageObjects);
      const task = extractTaskFromMessages(chatMessageObjects);
      const interest = extractInterestFromMessages(chatMessageObjects);
      const summary = buildLeadSummary(task, business, interest, updatedData);
      const rawConversation = buildRawConversation(chatMessageObjects);
      const leadStatus = determineLeadStatus(updatedData, userMessageCount);

      updatedData.summary = summary;

      const leadPayload = {
        name: updatedData.name || "не указано",
        contact: updatedData.contact || "не указан",
        contactType: updatedData.contactType || "unknown",
        request: task,
        summary,
        consentGiven: true,
        source: "website-chat",
        rawConversation,
      };

      const sheetsResult = await sendLeadToGoogleSheets(leadPayload);

      if (sheetsResult.success) {
        logger.info("lead_saved_to_sheet", { name: leadPayload.name });

        sendTelegramNotification({
          name: leadPayload.name,
          contact: leadPayload.contact,
          contactType: leadPayload.contactType,
          business,
          task,
          interest,
          leadStatus,
          consentGiven: true,
          summary,
        }).catch((err) => {
          logger.error("telegram_notification_failed", {
            error: err instanceof Error ? err.message : String(err),
          });
        });
      } else {
        logger.error("lead_save_failed", { error: sheetsResult.error });
      }

      reply = "Спасибо, заявка принята. Менеджер свяжется с вами в ближайшее время. Если у вас есть дополнительные вопросы — пишите, буду рад помочь.";
    }

    return NextResponse.json({
      reply,
      stage: nextStage,
      collectedData: updatedData,
    });
  } catch (error) {
    logger.error("openai_request_failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
