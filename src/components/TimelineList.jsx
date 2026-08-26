import React, { useEffect, useRef } from 'react'
import TimelineCard from './TimelineCard'
import { Calendar } from 'lucide-react'

export default function TimelineList({
  days,
  activeDay,
  visitedItems,
  onToggleVisited,
  onFocusOnMap,
  selectedItemId
}) {
  const displayedDays = activeDay === 'all' ? days : days.filter((d) => d.day === activeDay)

  const scheduleMapRef = useRef({})

  useEffect(() => {
    const map = {}
    displayedDays.forEach((d) => {
      d.schedules.forEach((s) => {
        map[s.id] = s
      })
    })
    scheduleMapRef.current = map
  }, [displayedDays])

  const containerRef = useRef(null)

  return (
    <div ref={containerRef} className="space-y-6 pb-20">
      {displayedDays.map((dayData) => {
        const hasSchedules = dayData.schedules && dayData.schedules.length > 0

        return (
          <div key={dayData.day} className="space-y-3">
            {/* Schedules Timeline Cards */}
            {hasSchedules ? (
              <div className="pt-2">
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
                    isLast={idx === dayData.schedules.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-white/70 rounded-3xl border border-slate-200 shadow-xs my-4 space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-500">Day {dayData.day} 일정이 준비 중입니다.</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
