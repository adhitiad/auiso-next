"use client"

import { useState } from "react"
import { MessageSquareHeart, AlertTriangle } from "lucide-react"

const ChatPage = () => {
  const [showOverlay, setShowOverlay] = useState(true)
  
  // Dalam production, ganti URL ini dengan link embed Unit Host AI atau antarmuka web SillyTavern
  const UNIT_HOST_EMBED_URL = "https://unithost.ai/embed/placeholder-character"

  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] bg-night-bg">
      <div className="flex-none p-4 border-b border-white/10 bg-night-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquareHeart className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-xl font-serif font-bold text-white leading-tight">AI Companion 18+</h1>
            <p className="text-xs text-white/50">Didukung oleh Unit Host AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1.5 rounded-full border border-red-500/20 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" /> NSFW
        </div>
      </div>
      
      <div className="flex-grow w-full h-full relative">
        <iframe
          src={UNIT_HOST_EMBED_URL}
          className="absolute inset-0 w-full h-full border-none"
          title="Unit Host AI Chat"
          allow="microphone"
        >
          {/* Fallback jika iframe diblokir */}
          <div className="flex items-center justify-center h-full w-full bg-night-bg text-white/50">
            <p>Peramban Anda tidak mendukung iframe, atau koneksi ke Unit Host AI diblokir.</p>
          </div>
        </iframe>
        
        {/* Overlay pengingat pengembangan */}
        {showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-center z-10">
            <div className="bg-night-card p-8 rounded-2xl border border-white/10 max-w-lg shadow-2xl">
              <MessageSquareHeart className="w-16 h-16 mx-auto text-purple-400 mb-6" />
              <h2 className="text-2xl font-serif font-bold text-white mb-4">Peringatan Mode Pengembangan</h2>
              <p className="text-white/60 mb-6 leading-relaxed">
                Fitur ini merupakan pratinjau integrasi dengan <strong>SillyTavern</strong> atau <strong>Unit Host AI</strong>.
              </p>
              <p className="text-sm text-cyan-400 bg-cyan-400/10 p-4 rounded-lg border border-cyan-400/20 mb-6">
                URL Iframe saat ini mengarah ke placeholder. Pastikan Anda mengatur <code>UNIT_HOST_EMBED_URL</code> dengan link karakter Anda yang sebenarnya di <em>production</em>.
              </p>
              <button 
                onClick={() => setShowOverlay(false)}
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}


export default ChatPage;
