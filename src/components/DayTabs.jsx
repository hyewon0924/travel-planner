import React from 'react'

export default function DayTabs({ days, activeDay, onSelectDay, activeTab }) {
  return (
    <div className="sticky top-[57px] z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 py-3 px-4 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-start gap-2 overflow-x-auto no-scrollbar">
        {activeTab === 'schedule' ? (
          /* 일정 탭: Day 1, Day 2, Day 3 버튼만 노출 */
          days.map((d) => {
            const isSelected = activeDay === d.day
            return (
              <button
                key={d.day}
                onClick={() => onSelectDay(d.day)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-secondary-500 text-white shadow-md border border-secondary-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>Day{d.day}</span>
                <span className={isSelected ? 'text-white/90 font-extrabold' : 'text-slate-500'}>
                  {d.date}
                </span>
              </button>
            )
          })
        ) : (
          /* 위시리스트 탭: 짜우 버튼 (보라색 알약 형태, 깔끔한 그림자 및 테두리) */
          <button
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 bg-purple-600 text-white shadow-md border border-purple-400"
          >
            <span>짜우</span>
          </button>
        )}
      </div>
    </div>
  )
}
