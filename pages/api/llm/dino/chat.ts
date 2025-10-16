// @/pages/api/llm/chat.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Groq } from "groq-sdk";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: Message[];
}

interface ResponseData {
  reply?: string;
  error?: string;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", ["POST"])
      .status(405)
      .json({ error: "Method Not Allowed" });
  }

  const { messages } = req.body as RequestBody;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  try {
    // Add Dino system prompt at the beginning
    const dinoSystemMessage = {
      role: "system" as const,
      content: "Now, your name is a Dino.",
    };

    const messagesWithDino = [dinoSystemMessage, ...messages];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messagesWithDino,
    });

    const reply = completion.choices?.[0]?.message?.content ?? null;

    return res.status(200).json({ reply: reply || "" });
  } catch (err: any) {
    console.error("Groq API error:", err.response?.data || err.message || err);

    return res.status(500).json({
      error:
        err.response?.data?.error?.message || err.message || "Unknown error",
    });
  }
}
