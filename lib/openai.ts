import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return client;
}

export async function getChatCompletion(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content ?? "Произошла ошибка. Попробуйте ещё раз.";
}
