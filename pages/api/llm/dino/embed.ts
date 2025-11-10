// @/pages/api/llm/dino/embed.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Groq } from "groq-sdk";
import { verifyCors } from "@/middleware/verifyCors";

interface RequestBody {
  text: string;
  dimensions?: number;
}

interface ResponseData {
  embedding?: number[];
  vectorRepresentation?: string;
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

  const { text, dimensions = 512 } = req.body as RequestBody;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // Since Groq doesn't have embedding models, we'll create a semantic representation
    const messages = [
      {
        role: "system" as const,
        content: "Now, your name is a Dino. You are a text analyzer. Extract the key semantic concepts and themes from the given text. Return them as a comma-separated list of keywords and concepts."
      },
      {
        role: "user" as const,
        content: `Analyze this text and extract key semantic concepts: ${text}`
      }
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });

    const vectorRepresentation = completion.choices?.[0]?.message?.content ?? null;

    // Create a simple hash-based embedding simulation
    const embedding = createSimpleEmbedding(text, dimensions);

    return res.status(200).json({ 
      embedding,
      vectorRepresentation: vectorRepresentation || "",
    });
  } catch (err: any) {
    console.error("Groq API error:", err.response?.data || err.message || err);

    return res.status(500).json({
      error:
        err.response?.data?.error?.message || err.message || "Unknown error",
    });
  }
}

function createSimpleEmbedding(text: string, dimensions: number): number[] {
  const embedding = new Array(dimensions).fill(0);
  const words = text.toLowerCase().split(/\s+/);
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 0; j < word.length; j++) {
      const charCode = word.charCodeAt(j);
      const index = (charCode + i + j) % dimensions;
      embedding[index] += Math.sin(charCode * 0.1) * Math.cos(i * 0.1);
    }
  }
  
  // Normalize the embedding
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
}

export default verifyCors(handler);