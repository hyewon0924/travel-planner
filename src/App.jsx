import React, { useState, useEffect, useMemo } from 'react'
import { ChevronUp, Check } from 'lucide-react'
import Header from './components/Header'
import DayTabs from './components/DayTabs'
import TimelineList from './components/TimelineList'
import WishlistSection from './components/WishlistSection'
import MapViewModal from './components/MapViewModal'
import BottomNav from './components/BottomNav'
import TripManagerModal from './components/TripManagerModal'
import {
  getStoredTrips,
  getActiveTripId,
  setActiveTripId
} from './utils/tripStorage'

export default function App() {
  const [trips] = useState(() => getStoredTrips())
  const [activeTripId, setActiveTripIdState] = useState(() => getActiveTripId(trips))

  const activeTrip = useMemo(() => {
    return trips.find((t) => t.id === activeTripId) || trips[0]
  }, [trips, activeTripId])

  const travelData = activeTrip || { tripInfo: {}, days: [] }

  const [activeDay, setActiveDay] = useState(1)
  const [activeTab, setActiveTab] = useState('schedule') // 'schedule' | 'wishlist'
  const [focusedItem, setFocusedItem] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [isTripManagerOpen, setIsTripManagerOpen] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const [toastText, setToastText] = useState('')

  // Scroll event listener for top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowTopBtn(true)
      } else {
        setShowTopBtn(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Day 변경 시 또는 Tab 변경 시 맨 위로 스크롤 이동
  useEffect(() => {
    scrollToTop()
  }, [activeDay, activeTab])

  // 여행 변경 시 activeDay를 1로 리셋
  const handleSelectTrip = (tripId) => {
    setActiveTripIdState(tripId)
    setActiveTripId(tripId)
    setActiveDay(1)
    handleShowToast('여행 계획이 전환되었습니다.')
  }

  // Visited state stored in localStorage (per trip)
  const storageKeyVisited = `${activeTripId}_visited_items`
  const [visitedItems, setVisitedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKeyVisited)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Trip 변경 시 해당 trip의 visitedItems 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${activeTripId}_visited_items`)
      setVisitedItems(saved ? JSON.parse(saved) : [])
    } catch {
      setVisitedItems([])
    }
  }, [activeTripId])

  // Save visited state to localStorage
  useEffect(() => {
    localStorage.setItem(storageKeyVisited, JSON.stringify(visitedItems))
  }, [visitedItems, storageKeyVisited])

  const toggleVisited = (id) => {
    setVisitedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleFocusOnMap = (item, isUserClick = true) => {
    setFocusedItem(item)
    setSelectedItemId(item.id)

    if (isUserClick && item && !item.hideOnMap) {
      setIsMapModalOpen(true)
    }
  }

  const handleShowToast = (msg) => {
    setToastText(msg)
    setTimeout(() => {
      setToastText('')
    }, 2200)
  }

  return (
    <div
      className="min-h-screen bg-slate-200/80 flex flex-col font-sans selection:bg-secondary-500 selection:text-white"
      style={{ paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* 1. Integrated Header & DayTabs (상단 스티키 헤더) */}
      <div className="sticky top-0 z-30 shadow-xs">
        <Header
          title={travelData.tripInfo?.title || '여행 계획'}
          period={
            travelData.tripInfo?.startDate
              ? `${travelData.tripInfo?.startDate} ~ ${travelData.tripInfo?.endDate || ''}`
              : '일정 정보 없음'
          }
          onOpenMapModal={() => setIsMapModalOpen(true)}
          onOpenTripManager={() => setIsTripManagerOpen(true)}
        />

        <DayTabs
          days={travelData.days || []}
          activeDay={activeDay}
          onSelectDay={setActiveDay}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      </div>

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4">
        {activeTab === 'schedule' ? (
          /* 일정 탭: 타임라인 리스트 */
          <TimelineList
            days={travelData.days || []}
            activeDay={activeDay}
            visitedItems={visitedItems}
            onToggleVisited={toggleVisited}
            onFocusOnMap={handleFocusOnMap}
            selectedItemId={selectedItemId}
            onShowToast={handleShowToast}
            hideDirectionsButton={Boolean(travelData.tripInfo?.hideDirectionsButton)}
          />
        ) : (
          /* 위시리스트 탭 */
          <WishlistSection trip={activeTrip} tripId={activeTripId} />
        )}
      </main>

      {/* 3. [🗺️ 동선보기] 지도 모달 */}
      <MapViewModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        days={travelData.days || []}
        activeDay={activeDay}
        focusedItem={focusedItem}
        onSelectSpot={(spot) => handleFocusOnMap(spot, false)}
      />

      {/* 4. 빠른 여행 목록 모달 */}
      <TripManagerModal
        isOpen={isTripManagerOpen}
        onClose={() => setIsTripManagerOpen(false)}
        trips={trips}
        activeTripId={activeTripId}
        onSelectTrip={handleSelectTrip}
      />

      {/* 6. 하단 네비게이션 바 */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 맨 위로 스크롤 버튼 */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          style={{ bottom: 'calc(5.75rem + env(safe-area-inset-bottom, 0px))' }}
          className="fixed right-4 z-30 w-10 h-10 rounded-full bg-slate-900 text-white shadow-xl flex items-center justify-center transition-all hover:bg-slate-800 active:scale-95 border border-slate-700"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* 토스트 메시지 (모바일 및 전 기기 완전 중앙 정렬 래퍼) */}
      {toastText && (
        <div
          style={{ bottom: 'calc(5.75rem + env(safe-area-inset-bottom, 0px))' }}
          className="fixed inset-x-0 z-50 flex justify-center items-center pointer-events-none px-4"
        >
          <div className="bg-slate-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md border border-slate-700/80 animate-fade-in flex items-center gap-1.5 pointer-events-auto whitespace-nowrap max-w-full">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastText}</span>
          </div>
        </div>
      )}
    </div>
  )
}
