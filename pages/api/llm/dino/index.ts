import type { NextApiRequest, NextApiResponse } from "next";
import { verifyCors } from "@/middleware/verifyCors";

type Data = {
  status: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({ status: "LLM is connected to Groq Cloud" });
}

export default verifyCors(handler);