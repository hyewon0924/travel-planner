import React from 'react'
import { Plane, Calendar, CheckSquare, Sparkles } from 'lucide-react'

export default function Header({ onOpenTips, onOpenChecklist }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Title & Date */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 flex-shrink-0">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-lg font-bold tracking-tight truncate">오사카 2박 3일</h1>
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">
              <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span>08.29(토) ~ 08.31(월)</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={onOpenTips}
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium px-2.5 py-1.5 rounded-xl border border-slate-700 transition active:scale-95 shadow-sm whitespace-nowrap"
            title="쿠폰 및 꿀팁"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="hidden sm:inline">쿠폰·꿀팁</span>
            <span className="sm:hidden">꿀팁</span>
          </button>

          <button
            onClick={onOpenChecklist}
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-300 font-medium px-2.5 py-1.5 rounded-xl border border-slate-700 transition active:scale-95 shadow-sm whitespace-nowrap"
            title="체크리스트"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="hidden sm:inline">준비물</span>
            <span className="sm:hidden">체크</span>
          </button>
        </div>
      </div>
    </header>
  )
}
