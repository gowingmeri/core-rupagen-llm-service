// @/pages/api/llm/dino/summarize.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Groq } from "groq-sdk";
import { verifyCors } from "@/middleware/verifyCors";

interface RequestBody {
  text: string;
  maxLength?: number;
}

interface ResponseData {
  summary?: string;
  error?: string;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", ["POST"])
      .status(405)
      .json({ error: "Method Not Allowed" });
  }

  const { text, maxLength = 100 } = req.body as RequestBody;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const messages = [
      {
        role: "system" as const,
        content: `Now, your name is a Dino. You are a professional summarizer. Summarize the given text in approximately ${maxLength} words or less. Make it concise and capture the key points.`,
      },
      {
        role: "user" as const,
        content: `Please summarize this text: ${text}`,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });

    const summary = completion.choices?.[0]?.message?.content ?? null;

    return res.status(200).json({ summary: summary || "" });
  } catch (err: any) {
    console.error("Groq API error:", err.response?.data || err.message || err);

    return res.status(500).json({
      error:
        err.response?.data?.error?.message || err.message || "Unknown error",
    });
  }
}

export default verifyCors(handler);