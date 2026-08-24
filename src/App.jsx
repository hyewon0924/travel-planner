import React, { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import travelData from './data/travelPlan.json'
import Header from './components/Header'
import DayTabs from './components/DayTabs'
import TimelineList from './components/TimelineList'
import GoogleMapView from './components/GoogleMapView'
import ExpenseSummary from './components/ExpenseSummary'
import TravelTipsModal from './components/TravelTipsModal'
import ChecklistModal from './components/ChecklistModal'

export default function App() {
  const [activeDay, setActiveDay] = useState(1) // Default to Day 1
  const [viewMode, setViewMode] = useState('split') // 'split' | 'list' | 'map'
  const [focusedItem, setFocusedItem] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null)
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

  // Modals state
  const [isTipsOpen, setIsTipsOpen] = useState(false)
  const [isChecklistOpen, setIsChecklistOpen] = useState(false)

  // Save visited state to localStorage
  useEffect(() => {
    localStorage.setItem('osaka_visited_items', JSON.stringify(visitedItems))
  }, [visitedItems])

  const toggleVisited = (id) => {
    setVisitedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleFocusOnMap = (item) => {
    setFocusedItem(item)
    setSelectedItemId(item.id)
    // If on mobile and in 'list' view, automatically switch to 'split'
    if (viewMode === 'list') {
      setViewMode('split')
    }
    // Scroll map container into view if on mobile
    if (window.innerWidth < 768) {
      const mapElem = document.getElementById('map-section')
      if (mapElem) {
        mapElem.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenTips={() => setIsTipsOpen(true)}
        onOpenChecklist={() => setIsChecklistOpen(true)}
      />

      {/* Day Selector & View Mode Switcher */}
      <DayTabs
        days={travelData.days}
        activeDay={activeDay}
        onSelectDay={setActiveDay}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* Cost Summary Widget */}
        {/* <ExpenseSummary days={travelData.days} activeDay={activeDay} /> */}

        {/* Content Layout based on viewMode */}
        <div
          className={`grid gap-6 ${
            viewMode === 'split'
              ? 'grid-cols-1 md:grid-cols-12'
              : viewMode === 'list'
              ? 'grid-cols-1'
              : 'grid-cols-1'
          }`}
        >
          {/* Map Column (shown in 'split' or 'map' mode) */}
          {(viewMode === 'split' || viewMode === 'map') && (
            <div
              id="map-section"
              className={`${
                viewMode === 'split'
                  ? 'md:col-span-6 lg:col-span-5 md:sticky md:top-[124px] h-[380px] md:h-[calc(100vh-150px)]'
                  : 'h-[78vh]'
              } transition-all duration-300`}
            >
              <GoogleMapView
                days={travelData.days}
                activeDay={activeDay}
                focusedItem={focusedItem}
              />
            </div>
          )}

          {/* Timeline Column (shown in 'split' or 'list' mode) */}
          {(viewMode === 'split' || viewMode === 'list') && (
            <div
              className={`${
                viewMode === 'split'
                  ? 'md:col-span-6 lg:col-span-7'
                  : 'max-w-2xl mx-auto w-full'
              }`}
            >
              <TimelineList
                days={travelData.days}
                activeDay={activeDay}
                visitedItems={visitedItems}
                onToggleVisited={toggleVisited}
                onFocusOnMap={handleFocusOnMap}
                selectedItemId={selectedItemId}
              />
            </div>
          )}
        </div>
      </main>

      {/* Floating Scroll To Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-40 w-11 h-11 rounded-2xl bg-slate-900/90 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:bg-rose-600 hover:scale-110 active:scale-95 animate-fade-in group"
          aria-label="맨 위로 이동"
          title="맨 위로 이동"
        >
          <ChevronUp className="w-5 h-5 text-rose-400 group-hover:text-white transition-colors" />
        </button>
      )}

      {/* Modals */}
      <TravelTipsModal
        isOpen={isTipsOpen}
        onClose={() => setIsTipsOpen(false)}
        quickLinks={travelData.quickLinks}
      />

      <ChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        initialChecklist={travelData.checklist}
      />
    </div>
  )
}
