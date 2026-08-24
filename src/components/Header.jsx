import React from 'react'
import { Plane, Calendar, CheckSquare, Sparkles } from 'lucide-react'

export default function Header({ onOpenTips, onOpenChecklist }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-bold tracking-tight">오사카 2박 3일 여행</h1>
              <span className="text-[11px] bg-rose-500/30 text-rose-300 font-semibold px-2 py-0.5 rounded-full border border-rose-500/40">
                🇯🇵 OSAKA
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                2026.08.29(토) ~ 08.31(월)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenTips}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium px-3 py-1.5 rounded-xl border border-slate-700 transition active:scale-95 shadow-sm"
            title="쿠폰 및 꿀팁"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>쿠폰·꿀팁</span>
          </button>

          <button
            onClick={onOpenChecklist}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-300 font-medium px-3 py-1.5 rounded-xl border border-slate-700 transition active:scale-95 shadow-sm"
            title="체크리스트"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>준비물</span>
          </button>
        </div>
      </div>
    </header>
  )
}
