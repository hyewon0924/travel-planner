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

  const handleFocusOnMap = (item, isUserClick = true) => {
    setFocusedItem(item)
    setSelectedItemId(item.id)

    if (isUserClick && item) {
      setTimeout(() => {
        const cardElem = document.getElementById(`timeline-card-${item.id}`)
        const container = document.getElementById('timeline-scroll-container')
        if (!cardElem) return

        if (container && window.innerWidth < 768) {
          const containerRect = container.getBoundingClientRect()
          const cardRect = cardElem.getBoundingClientRect()
          
          // Compute exact relative offset inside container with clean margin
          const offsetDiff = cardRect.top - containerRect.top
          const targetScroll = container.scrollTop + offsetDiff - 8

          container.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'smooth'
          })
        } else {
          cardElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }, 20)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenTips={() => setIsTipsOpen(true)}
        onOpenChecklist={() => setIsChecklistOpen(true)}
      />

      {/* Day Selector */}
      <DayTabs
        days={travelData.days}
        activeDay={activeDay}
        onSelectDay={setActiveDay}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* Cost Summary Widget */}
        {/* <ExpenseSummary days={travelData.days} activeDay={activeDay} /> */}

        {/* Content Layout (Split View) */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-12 items-start">
          {/* Map Column (Expanded View Height) */}
          <div
            id="map-section"
            className="col-span-1 md:col-span-6 lg:col-span-5 md:sticky md:top-[124px] z-10 h-[300px] sm:h-[360px] md:h-[calc(100vh-150px)] transition-all duration-300 rounded-3xl overflow-hidden shadow-md"
          >
            <GoogleMapView
              days={travelData.days}
              activeDay={activeDay}
              focusedItem={focusedItem}
              onSelectSpot={(item) => handleFocusOnMap(item, true)}
            />
          </div>

          {/* Timeline Column (Independent Scroll Container on mobile/tablet) */}
          <div
            id="timeline-scroll-container"
            className="col-span-1 md:col-span-6 lg:col-span-7 h-[calc(100vh-420px)] md:h-auto overflow-y-auto md:overflow-visible p-2 sm:p-3 rounded-2xl no-scrollbar"
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
