import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateCopy } from "../_lib/generateCopy";

// Vercel serverless function backing POST /api/gemini/generate in production.
// Mirrors the local Express route in server.ts (both call generateCopy).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const { bioText, title, currentTagline } = body;

    if (!bioText && !title && !currentTagline) {
      res.status(400).json({ error: "Missing required inputs for generation" });
      return;
    }

    // BYO key via header takes priority; otherwise fall back to the server key.
    // Used for this request only — never logged, persisted, or echoed back.
    const clientKeyHeader = req.headers["x-gemini-api-key"];
    const clientApiKey = typeof clientKeyHeader === "string" ? clientKeyHeader.trim() : "";
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || "";

    if (!apiKey) {
      res.status(400).json({
        error: "No Gemini API key available. Add your own key in the AI Helper panel to generate copy.",
      });
      return;
    }

    const data = await generateCopy(body, apiKey);
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Gemini API Error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Failed to generate copywriting suggestions from Gemini" });
  }
}
