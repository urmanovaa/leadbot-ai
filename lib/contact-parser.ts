interface ParsedContact {
  contact: string;
  contactType: "telegram" | "phone" | "unknown";
  name?: string;
}

export function parseContact(text: string): ParsedContact | null {
  const telegramPattern = /@[\w]{4,}|t\.me\/[\w]+|телеграм[:\s]*@?[\w]+/i;
  const phonePattern =
    /(?:\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}|\d{10,11}/;

  const telegramMatch = text.match(telegramPattern);
  if (telegramMatch) {
    let contact = telegramMatch[0].trim();
    if (contact.toLowerCase().startsWith("телеграм")) {
      contact = contact.replace(/телеграм[:\s]*/i, "");
    }
    if (!contact.startsWith("@") && !contact.startsWith("t.me")) {
      contact = "@" + contact;
    }
    return { contact, contactType: "telegram" };
  }

  const phoneMatch = text.match(phonePattern);
  if (phoneMatch) {
    return {
      contact: phoneMatch[0].replace(/[\s-()]/g, ""),
      contactType: "phone",
    };
  }

  return null;
}

const BUSINESS_STOP_WORDS = new Set([
  "клиника", "клиники", "магазин", "магазина", "бизнес", "бизнеса",
  "компания", "компании", "кондитерская", "кондитерской", "салон", "салона",
  "сайт", "сайта", "лендинг", "лендинга", "проект", "проекта",
  "менеджер", "менеджера", "консультация", "консультации",
  "прайс", "прайса", "цена", "цены", "доставка", "доставки",
  "каталог", "каталога", "оплата", "оплаты", "ассистент", "ассистента",
  "бот", "бота", "автоматизация", "автоматизации", "интеграция", "интеграции",
  "школа", "школы", "ресторан", "ресторана", "кафе", "студия", "студии",
  "агентство", "агентства", "стоматология", "стоматологии",
  "привет", "здравствуйте", "добрый", "хочу", "нужен", "нужна", "нужно",
]);

function isBusinessWord(word: string): boolean {
  return BUSINESS_STOP_WORDS.has(word.toLowerCase());
}

export function parseName(text: string): string | null {
  const namePatterns = [
    /(?:меня зовут|я)\s+([А-ЯЁа-яё]+)/i,
    /(?:имя[:\s]*)\s*([А-ЯЁа-яё]+)/i,
    /^([А-ЯЁа-яё]{2,})\s*$/i,
  ];

  for (const pattern of namePatterns) {
    const match = text.trim().match(pattern);
    if (match) {
      const candidate = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      if (isBusinessWord(candidate)) {
        return null;
      }
      return candidate;
    }
  }
  return null;
}

export function isLikelyName(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.split(/\s+/).length > 2) return false;
  if (trimmed.length < 2 || trimmed.length > 30) return false;
  if (/\d/.test(trimmed)) return false;
  if (/[@+]/.test(trimmed)) return false;
  if (!/^[А-ЯЁа-яёA-Za-z\s-]+$/.test(trimmed)) return false;
  const words = trimmed.split(/\s+/);
  for (const word of words) {
    if (isBusinessWord(word)) return false;
  }
  return true;
}
