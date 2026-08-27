import React from 'react'
import { Map, Calendar } from 'lucide-react'

export default function Header({ title, period, onOpenMapModal }) {
  return (
    <header className="bg-white pt-[env(safe-area-inset-top,0px)] border-b border-slate-100">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* 여행제목 & 여행기간 */}
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
            {title || '260829 오사카여행'}
          </h1>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mt-0.5">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{period || '8.29(토) ~ 8.31(월)'}</span>
          </div>
        </div>

        {/* 🗺️ 동선보기 버튼 */}
        <button
          onClick={onOpenMapModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs shadow-2xs transition-all active:scale-95 group"
          title="이동 동선 전체지도 보기"
        >
          <Map className="w-4 h-4 text-slate-500 group-hover:scale-110 transition-transform" />
          <span>동선보기</span>
        </button>
      </div>
    </header>
  )
}
