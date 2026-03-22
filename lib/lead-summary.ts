import { ChatMessage, CollectedData } from "./types";

export function buildLeadSummary(
  messages: ChatMessage[],
  collectedData: CollectedData
): string {
  const userMessages = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content);

  const requestParts: string[] = [];

  if (collectedData.request) {
    requestParts.push(`Запрос: ${collectedData.request}`);
  }

  if (collectedData.name) {
    requestParts.push(`Имя: ${collectedData.name}`);
  }

  if (collectedData.contact) {
    requestParts.push(
      `Контакт: ${collectedData.contact} (${collectedData.contactType})`
    );
  }

  requestParts.push(`Ключевые сообщения: ${userMessages.slice(0, 5).join(" | ")}`);

  return requestParts.join("\n");
}

export function buildRawConversation(messages: ChatMessage[]): string {
  return messages
    .map(
      (m) => `[${m.role === "user" ? "Клиент" : "Ассистент"}]: ${m.content}`
    )
    .join("\n");
}
