// @/service/groqService.ts
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ApiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqResponse {
  reply?: string;
  error?: string;
}

const SYSTEM_PROMPT = process.env.NEXT_PUBLIC_SYSTEM_PROMPT || "";
const URL_API = process.env.NEXT_PUBLIC_URL_API || "";

export const requestToGroqAI = async (history: Message[]): Promise<string> => {
  if (!URL_API) throw new Error("NEXT_PUBLIC_URL_API is not defined");
  if (!SYSTEM_PROMPT) console.warn("SYSTEM_PROMPT is empty");

  const messages: Message[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.filter(msg => msg.role !== "system"),
  ];

  const res = await fetch(URL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  let data: GroqResponse;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Invalid JSON response from server (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(
      data.error || `Network error: ${res.status} ${res.statusText}`,
    );
  }

  return data.reply ?? "";
};
