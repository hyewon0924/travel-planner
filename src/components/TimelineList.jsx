import React, { useEffect, useRef, useState } from 'react'
import TimelineCard from './TimelineCard'
import { Calendar } from 'lucide-react'

// 스케줄의 시각(time) 및 timePeriod("오전"/"오후")를 분 단위 숫자로 변환하는 헬퍼
const parseTimeToMinutes = (timeStr, period) => {
  if (!timeStr) return 0
  const parts = timeStr.split(':')
  let hours = parseInt(parts[0], 10)
  const minutes = parseInt(parts[1] || '0', 10)

  if (period === '오후' && hours < 12) {
    hours += 12
  } else if (period === '오전' && hours === 12) {
    hours = 0
  }
  return hours * 60 + minutes
}

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

  // 현재 시각State (기본값: 실제 현재시각)
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  })

  // 매 1분마다 현재시각 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const containerRef = useRef(null)

  return (
    <div ref={containerRef} className="space-y-6 pb-20">
      {displayedDays.map((dayData) => {
        const hasSchedules = dayData.schedules && dayData.schedules.length > 0

        // 현재 날짜(YYYY-MM-DD)와 해당 Day의 fullDate가 일치하는 당일인지 검사
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const date = String(now.getDate()).padStart(2, '0')
        const todayStr = `${year}-${month}-${date}`

        // 당일 날짜와 일치할 때만 시간 판별하여 활성화
        const isToday = dayData.fullDate === todayStr

        let currentActiveIdx = -1
        if (hasSchedules && isToday) {
          // 각 일정의 시작 분 구하기
          const scheduleMinutes = dayData.schedules.map((s) =>
            parseTimeToMinutes(s.time, s.timePeriod)
          )

          for (let i = 0; i < dayData.schedules.length; i++) {
            const startMin = scheduleMinutes[i]
            const nextMin = i < dayData.schedules.length - 1 ? scheduleMinutes[i + 1] : 24 * 60

            if (currentMinutes >= startMin && currentMinutes < nextMin) {
              currentActiveIdx = i
              break
            }
          }
        }

        return (
          <div key={dayData.day} className="space-y-3">
            {/* Schedules Timeline Cards */}
            {hasSchedules ? (
              <div className="pt-2">
                {dayData.schedules.map((schedule, idx) => {
                  const isCurrentActive = idx === currentActiveIdx

                  return (
                    <TimelineCard
                      key={schedule.id}
                      item={schedule}
                      index={idx}
                      dayNumber={dayData.day}
                      isVisited={visitedItems.includes(schedule.id)}
                      onToggleVisited={onToggleVisited}
                      onFocusOnMap={onFocusOnMap}
                      isSelected={selectedItemId === schedule.id}
                      isCurrentActive={isCurrentActive}
                      isLast={idx === dayData.schedules.length - 1}
                    />
                  )
                })}
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
