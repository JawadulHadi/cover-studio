import React, { useState } from "react";
import { BannerConfig, AISuggestions } from "../types";
import { PERSONAS, PERSONA_MAP, DEFAULT_PERSONA_ID } from "../lib/personas";
import { Sparkles, ArrowRight, Loader2, RefreshCw, Check, Code, Layers, FileText, Users, KeyRound, Eye, EyeOff } from "lucide-react";

interface AIHelperProps {
  config: BannerConfig;
  onChangeConfig: (updates: Partial<BannerConfig>) => void;
}

// Session-only: cleared when the tab closes, never sent anywhere but
// directly to our own generation endpoint for the request that needs it.
const API_KEY_SESSION_STORAGE_KEY = "gemini_api_key";

export default function AIHelper({ config, onChangeConfig }: AIHelperProps) {
  const [personaId, setPersonaId] = useState(DEFAULT_PERSONA_ID);
  const persona = PERSONA_MAP[personaId];

  const [apiKey, setApiKey] = useState(
    () => sessionStorage.getItem(API_KEY_SESSION_STORAGE_KEY) || ""
  );
  const [showApiKey, setShowApiKey] = useState(false);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (value) {
      sessionStorage.setItem(API_KEY_SESSION_STORAGE_KEY, value);
    } else {
      sessionStorage.removeItem(API_KEY_SESSION_STORAGE_KEY);
    }
  };

  const [bioText, setBioText] = useState(persona.bioExample);
  const [titleInput, setTitleInput] = useState(config.title);
  const [taglineInput, setTaglineInput] = useState(config.tagline);
  const [styleMode, setStyleMode] = useState(persona.archetypes[0]);

  const handlePersonaChange = (nextId: string) => {
    const nextPersona = PERSONA_MAP[nextId];
    // Only swap the example bio if the user hasn't typed over it yet.
    if (bioText === persona.bioExample) {
      setBioText(nextPersona.bioExample);
    }
    setStyleMode(nextPersona.archetypes[0]);
    setPersonaId(nextId);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestions | null>({
    taglines: [
      "I build backend systems that scale, AI features that ship, and integrations that connect.",
      "Architecting high-scale cloud platforms & seamless Gemini-powered GenAI integrations.",
      "7+ Years of Backend Excellence: Scalable Microservices & Resilient AI Architectures."
    ],
    skills: ["NestJS", "TypeScript", "Node.js", "PostgreSQL", "Docker", "GCP", "Gemini 2.5", "BullMQ"],
    subtitles: [
      "Specializing in Web Applications, Scalable Cloud Architectures & Generative AI",
      "NestJS • PostgreSQL • GCP Certified • Production AI Systems Builder"
    ]
  });

  const [appliedTaglineIdx, setAppliedTaglineIdx] = useState<number | null>(null);
  const [appliedSubtitleIdx, setAppliedSubtitleIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setAppliedTaglineIdx(null);
    setAppliedSubtitleIdx(null);

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey.trim() ? { "X-Gemini-Api-Key": apiKey.trim() } : {}),
        },
        body: JSON.stringify({
          bioText,
          title: titleInput,
          currentTagline: taglineInput,
          styleMode,
          persona: personaId
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to contact server AI assistant.");
      }

      const data = await response.json();
      if (data.taglines && data.skills && data.subtitles) {
        setSuggestions(data);
      } else {
        throw new Error("Invalid format returned by AI.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during generation. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  const applyTagline = (tagline: string, index: number) => {
    onChangeConfig({ tagline });
    setAppliedTaglineIdx(index);
    setTimeout(() => setAppliedTaglineIdx(null), 2000);
  };

  const applySubtitle = (subTitle: string, index: number) => {
    onChangeConfig({ subTitle });
    setAppliedSubtitleIdx(index);
    setTimeout(() => setAppliedSubtitleIdx(null), 2000);
  };

  const applySkills = (skills: string[]) => {
    onChangeConfig({ skills });
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 space-y-6" id="ai-copywriter-assistant">
      <div className="flex items-center justify-between border-b border-[#111] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Gemini Personal Brand Writer</h3>
            <p className="text-xs text-slate-400">Optimize banner copy for {persona.focus}</p>
          </div>
        </div>
        <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#555] px-2 py-1 bg-[#050505]/50 border border-[#111] rounded">
          Powered by Gemini
        </div>
      </div>

      {/* Inputs Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#555]" />
            Profession
          </label>
          <select
            value={personaId}
            onChange={(e) => handlePersonaChange(e.target.value)}
            className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-[#e5e5e5] focus:ring-1 focus:ring-blue-500 transition-all outline-none cursor-pointer"
          >
            {PERSONAS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#555]" />
            Your Gemini API Key (optional)
          </label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Paste your own key to generate without limits"
              autoComplete="off"
              className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-blue-500 rounded-lg pl-3 pr-9 py-2 text-xs text-[#e5e5e5] placeholder-[#444] focus:ring-1 focus:ring-blue-500 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowApiKey((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#c5c5c5] cursor-pointer"
              aria-label={showApiKey ? "Hide API key" : "Show API key"}
            >
              {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-[10px] text-[#555] mt-1">
            {apiKey.trim()
              ? "Using your key — kept only in this browser tab's session, never saved to our servers."
              : "Without a key, generation uses a shared demo quota and may be rate-limited. Get a free key at aistudio.google.com/apikey."}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#555]" />
            Your Experience / Bio details (to analyze)
          </label>
          <textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            rows={3}
            placeholder="Paste your resume points, LinkedIn summary, or certifications here..."
            className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-blue-500 rounded-lg p-3 text-xs text-[#e5e5e5] placeholder-[#444] focus:ring-1 focus:ring-blue-500 transition-all outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-[#555]" />
              Target Position Title
            </label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder={persona.titlePlaceholder}
              className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-[#e5e5e5] focus:ring-1 focus:ring-blue-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#555]" />
              Desired Brand Archetype
            </label>
            <select
              value={styleMode}
              onChange={(e) => setStyleMode(e.target.value)}
              className="w-full bg-[#050505] border border-[#1a1a1a] focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-[#e5e5e5] focus:ring-1 focus:ring-blue-500 transition-all outline-none cursor-pointer"
            >
              {persona.archetypes.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              Analyzing bio and drafting copy...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 text-white animate-spin-slow" style={{ animationDuration: '4s' }} />
              Draft Brand Copy with Gemini AI
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[11px] text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Suggested outputs display */}
      {suggestions && (
        <div className="space-y-4 pt-4 border-t border-[#111]">
          
          {/* Tagline variations */}
          <div>
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2.5">Suggested Main Banner Taglines</h4>
            <div className="space-y-2">
              {suggestions.taglines.map((tagline, idx) => (
                <div 
                  key={idx}
                  onClick={() => applyTagline(tagline, idx)}
                  className="p-3 bg-[#050505]/40 border border-[#111] hover:border-blue-500 rounded-lg text-xs text-[#e5e5e5] cursor-pointer transition-all flex items-start gap-2.5 group"
                >
                  <div className="mt-0.5 min-w-[18px] h-[18px] rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold">
                    {idx + 1}
                  </div>
                  <p className="flex-1 text-[#c5c5c5] leading-relaxed group-hover:text-white">{tagline}</p>
                  <button className="text-[10px] font-bold text-blue-400 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10 flex items-center gap-1 shrink-0 group-hover:bg-blue-500/20 transition-all">
                    {appliedTaglineIdx === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Applied</span>
                      </>
                    ) : (
                      <>
                        <span>Apply</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subtitles & Specialty listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            
            {/* Subtitles list */}
            <div>
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2.5">Suggested Sub-specialties</h4>
              <div className="space-y-2">
                {suggestions.subtitles.map((sub, idx) => (
                  <div 
                    key={idx}
                    onClick={() => applySubtitle(sub, idx)}
                    className="p-2.5 bg-[#050505]/40 border border-[#111] hover:border-blue-500 rounded-lg text-[11px] text-[#c5c5c5] cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <span className="truncate flex-1 group-hover:text-white pr-2">{sub}</span>
                    <span className="text-[9px] font-bold text-blue-400 bg-blue-500/5 px-1.5 py-0.5 rounded border border-blue-500/10 shrink-0">
                      {appliedSubtitleIdx === idx ? "Applied" : "Apply"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Skills recommendation */}
            <div>
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2.5">AI Selected Skill Tags</h4>
              <div className="bg-[#050505]/30 border border-[#111] rounded-lg p-3 space-y-3">
                <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto">
                  {suggestions.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-0.5 bg-[#111] border border-[#222] text-[10px] font-mono rounded text-[#c5c5c5]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => applySkills(suggestions.skills)}
                  className="w-full py-1 px-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold rounded transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3 h-3 text-blue-400" />
                  Apply All Recommended Badges
                </button>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
