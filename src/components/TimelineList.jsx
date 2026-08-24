import React from 'react'
import TimelineCard from './TimelineCard'
import { Calendar, Compass } from 'lucide-react'

export default function TimelineList({
  days,
  activeDay,
  visitedItems,
  onToggleVisited,
  onFocusOnMap,
  selectedItemId
}) {
  const displayedDays = activeDay === 'all' ? days : days.filter((d) => d.day === activeDay)

  return (
    <div className="space-y-6 pb-12">
      {displayedDays.map((dayData) => {
        const completedCount = dayData.schedules.filter((s) => visitedItems.includes(s.id)).length
        const totalCount = dayData.schedules.length
        const progressPercent = Math.round((completedCount / totalCount) * 100) || 0

        return (
          <div key={dayData.day} className="space-y-3">
            {/* Day Header Banner */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-base flex items-center justify-center shadow-md">
                  D{dayData.day}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      Day {dayData.day} · {dayData.date}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{dayData.title}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="text-right">
                <div className="text-xs font-bold text-slate-700">
                  {completedCount} / {totalCount} 완료
                </div>
                <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-200">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Schedules Timeline Cards */}
            <div className="space-y-3">
              {dayData.schedules.map((schedule, idx) => (
                <TimelineCard
                  key={schedule.id}
                  item={schedule}
                  index={idx}
                  dayNumber={dayData.day}
                  isVisited={visitedItems.includes(schedule.id)}
                  onToggleVisited={onToggleVisited}
                  onFocusOnMap={onFocusOnMap}
                  isSelected={selectedItemId === schedule.id}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
