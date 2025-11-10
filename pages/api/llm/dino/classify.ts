// @/pages/api/llm/dino/classify.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Groq } from "groq-sdk";
import { verifyCors } from "@/middleware/verifyCors";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface RequestBody {
  text: string;
  categories?: string[];
  customPrompt?: string;
}

interface ResponseData {
  classification?: string;
  confidence?: string;
  categories?: string[];
  error?: string;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DEFAULT_CATEGORIES = [
  "positive",
  "negative",
  "neutral",
  "spam",
  "news",
  "business",
  "technology",
  "sports",
  "entertainment",
  "politics",
];

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

  const { text, categories = DEFAULT_CATEGORIES, customPrompt } =
    req.body as RequestBody;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const categoriesList = categories.join(", ");
    const systemPrompt =
      customPrompt ||
      `Now, your name is a Dino. You are a text classifier. Classify the given text into one of these categories: ${categoriesList}. 
       Respond with only the category name and a confidence level (high/medium/low) separated by a pipe (|).
       Format: CATEGORY|CONFIDENCE`;

    const messages = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      {
        role: "user" as const,
        content: `Classify this text: ${text}`,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });

    const result = completion.choices?.[0]?.message?.content ?? null;

    if (result) {
      const [classification, confidence] = result.split("|");
      return res.status(200).json({
        classification: classification?.trim() || "",
        confidence: confidence?.trim() || "medium",
        categories: categories,
      });
    }

    return res.status(200).json({
      classification: "",
      confidence: "low",
      categories: categories,
    });
  } catch (err: any) {
    console.error("Groq API error:", err.response?.data || err.message || err);

    return res.status(500).json({
      error:
        err.response?.data?.error?.message || err.message || "Unknown error",
    });
  }
}

export default verifyCors(handler);