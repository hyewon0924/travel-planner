import React from 'react'
import { CalendarDays, Map, List, LayoutGrid } from 'lucide-react'

export default function DayTabs({ days, activeDay, onSelectDay, viewMode, onChangeViewMode }) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-[57px] z-20 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          {/* Day selection tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => onSelectDay('all')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeDay === 'all'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              전체 일정
            </button>

            {days.map((d) => {
              const isSelected = activeDay === d.day
              return (
                <button
                  key={d.day}
                  onClick={() => onSelectDay(d.day)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-[1.02]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>Day {d.day}</span>
                  <span className={`text-[11px] font-normal px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'text-slate-500'}`}>
                    {d.date}
                  </span>
                </button>
              )
            })}
          </div>

          {/* View mode toggle (Split / List / Map) */}
          <div className="flex items-center justify-end">
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => onChangeViewMode('split')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  viewMode === 'split'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="분할 뷰"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">분할</span>
              </button>
              <button
                onClick={() => onChangeViewMode('list')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="일정 리스트만"
              >
                <List className="w-3.5 h-3.5" />
                <span>일정</span>
              </button>
              <button
                onClick={() => onChangeViewMode('map')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  viewMode === 'map'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="지도만"
              >
                <Map className="w-3.5 h-3.5" />
                <span>지도</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
