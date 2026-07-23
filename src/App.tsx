import React, { useState, useRef } from "react";
import { BannerConfig } from "./types";
import BannerCanvas from "./components/BannerCanvas";
import MockProfile from "./components/MockProfile";
import EditorPanel from "./components/EditorPanel";
import AIHelper from "./components/AIHelper";
import AuthPanel from "./components/AuthPanel";
import { 
  Download, Eye, EyeOff, Layout, Sparkles, Sliders, Check, 
  HelpCircle, RefreshCw, Briefcase, Award, Shield, CheckCircle2, Laptop 
} from "lucide-react";

// Neutral, fictional demo profile — no real personal data (org privacy rule).
// Single source of truth for both the initial state and "Reset Demo".
const DEFAULT_CONFIG: BannerConfig = {
  name: "Jordan Ellis",
  title: "Senior Software Engineer",
  tagline: "I build backend systems that scale, AI features that ship, and integrations that connect.",
  subTitle: "Specializing in Web Applications, Scalable Cloud Architectures & Generative AI",
  email: "jordan.ellis@example.com",
  location: "Singapore",
  skills: ["NestJS", "TypeScript", "Node.js", "PostgreSQL", "Docker", "GCP", "Gemini 2.5", "BullMQ"],
  templateId: "sophisticated-dark",
  themeColor: "sophisticated-dark",
  accentColor: "#3b82f6",
  textColor: "#ffffff",
  bgPattern: "grid",
  customLogoUrl: "",
  customAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80", // Generic stock headshot
  showProfileSafeZone: true,
  safeZoneDevice: "desktop",
  gridOverlay: true,
  fontWeight: "bold",
  fontFamily: "Space Grotesk",
  customBgUrl: "",
  aiStyleMode: "Architectural & Scale-focused",
  highlights: [
    { label: "Experience", value: "7+ Years" },
    { label: "Focus", value: "100+ Projects" },
    { label: "Cloud Systems", value: "GCP Certified" }
  ]
};

export default function App() {
  const [config, setConfig] = useState<BannerConfig>(DEFAULT_CONFIG);

  const [notification, setNotification] = useState<string | null>(null);

  // Reference to hold the download/export function triggered from the canvas child
  const triggerExportRef = useRef<() => void>(() => {});

  const handleUpdateConfig = (updates: Partial<BannerConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleTriggerExport = () => {
    if (triggerExportRef.current) {
      triggerExportRef.current();
      showToast("High-resolution LinkedIn cover (1584x396px) generated and downloaded!");
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleResetToDefault = () => {
    setConfig(DEFAULT_CONFIG);
    showToast("Reset to the default demo profile!");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] app-glow-grid flex flex-col font-sans relative" id="studio-app-root">
      
      {/* Glossy top-level alert block */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0a0a0a] border border-emerald-500/30 text-emerald-400 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider">{notification}</span>
        </div>
      )}

      {/* Header bar with glassmorphic overlay */}
      <header className="border-b border-[#111] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Layout className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              Qeloma Cover Studio
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase tracking-widest">
                Beta
              </span>
            </h1>
            <p className="text-xs text-slate-400">Design high-end, minimalist LinkedIn cover banners for any profession — AI-assisted copy & safe-zone guides</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDefault}
            className="px-3 py-1.5 rounded-lg border border-[#1a1a1a] hover:bg-[#111] text-xs text-[#c5c5c5] font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset text & style variables"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#888]" />
            <span>Reset Demo</span>
          </button>
          
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded bg-[#050505]/60 border border-[#111] text-[10px] font-mono font-semibold text-[#888]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Canvas Ready</span>
          </div>

          <AuthPanel />
        </div>
      </header>

      {/* Main dashboard content container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* Dynamic Canvas Designer Area */}
        <section className="space-y-4" id="banner-canvas-section">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>Real-Time Canvas Workspace (1584 x 396 px)</span>
            </h3>

            <div className="flex items-center gap-2.5">
              {/* Grid overlay toggle */}
              <button
                onClick={() => handleUpdateConfig({ gridOverlay: !config.gridOverlay })}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  config.gridOverlay 
                    ? "bg-[#0a0a0a] border-blue-500/30 text-blue-400" 
                    : "border-[#1a1a1a] text-[#666] hover:text-[#c5c5c5]"
                }`}
                title="Toggle bento separator boundaries"
              >
                <span>Bento Grid Borders:</span>
                <span className="font-mono uppercase">{config.gridOverlay ? "ON" : "OFF"}</span>
              </button>

              {/* Safe zone overlay indicator toggle */}
              <button
                onClick={() => handleUpdateConfig({ showProfileSafeZone: !config.showProfileSafeZone })}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  config.showProfileSafeZone 
                    ? "bg-[#0a0a0a] border-red-500/20 text-red-400" 
                    : "border-[#1a1a1a] text-[#666] hover:text-[#c5c5c5]"
                }`}
                title="Toggle LinkedIn profile image shadow region"
              >
                {config.showProfileSafeZone ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>Avatar Overlap Guide</span>
              </button>
            </div>
          </div>

          {/* Active Canvas wrapper */}
          <div className="relative group rounded-xl overflow-hidden p-0.5 bg-[#111] border border-[#1a1a1a]">
            <BannerCanvas 
              config={config} 
              onExportRef={(fn) => { triggerExportRef.current = fn; }}
            />
            
            {/* Embedded Action Bar */}
            <div className="absolute right-4 bottom-4 flex items-center gap-2.5">
              <button
                onClick={handleTriggerExport}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold rounded-lg text-xs transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20 cursor-pointer"
              >
                <Download className="w-4 h-4 text-white stroke-[2.5]" />
                <span>Download High-Res PNG</span>
              </button>
            </div>
          </div>
        </section>

        {/* Column splits: Controls vs Previews & AI */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="controls-preview-grid">
          
          {/* LEFT: Controls (Style settings, inputs, badges) (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The Tabbed Editor panel */}
            <EditorPanel 
              config={config} 
              onChangeConfig={handleUpdateConfig} 
            />

            {/* Profile Placement mockup simulator */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-400" />
                <span>Simulated LinkedIn Feed Context Mockup</span>
              </h3>
              <MockProfile config={config} />
            </div>

          </div>

          {/* RIGHT: Gemini Copilot / Copywriter & Architecture (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* AI Copywriting draft assistant */}
            <AIHelper 
              config={config} 
              onChangeConfig={handleUpdateConfig} 
            />

            {/* Quick Tips & Platform Guidelines card */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-[#c5c5c5] uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Design Checklist & Safe-Zone Rules</span>
              </h4>
              
              <ul className="space-y-3 text-xs text-[#888888]">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Rule of Left-Pushed Typography</strong>: Always group your name, position, and taglines on the center-right (offset x &gt; 420px). This ensures your text completely avoids being covered by the avatar on both desktop and mobile devices.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Bento Grid Metrics Alignment</strong>: Fill out your accomplishments (Experience, Certifications, SaaS statistics) on the far right block. This balances the visual weight of the left-aligned avatar.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Clean Digital Grid</strong>: Use the <em>Sophisticated Dark</em> or <em>Deep Space</em> presets for engineering cover designs. Grid lines represent highly structured systems and engineering cleanliness.
                  </span>
                </li>
              </ul>

              <div className="bg-[#050505]/60 rounded-lg p-3.5 border border-[#111] flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-500 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-white uppercase tracking-wider">LinkedIn Spec Optimization</p>
                  <p className="text-[10px] text-[#666]">1584x396px output at exactly 4:1 aspect ratio, meeting LinkedIn's precise uploading standards.</p>
                </div>
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* Footer bar */}
      <footer className="mt-12 border-t border-[#111] bg-[#050505]/80 py-6 px-6 text-center text-xs text-[#555]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Qeloma Cover Studio. Craft a standout LinkedIn banner in minutes.</p>
          <div className="flex items-center gap-4 text-[#444]">
            <span>Built by Qeloma • Powered by Gemini AI</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy-first</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
