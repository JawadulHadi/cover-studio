import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { PERSONA_MAP, DEFAULT_PERSONA_ID } from "./src/lib/personas";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Shared server-side Gemini client, used only as a fallback when the
// caller doesn't supply their own key (see x-gemini-api-key below).
const sharedAi = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    })
  : null;

// Server-side AI endpoint to generate LinkedIn taglines, bio expansions, and skill groupings
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { bioText, title, currentTagline, styleMode, persona: personaId } = req.body;

    if (!bioText && !title && !currentTagline) {
      res.status(400).json({ error: "Missing required inputs for generation" });
      return;
    }

    // Callers may bring their own Gemini API key so generation cost is
    // theirs, not ours — this is what keeps a shared deployment at zero
    // cost regardless of user count. The key is used for this request
    // only: never logged, never persisted, never echoed back.
    const clientApiKeyHeader = req.headers["x-gemini-api-key"];
    const clientApiKey = typeof clientApiKeyHeader === "string" ? clientApiKeyHeader.trim() : "";

    const genAiClient = clientApiKey
      ? new GoogleGenAI({
          apiKey: clientApiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        })
      : sharedAi;

    if (!genAiClient) {
      res.status(400).json({
        error: "No Gemini API key available. Add your own key in the AI Helper panel to generate copy."
      });
      return;
    }

    // Persona is looked up server-side from a fixed map — never interpolate
    // client-supplied free text into the system instruction itself.
    const persona = PERSONA_MAP[personaId] || PERSONA_MAP[DEFAULT_PERSONA_ID];

    const systemInstruction = `You are an expert LinkedIn profile optimizer and personal branding designer for ${persona.focus}.
Your goal is to analyze the user's professional background and generate high-impact, minimalist copy suitable for a LinkedIn cover banner.
LinkedIn banners are wide and short (1584x396). Text must be extremely concise (typically a single powerful sentence/tagline and 4-6 primary skills/badges).
${persona.guidance}
Avoid generic marketing buzzwords not specific to the field.`;

    const prompt = `Analyze the following professional context and generate copy suggestions:
- Name/Target Title: ${title || "N/A"}
- Current Tagline: ${currentTagline || "N/A"}
- Raw Bio/Details: ${bioText || "N/A"}
- Requested Tone: ${styleMode || persona.archetypes[0]}

Please provide:
1. Three variations of an elegant, crisp, single-sentence tagline (under 100 characters each) that highlights concrete, field-relevant expertise.
2. A list of 6-8 core skills, tools, or specialties (${persona.skillsHint}) that represent the user's focus.
3. Two variations of secondary contact/social taglines summarizing their specialty.`;

    const response = await genAiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            taglines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three distinct, professional, punchy taglines under 100 characters."
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A highly relevant list of 6-8 technology names or specialties."
            },
            subtitles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Two secondary tech list or specialization subtitles."
            }
          },
          required: ["taglines", "skills", "subtitles"]
        }
      }
    });

    const responseText = response.text || "{}";
    const data = JSON.parse(responseText.trim());
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
