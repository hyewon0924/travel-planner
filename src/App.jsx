import React, { useState, useEffect } from 'react'
import { ChevronUp, Heart, Check } from 'lucide-react'
import travelData from './data/travelPlan.json'
import Header from './components/Header'
import DayTabs from './components/DayTabs'
import TimelineList from './components/TimelineList'
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
      {/* 1. Header (여행제목, 여행기간, 🗺️ 동선보기 버튼) */}
      <Header
        title={travelData.tripInfo?.title || '큰누랑 짜우의 오사카 여행'}
        period={`${travelData.tripInfo?.startDate || '8.29'} ~ ${travelData.tripInfo?.endDate || '8.31'}`}
        onOpenMapModal={() => setIsMapModalOpen(true)}
      />

      {/* 2. Day Tabs (Sticky Header) */}
      {activeTab === 'schedule' && (
        <DayTabs
          days={travelData.days}
          activeDay={activeDay}
          onSelectDay={setActiveDay}
        />
      )}

      {/* 3. Main Content Container */}
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
          /* 위시리스트 탭: 사용자 피드백에 따라 임의 구현 없이 하단 탭 스케치 유지 */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-14 h-14 rounded-full bg-secondary-950 flex items-center justify-center text-secondary-500">
              <Heart className="w-7 h-7 fill-secondary-500" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900">위시리스트</h2>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              위시리스트 탭 영역입니다.
            </p>
          </div>
        )}
      </main>

      {/* 4. [🗺️ 동선보기] 지도 모달 (지도 동선 미표기 제외 처리됨) */}
      <MapViewModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        days={travelData.days}
        activeDay={activeDay}
        focusedItem={focusedItem}
        onSelectSpot={(spot) => handleFocusOnMap(spot, false)}
      />

      {/* 5. 하단 네비게이션 바 ([31 일정] [🤍 위시리스트]) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* 맨 위로 스크롤 버튼 (지도 모달 z-[100] 아래로 가려지도록 z-30 지정) */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-30 w-10 h-10 rounded-full bg-slate-900 text-white shadow-xl flex items-center justify-center transition-all hover:bg-slate-800 active:scale-95 border border-slate-700"
          aria-label="맨 위로 이동"
          title="맨 위로 이동"
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>
      )}

      {/* 6. 전역 토스트 팝업 (최상단 z-[110] 지정) */}
      {toastText && (
        <div className="fixed bottom-20 left-0 right-0 z-[110] flex justify-center px-4 pointer-events-none animate-fade-in">
          <div className="bg-slate-900/95 text-white text-[11px] font-extrabold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-center gap-2 border border-slate-700 max-w-xs w-full text-center leading-snug">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="break-keep">{toastText}</span>
          </div>
        </div>
      )}
    </div>
  )
}
