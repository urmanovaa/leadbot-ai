import { ChatMessage, CollectedData } from "./types";

const BUSINESS_KEYWORDS = [
  "клиник", "магазин", "салон", "ресторан", "кафе", "кондитерск",
  "школ", "студи", "агентств", "стоматолог", "фитнес", "отел",
  "аптек", "юридическ", "бухгалтер", "логистик", "строительн",
  "автосервис", "автомойк", "доставк", "производств", "завод",
];

const TASK_PATTERNS: [RegExp, string][] = [
  [/сайт[- ]?визитк/i, "сайт-визитка"],
  [/интернет[- ]?магазин/i, "интернет-магазин"],
  [/чат[- ]?бот/i, "чат-бот"],
  [/лендинг/i, "лендинг"],
  [/сайт/i, "сайт"],
  [/бот/i, "бот"],
  [/ассистент/i, "AI-ассистент"],
  [/crm/i, "CRM"],
  [/автоматизац/i, "автоматизация"],
  [/интеграц/i, "интеграция"],
  [/приложен/i, "приложение"],
  [/каталог/i, "каталог"],
  [/telegram/i, "Telegram-бот"],
];

const INTEREST_KEYWORDS: [string, string][] = [
  ["прайс", "стоимость"],
  ["цен", "стоимость"],
  ["стоимост", "стоимость"],
  ["сколько стоит", "стоимость"],
  ["консультац", "консультация"],
  ["менеджер", "связь с менеджером"],
  ["передай", "связь с менеджером"],
  ["демо", "демо"],
  ["пример", "примеры"],
  ["срок", "сроки"],
  ["когда", "сроки"],
];

const NOISE_WORDS = [
  "привет", "здравствуйте", "добрый день", "добрый вечер",
  "хочу", "нужен", "нужна", "нужно", "мне нужен", "мне нужна",
  "можно", "какой", "скажите", "подскажите", "расскажите",
  "хотел бы", "хотела бы", "интересует",
];

function cleanLeadText(text: string): string {
  let clean = text.trim();
  clean = clean.replace(/^[.,;:\-–—\s!?]+/, "");
  for (const noise of NOISE_WORDS) {
    const regex = new RegExp(`^${noise}\\s*`, "i");
    clean = clean.replace(regex, "");
  }
  clean = clean.replace(/^[.,;:\-–—\s!?]+/, "");
  clean = clean.replace(/\s{2,}/g, " ");
  clean = clean.replace(/\s*\|\s*/g, ", ");
  clean = clean.replace(/[.,;:!?]+$/, "");
  clean = clean.trim();
  if (clean.length === 0) return "";
  return clean.charAt(0).toLowerCase() + clean.slice(1);
}

export function extractBusinessFromMessages(messages: ChatMessage[]): string {
  const userText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join(" ");

  for (const kw of BUSINESS_KEYWORDS) {
    const regex = new RegExp(`(?:для|у нас|наш[аеи]?)\\s+(\\S*${kw}\\S*)`, "i");
    const match = userText.match(regex);
    if (match) {
      return match[1].trim();
    }
  }

  for (const kw of BUSINESS_KEYWORDS) {
    if (userText.includes(kw)) {
      const regex = new RegExp(`(\\S*${kw}\\S*)`, "i");
      const match = userText.match(regex);
      if (match) return match[1];
    }
  }

  return "не указан";
}

export function extractTaskFromMessages(messages: ChatMessage[]): string {
  const userMessages = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content);

  const userTextLower = userMessages.map((m) => m.toLowerCase()).join(" ");

  let taskType = "";
  for (const [pattern, label] of TASK_PATTERNS) {
    if (pattern.test(userTextLower)) {
      taskType = label;
      break;
    }
  }

  if (!taskType) {
    const firstMeaningful = userMessages.find(
      (m) => m.length > 10 && !/^(привет|да|нет|ок|хорошо|подтверждаю)$/i.test(m.trim())
    );
    if (firstMeaningful) {
      return cleanLeadText(firstMeaningful) || "консультация";
    }
    return "консультация";
  }

  const business = extractBusinessFromMessages(messages);
  if (business !== "не указан") {
    return `${taskType} для ${business}`;
  }

  return taskType;
}

export function extractInterestFromMessages(messages: ChatMessage[]): string {
  const userText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join(" ");

  const found = new Set<string>();
  for (const [keyword, label] of INTEREST_KEYWORDS) {
    if (userText.includes(keyword)) {
      found.add(label);
    }
  }

  return found.size > 0 ? Array.from(found).join(", ") : "общий интерес";
}

export function buildLeadSummary(
  task: string,
  business: string,
  interest: string,
  collectedData: CollectedData
): string {
  const parts: string[] = [];

  if (task && task !== "консультация") {
    parts.push(`Клиент хочет ${task}.`);
  } else {
    parts.push("Клиент обратился за консультацией.");
  }

  if (interest !== "общий интерес") {
    parts.push(`Интересуется: ${interest}.`);
  }

  if (collectedData.contact && collectedData.consentGiven) {
    parts.push("Контакт оставлен, согласие получено.");
  } else if (collectedData.contact) {
    parts.push("Контакт оставлен.");
  }

  return parts.join(" ");
}

export function buildRawConversation(messages: ChatMessage[]): string {
  return messages
    .map(
      (m) => `[${m.role === "user" ? "Клиент" : "Ассистент"}]: ${m.content}`
    )
    .join("\n");
}
