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

const MODEL_LLM_NAME =
  "Mulai sekarang namamu adalah Dino, Asisten Pintar dari Aplikasi Kawaan";
const USER_DAILY_NOTE = "Yogawan sudah belajar 5 menit/hari";
const USER_PERSONALIZE =
  "Yogawan Aditya Pratama belajar 5 menit/hari, kekurangan Yogawan (Kurang percaya diri, Pemalas, Cuek, Pelupa), Kelebihan Yogawan (Pembelajar Cepat, IQ 132), Cerita Yogawan (Saya sering cemas akhir-akhir ini karena mau lulus, tapi belum menemukan bakat yang menonjol di diri saya, jadi sering sekali kepikiran.)";

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
    const dinoSystemMessage = {
      role: "system" as const,
      content: `${MODEL_LLM_NAME}. ${USER_DAILY_NOTE}. ${USER_PERSONALIZE}`,
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
