"use client";

import { useState } from "react";
import { Clock, PlayCircle, Sparkles } from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  startTime: number; // in seconds
  description?: string;
}

interface SmartChaptersProps {
  duration?: number | null; // in minutes from DB
  videoTitle: string;
}

export function SmartChapters({ duration, videoTitle }: SmartChaptersProps) {
  // Generate dummy chapters based on duration for demonstration
  // In a real scenario, this would come from the database (AI parsed)
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  if (!duration) return null;

  const totalSeconds = duration * 60;
  
  // Dummy AI chapters
  const chapters: Chapter[] = [
    { id: "ch-1", title: "Intro & Hook", startTime: 0, description: "Pengenalan dan ringkasan awal" },
    { id: "ch-2", title: "Build-up / Konflik", startTime: Math.floor(totalSeconds * 0.25), description: "Plot mulai berkembang" },
    { id: "ch-3", title: "Klimaks (AI Highlight)", startTime: Math.floor(totalSeconds * 0.6), description: "Bagian paling banyak ditonton" },
    { id: "ch-4", title: "Resolusi & Outro", startTime: Math.floor(totalSeconds * 0.9), description: "Kesimpulan video" },
  ];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (chapterId: string, time: number) => {
    setActiveChapter(chapterId);
    
    // In a real scenario, we would use a global video player store or ref
    // to call player.seekTo(time). For now, we simulate the action.
    console.log(`[AI Smart Chapters] Seeking to ${time}s for ${videoTitle}`);
    
    // Smoothly scroll to player if not in view
    document.getElementById("player-container")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-night-bg/50 border border-purple-500/30 rounded-xl p-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-bold text-white">AI Smart Chapters</h3>
        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full font-medium ml-2">Beta</span>
      </div>
      
      <p className="text-sm text-white/60 mb-4">
        Lompat langsung ke bagian paling menarik dari video ini berkat analisis AI otomatis.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => handleSeek(chapter.id, chapter.startTime)}
            className={`group flex items-start text-left p-3 rounded-lg border transition-all duration-300 ${
              activeChapter === chapter.id
                ? "bg-purple-900/40 border-purple-500/50"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded bg-black/50 flex flex-col items-center justify-center mr-3 relative overflow-hidden">
              {activeChapter === chapter.id ? (
                <PlayCircle className="w-6 h-6 text-purple-400 animate-pulse" />
              ) : (
                <>
                  <Clock className="w-4 h-4 text-white/40 mb-1" />
                  <span className="text-[10px] font-mono text-white/70">{formatTime(chapter.startTime)}</span>
                </>
              )}
            </div>
            <div>
              <h4 className={`text-sm font-bold mb-1 transition-colors ${
                activeChapter === chapter.id ? "text-purple-300" : "text-white/90 group-hover:text-purple-400"
              }`}>
                {chapter.title}
              </h4>
              {chapter.description && (
                <p className="text-xs text-white/50 line-clamp-1">{chapter.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
