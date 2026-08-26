import React from 'react'
import { Calendar, Heart } from 'lucide-react'

export default function BottomNav({ activeTab, onSelectTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg py-2 px-4">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* 일정 탭 */}
        <button
          onClick={() => onSelectTab('schedule')}
          className={`flex flex-col items-center gap-0.5 py-1 px-5 rounded-2xl transition-all ${
            activeTab === 'schedule'
              ? 'text-rose-600 font-black scale-105'
              : 'text-slate-500 font-semibold hover:text-slate-800'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center border-2 ${
              activeTab === 'schedule'
                ? 'border-rose-500 bg-rose-50'
                : 'border-slate-300 bg-slate-50'
            }`}
          >
            <span className="text-xs font-black">31</span>
          </div>
          <span className="text-[11px]">일정</span>
        </button>

        {/* 위시리스트 탭 */}
        <button
          onClick={() => onSelectTab('wishlist')}
          className={`flex flex-col items-center gap-0.5 py-1 px-5 rounded-2xl transition-all ${
            activeTab === 'wishlist'
              ? 'text-rose-600 font-black scale-105'
              : 'text-slate-500 font-semibold hover:text-slate-800'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center ${
              activeTab === 'wishlist' ? 'text-rose-500' : 'text-slate-400'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                activeTab === 'wishlist' ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
          </div>
          <span className="text-[11px]">위시리스트</span>
        </button>
      </div>
    </nav>
  )
}
