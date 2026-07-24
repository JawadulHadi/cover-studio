import { GoogleGenAI, Type } from "@google/genai";

// Shared Gemini copy-generation logic, used by both the local Express dev
// server (server.ts) and the Vercel serverless function (api/gemini/generate.ts)
// so the two never drift.

export interface GenerateCopyInput {
  bioText?: string;
  title?: string;
  currentTagline?: string;
  styleMode?: string;
  role?: string;
}

export interface GeneratedCopy {
  taglines: string[];
  skills: string[];
  subtitles: string[];
}

export async function generateCopy(
  input: GenerateCopyInput,
  apiKey: string
): Promise<GeneratedCopy> {
  const { bioText, title, currentTagline, styleMode, role } = input;

  // Role is free text — cap length to avoid prompt bloat/abuse, fall back to
  // a neutral descriptor if empty.
  const safeRole = (typeof role === "string" ? role : "").trim().slice(0, 80) || "professional";
  const safeTone = (typeof styleMode === "string" ? styleMode : "").trim().slice(0, 80) || "Impact & Results-focused";

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });

  const systemInstruction = `You are an expert LinkedIn profile optimizer and personal branding designer.
The user works as a "${safeRole}". Tailor all copy to that field's language, tools, and outcomes.
Your goal is to analyze the user's professional background and generate high-impact, minimalist copy suitable for a LinkedIn cover banner.
LinkedIn banners are wide and short (1584x396). Text must be extremely concise (typically a single powerful sentence/tagline and 4-6 primary skills/badges).
Focus on concrete, field-relevant impact, scale, and shipped work. Avoid generic buzzwords not specific to the "${safeRole}" field.`;

  const prompt = `Analyze the following professional context and generate copy suggestions:
- Role / Field: ${safeRole}
- Name/Target Title: ${title || "N/A"}
- Current Tagline: ${currentTagline || "N/A"}
- Raw Bio/Details: ${bioText || "N/A"}
- Requested Tone: ${safeTone}

Please provide:
1. Three variations of an elegant, crisp, single-sentence tagline (under 100 characters each) that highlights concrete, field-relevant expertise for a ${safeRole}.
2. A list of 6-8 core skills, tools, or specialties that represent a ${safeRole}'s focus.
3. Two variations of secondary contact/social taglines summarizing their specialty.`;

  const response = await ai.models.generateContent({
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
            description: "Three distinct, professional, punchy taglines under 100 characters.",
          },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A highly relevant list of 6-8 skill, tool, or specialty names.",
          },
          subtitles: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Two secondary specialty subtitles.",
          },
        },
        required: ["taglines", "skills", "subtitles"],
      },
    },
  });

  const responseText = response.text || "{}";
  return JSON.parse(responseText.trim());
}
