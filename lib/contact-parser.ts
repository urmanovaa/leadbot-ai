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

export function parseName(text: string): string | null {
  const namePatterns = [
    /(?:меня зовут|я)\s+([А-ЯЁа-яё]+)/i,
    /(?:имя[:\s]*)\s*([А-ЯЁа-яё]+)/i,
    /^([А-ЯЁ][а-яё]{2,})\s*$/,
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
  }
  return null;
}
