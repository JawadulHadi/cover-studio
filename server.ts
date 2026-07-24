import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { generateCopy } from "./api/_lib/generateCopy";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side AI endpoint to generate LinkedIn taglines, skills, and subtitles.
// Shares its logic with the Vercel serverless function (api/gemini/generate.ts).
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { bioText, title, currentTagline } = req.body;

    if (!bioText && !title && !currentTagline) {
      res.status(400).json({ error: "Missing required inputs for generation" });
      return;
    }

    // Callers may bring their own Gemini API key so generation cost is theirs,
    // not ours — this is what keeps a shared deployment at zero cost regardless
    // of user count. The key is used for this request only: never logged,
    // never persisted, never echoed back. Falls back to the server key.
    const clientApiKeyHeader = req.headers["x-gemini-api-key"];
    const clientApiKey = typeof clientApiKeyHeader === "string" ? clientApiKeyHeader.trim() : "";
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || "";

    if (!apiKey) {
      res.status(400).json({
        error: "No Gemini API key available. Add your own key in the AI Helper panel to generate copy."
      });
      return;
    }

    const data = await generateCopy(req.body, apiKey);
    res.json(data);
  } catch (error: any) {
    // Log only the message — never the full error object, which can
    // embed request details (including a client-supplied API key).
    console.error("Gemini API Error:", error?.message || error);
    res.status(500).json({ error: error.message || "Failed to generate copywriting suggestions from Gemini" });
  }
});

// Set up Vite middleware or serve static files
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Error setting up server:", err);
});
