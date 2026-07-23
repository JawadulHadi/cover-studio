import React from "react";
import { BannerConfig } from "../types";
import { MapPin, Mail, ExternalLink, ShieldCheck, Award } from "lucide-react";

interface MockProfileProps {
  config: BannerConfig;
}

export default function MockProfile({ config }: MockProfileProps) {
  // Compute safe-zone overlap positions for preview avatar
  const isMobile = config.safeZoneDevice === "mobile";

  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl" id="mock-profile-preview">
      {/* Simulation Header bar */}
      <div className="bg-[#050505] px-4 py-2.5 border-b border-[#1a1a1a] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
          <span className="text-xs font-mono text-[#888] ml-2">LinkedIn Profile Preview Simulator</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#111] text-blue-400 uppercase tracking-widest text-[10px]">
            {config.safeZoneDevice} Mockup
          </span>
        </div>
      </div>

      {/* Main mockup card container */}
      <div className="bg-[#0a0a0a] text-[#e5e5e5] p-0 relative">
        
        {/* Banner container */}
        <div className="relative w-full aspect-[4/1] bg-[#050505] overflow-hidden select-none">
          {/* We render a scaled down image representation or a simple preview */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-[#666] italic">Live Banner Embedded Above</span>
          </div>
          
          {/* Duplicate active background styling to make the mock container realistic */}
          <div 
            className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
              config.themeColor === "sophisticated-dark" ? "bg-gradient-to-br from-[#050505] to-[#111]" :
              config.themeColor === "tech-navy" ? "bg-gradient-to-br from-[#0a1128] to-[#101f42]" :
              config.themeColor === "deep-space" ? "bg-gradient-to-br from-[#030712] to-[#111827]" :
              config.themeColor === "warm-sunset" ? "bg-gradient-to-br from-[#0c0a09] to-[#1c1917]" :
              config.themeColor === "minimal-white" ? "bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]" :
              "bg-gradient-to-br from-[#022c22] to-[#064e3b]"
            }`}
          >
            {/* Simple schematic of the text placement in the mock banner */}
            <div className="absolute inset-y-0 left-[28%] right-4 flex flex-col justify-center py-2">
              <div className={`font-bold text-[3%] text-opacity-90 ${config.themeColor === "minimal-white" ? "text-slate-900" : "text-white"}`} style={{ fontSize: '1.5vw' }}>
                {config.name}
              </div>
              <div className={`font-medium ${config.themeColor === "minimal-white" ? "text-slate-600" : "text-blue-400"}`} style={{ fontSize: '0.85vw' }}>
                {config.title}
              </div>
              <div className={`mt-1 line-clamp-1 italic text-opacity-80 ${config.themeColor === "minimal-white" ? "text-slate-700" : "text-slate-300"}`} style={{ fontSize: '0.75vw' }}>
                {config.tagline}
              </div>
              
              {/* Tech Badges Mockup */}
              <div className="flex gap-1 mt-2 overflow-hidden max-w-[80%]">
                {config.skills.slice(0, 5).map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-1.5 py-0.5 rounded-full border text-[0.5vw] font-bold"
                    style={{
                      backgroundColor: config.themeColor === "minimal-white" ? "rgba(15, 23, 42, 0.05)" : "rgba(59, 130, 246, 0.08)",
                      borderColor: config.themeColor === "minimal-white" ? "rgba(15, 23, 42, 0.12)" : `${config.accentColor || "#3b82f6"}33`,
                      color: config.themeColor === "minimal-white" ? "#0f172a" : (config.accentColor || "#3b82f6")
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Simulated Highlights on far right */}
            <div className="absolute right-4 top-4 bottom-4 w-[24%] border border-white/5 rounded p-1.5 flex flex-col justify-between hidden sm:flex">
              <div className="text-[0.55vw] text-[#888] font-bold uppercase tracking-widest">Highlights</div>
              {config.highlights.slice(0, 2).map((h, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[0.5vw] text-[#666] font-medium">{h.label}</span>
                  <span className="text-[0.6vw] text-white font-bold truncate">{h.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Picture Safe Zone Ring in the mockup */}
          <div 
            className={`absolute rounded-full border-4 border-[#0a0a0a] bg-[#111] transition-all duration-300 shadow-lg overflow-hidden flex items-center justify-center ${
              isMobile 
                ? "left-[10%] top-[40%] w-[18vw] h-[18vw]" 
                : "left-[4%] bottom-[-22%] w-[16vw] h-[16vw]"
            }`}
          >
            {config.customAvatarUrl ? (
              <img 
                src={config.customAvatarUrl} 
                alt={config.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-1">
                <span className="text-white font-bold text-[1.8vw] tracking-wider uppercase">
                  {config.name.split(" ").map(n => n[0]).join("")}
                </span>
                <span className="text-[#888] text-[0.45vw] font-mono leading-none hidden md:inline">AVATAR AREA</span>
              </div>
            )}
          </div>
        </div>

        {/* LinkedIn metadata detail block */}
        <div className="p-6 pt-10 sm:pt-12 bg-[#0a0a0a] relative">
          
          {/* Verification Badge */}
          <div className="absolute right-6 top-4 flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">AI Optimized</span>
          </div>

          {/* Personal Metadata */}
          <div className="space-y-1.5 mt-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">{config.name}</h2>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                <Award className="w-3 h-3" />
                <span>GOLD CREATOR</span>
              </div>
            </div>

            <p className="text-sm font-medium text-[#c5c5c5] max-w-2xl">{config.title}</p>
            
            <p className="text-xs text-[#888888] flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#666]" />
                {config.location}
              </span>
              <span className="text-[#222]">•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#666]" />
                {config.email}
              </span>
              <span className="text-[#222]">•</span>
              <span className="text-blue-400 hover:underline cursor-pointer flex items-center gap-1">
                Contact info
                <ExternalLink className="w-3 h-3" />
              </span>
            </p>

            <p className="text-xs text-[#888888] font-semibold pt-1">
              <span className="text-white font-bold">892</span> followers <span className="text-[#222]">•</span> <span className="text-white font-bold">500+</span> connections
            </p>
          </div>

          {/* Action buttons (Open To work, Add Section) */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button className="px-5 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-[#050505] text-xs font-bold transition-all shadow-md shadow-blue-500/10">
              Open to work
            </button>
            <button className="px-5 py-1.5 rounded-full border border-[#222] hover:bg-[#111] text-[#c5c5c5] text-xs font-bold transition-all">
              Add profile section
            </button>
            <button className="px-5 py-1.5 rounded-full border border-[#222] hover:bg-[#111] text-[#c5c5c5] text-xs font-bold transition-all">
              More
            </button>
            
            <div className="ml-auto flex items-center gap-2 text-[11px] text-[#666] bg-[#050505]/40 px-3 py-1.5 rounded border border-[#1a1a1a]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Actively looking for {config.title} roles</span>
            </div>
          </div>

          {/* Profile Bio / About Excerpt */}
          <div className="mt-6 pt-5 border-t border-[#1a1a1a]">
            <h3 className="text-xs font-bold text-[#888] uppercase tracking-widest mb-2.5">About Focus Summary</h3>
            <p className="text-xs text-[#c5c5c5] leading-relaxed max-w-3xl">
              {config.tagline}
              {config.subTitle ? ` ${config.subTitle}.` : ""}
              {config.skills.length > 0 ? ` Core stack: ${config.skills.slice(0, 6).join(", ")}.` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
