// @/pages/api/utils/verifyCors.ts
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

// Init CORS middleware
const cors = Cors({
  origin: "*", // allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
});

// Helper untuk jalankan middleware dengan Promise
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Wrapper untuk handler
export function verifyCors(handler: (req: NextApiRequest, res: NextApiResponse) => any) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    // jalankan CORS
    await runMiddleware(req, res, cors);

    // lanjut ke handler asli
    return handler(req, res);
  };
}
