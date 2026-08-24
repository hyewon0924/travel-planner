import React, { useEffect, useRef } from 'react'
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

  // Map of schedules by ID for fast lookup in observer
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

  // Scroll handler to focus map on closest card and handle bottom edge
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          ticking = false
          const cards = document.querySelectorAll('.timeline-card-item')
          if (!cards || cards.length === 0) return

          const parentScrollElem = containerRef.current?.parentElement
          const isContainerScroll = parentScrollElem && parentScrollElem.scrollHeight > parentScrollElem.clientHeight

          // 1. Handle very bottom of container/page
          if (isContainerScroll) {
            const isBottom = parentScrollElem.scrollTop + parentScrollElem.clientHeight >= parentScrollElem.scrollHeight - 40
            if (isBottom) {
              const lastCard = cards[cards.length - 1]
              const lastId = lastCard.getAttribute('data-item-id')
              const lastItem = scheduleMapRef.current[lastId]
              if (lastItem) {
                onFocusOnMap(lastItem, false)
              }
              return
            }
          } else {
            const windowHeight = window.innerHeight
            const totalHeight = document.documentElement.scrollHeight
            const currentScroll = window.scrollY || window.pageYOffset

            if (currentScroll + windowHeight >= totalHeight - 60) {
              const lastCard = cards[cards.length - 1]
              const lastId = lastCard.getAttribute('data-item-id')
              const lastItem = scheduleMapRef.current[lastId]
              if (lastItem) {
                onFocusOnMap(lastItem, false)
              }
              return
            }
          }

          // 2. Target line calculation (precise relative container positioning)
          let targetLine = window.innerHeight * 0.35
          if (isContainerScroll && parentScrollElem) {
            const containerRect = parentScrollElem.getBoundingClientRect()
            targetLine = containerRect.top + Math.min(containerRect.height * 0.3, 130)
          }

          let closestItem = null
          let minDistance = Infinity

          cards.forEach((card) => {
            const rect = card.getBoundingClientRect()
            const cardCenter = rect.top + rect.height / 2
            const distance = Math.abs(cardCenter - targetLine)

            if (distance < minDistance) {
              minDistance = distance
              const itemId = card.getAttribute('data-item-id')
              closestItem = scheduleMapRef.current[itemId]
            }
          })

          if (closestItem) {
            onFocusOnMap(closestItem, false)
          }
        })
        ticking = true
      }
    }

    const scrollParent = containerRef.current?.parentElement
    window.addEventListener('scroll', handleScroll, { passive: true })
    if (scrollParent) {
      scrollParent.addEventListener('scroll', handleScroll, { passive: true })
    }

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollParent) {
        scrollParent.removeEventListener('scroll', handleScroll)
      }
    }
  }, [displayedDays, onFocusOnMap])

  return (
    <div ref={containerRef} className="space-y-6 pb-24">
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
            <div className="space-y-2">
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
