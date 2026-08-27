import React, { useState, useEffect } from 'react'
import { ChevronUp, Heart, Check } from 'lucide-react'
import travelData from './data/travelPlan.json'
import Header from './components/Header'
import DayTabs from './components/DayTabs'
import TimelineList from './components/TimelineList'
import WishlistSection from './components/WishlistSection'
import MapViewModal from './components/MapViewModal'
import BottomNav from './components/BottomNav'

export default function App() {
  const [activeDay, setActiveDay] = useState(1) // Default to Day 1
  const [activeTab, setActiveTab] = useState('schedule') // 'schedule' | 'wishlist'
  const [focusedItem, setFocusedItem] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)

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

  // Visited state stored in localStorage
  const [visitedItems, setVisitedItems] = useState(() => {
    const saved = localStorage.getItem('osaka_visited_items')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return []
  })

  // Save visited state to localStorage
  useEffect(() => {
    localStorage.setItem('osaka_visited_items', JSON.stringify(visitedItems))
  }, [visitedItems])

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

  const [toastText, setToastText] = useState('')

  const handleShowToast = (msg) => {
    setToastText(msg)
    setTimeout(() => {
      setToastText('')
    }, 2200)
  }

  return (
    <div className="min-h-screen bg-slate-200/80 flex flex-col font-sans selection:bg-secondary-500 selection:text-white pb-16">
      {/* 1. Integrated Sticky Header & DayTabs (스크롤 시 간격 좁혀짐 완벽 방지) */}
      <div className="sticky top-0 z-30 shadow-xs">
        <Header
          title={travelData.tripInfo?.title || '큰누랑 짜우의 오사카 여행'}
          period={`${travelData.tripInfo?.startDate || '8.29'} ~ ${travelData.tripInfo?.endDate || '8.31'}`}
          onOpenMapModal={() => setIsMapModalOpen(true)}
        />

        <DayTabs
          days={travelData.days}
          activeDay={activeDay}
          onSelectDay={setActiveDay}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      </div>

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4">
        {activeTab === 'schedule' ? (
          /* 일정 탭: 스케치 형태의 타임라인 리스트 */
          <TimelineList
            days={travelData.days}
            activeDay={activeDay}
            visitedItems={visitedItems}
            onToggleVisited={toggleVisited}
            onFocusOnMap={handleFocusOnMap}
            selectedItemId={selectedItemId}
            onShowToast={handleShowToast}
          />
        ) : (
          /* 위시리스트 탭 */
          <WishlistSection />
        )}
      </main>

      {/* 3. [🗺️ 동선보기] 지도 모달 */}
      <MapViewModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        days={travelData.days}
        activeDay={activeDay}
        focusedItem={focusedItem}
        onSelectSpot={(spot) => handleFocusOnMap(spot, false)}
      />

      {/* 4. 하단 네비게이션 바 */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* 맨 위로 스크롤 버튼 */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-30 w-10 h-10 rounded-full bg-slate-900 text-white shadow-xl flex items-center justify-center transition-all hover:bg-slate-800 active:scale-95 border border-slate-700"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* 토스트 메시지 */}
      {toastText && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border border-slate-700/80 animate-fade-in flex items-center gap-1.5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastText}</span>
        </div>
      )}
    </div>
  )
}
