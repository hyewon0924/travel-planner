import React from 'react'
import { CalendarDays } from 'lucide-react'

export default function DayTabs({ days, activeDay, onSelectDay }) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-[52px] sm:top-[57px] z-20 shadow-sm">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Day selection tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0 w-full">
            <button
              onClick={() => onSelectDay('all')}
              className={`px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1 flex-shrink-0 ${
                activeDay === 'all'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
              <span>전체 일정</span>
            </button>

            {days.map((d) => {
              const isSelected = activeDay === d.day
              return (
                <button
                  key={d.day}
                  onClick={() => onSelectDay(d.day)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1 flex-shrink-0 ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-[1.02]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>Day {d.day}</span>
                  <span className={`text-[10px] font-normal px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'text-slate-500'}`}>
                    {d.date}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
