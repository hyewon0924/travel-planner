import React from 'react'
import { Map, Calendar, ChevronDown, Menu } from 'lucide-react'

export default function Header({ title, period, onOpenMapModal, onOpenTripManager }) {
  return (
    <header className="bg-white pt-[env(safe-area-inset-top,0px)] border-b border-slate-100">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* 여행제목 & 여행기간 (클릭 시 여행 선택 모달) */}
        <button
          onClick={onOpenTripManager}
          className="text-left group flex items-start gap-2 p-1 -ml-1 rounded-xl hover:bg-slate-50 transition active:scale-[0.98] min-w-0"
          title="여행 계획 목록 확인 및 변경"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-slate-700 transition truncate">
                {title || '260829 오사카여행'}
              </h1>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-y-0.5 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mt-0.5">
              <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="truncate">{period || '8.29(토) ~ 8.31(월)'}</span>
            </div>
          </div>
        </button>

        {/* 우측 액션 버튼: [🗺️ 동선보기] & [≡ 빠른네비] */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onOpenMapModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs shadow-2xs transition-all active:scale-95 group"
            title="이동 동선 전체지도 보기"
          >
            <Map className="w-4 h-4 text-slate-500 group-hover:scale-110 transition-transform" />
            <span>동선보기</span>
          </button>

          <button
            onClick={onOpenTripManager}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all active:scale-95"
            title="빠른 네비게이션 (여행 계획 목록)"
            aria-label="여행 목록 메뉴"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  )
}

