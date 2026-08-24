import React, { useState, useEffect } from 'react'
import {
  MapPin,
  Navigation,
  ExternalLink,
  Route,
  Compass,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { getCategoryInfo } from '../utils/helpers'

export default function GoogleMapView({ days, activeDay, focusedItem }) {
  // Filter spots to display based on activeDay
  const displayedSpots = React.useMemo(() => {
    const list = []
    const targetDays = activeDay === 'all' ? days : days.filter((d) => d.day === activeDay)

    targetDays.forEach((d) => {
      d.schedules.forEach((s, idx) => {
        if (s.coords && s.coords.lat && s.coords.lng) {
          list.push({
            ...s,
            day: d.day,
            dayDate: d.date,
            seqNumber: idx + 1
          })
        }
      })
    })
    return list
  }, [days, activeDay])

  // Filter only Osaka spots (excluding Incheon airport for local map view)
  const osakaSpots = React.useMemo(() => {
    return displayedSpots.filter((s) => s.coords.lat < 36.0)
  }, [displayedSpots])

  // Current selected spot for iframe view (default to first spot of the selected day or focused item)
  const [selectedSpot, setSelectedSpot] = useState(null)

  useEffect(() => {
    if (focusedItem && focusedItem.coords) {
      setSelectedSpot(focusedItem)
    } else if (osakaSpots.length > 0) {
      setSelectedSpot(osakaSpots[0])
    } else {
      setSelectedSpot(null)
    }
  }, [focusedItem, activeDay, osakaSpots])

  // Google Maps Embed URL generator (100% Free, No API Key needed)
  const getEmbedUrl = (spot) => {
    if (!spot || !spot.coords) {
      // Default to Osaka center
      return `https://maps.google.com/maps?q=34.6850,135.5050&hl=ko&z=13&output=embed`
    }
    const query = encodeURIComponent(`${spot.title} ${spot.location || ''} 오사카`)
    return `https://maps.google.com/maps?q=${spot.coords.lat},${spot.coords.lng}&hl=ko&z=16&output=embed`
  }

  // Google Maps Full Day Route Directions Link (Connects all spots in sequence)
  const getFullDayRouteUrl = () => {
    if (osakaSpots.length === 0) return 'https://www.google.com/maps'
    if (osakaSpots.length === 1) {
      return `https://www.google.com/maps/search/?api=1&query=${osakaSpots[0].coords.lat},${osakaSpots[0].coords.lng}`
    }

    const origin = `${osakaSpots[0].coords.lat},${osakaSpots[0].coords.lng}`
    const destination = `${osakaSpots[osakaSpots.length - 1].coords.lat},${osakaSpots[osakaSpots.length - 1].coords.lng}`
    const waypoints = osakaSpots
      .slice(1, -1)
      .slice(0, 8) // Google Maps supports up to 8~9 waypoints
      .map((s) => `${s.coords.lat},${s.coords.lng}`)
      .join('|')

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${encodeURIComponent(waypoints)}&travelmode=transit`
  }

  const handleNextSpot = () => {
    if (!selectedSpot || osakaSpots.length <= 1) return
    const currentIndex = osakaSpots.findIndex((s) => s.id === selectedSpot.id)
    const nextIndex = (currentIndex + 1) % osakaSpots.length
    setSelectedSpot(osakaSpots[nextIndex])
  }

  const handlePrevSpot = () => {
    if (!selectedSpot || osakaSpots.length <= 1) return
    const currentIndex = osakaSpots.findIndex((s) => s.id === selectedSpot.id)
    const prevIndex = (currentIndex - 1 + osakaSpots.length) % osakaSpots.length
    setSelectedSpot(osakaSpots[prevIndex])
  }

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col">
      {/* Top Header Bar */}
      <div className="p-3 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">
                {activeDay === 'all' ? '전체 동선 지도' : `Day ${activeDay} 구글 지도`}
              </span>
              <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                {osakaSpots.length}곳
              </span>
            </div>
          </div>
        </div>

        {/* Full Day Google Maps Route Link */}
        <a
          href={getFullDayRouteUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-2.5 py-1.5 rounded-xl shadow-md shadow-blue-600/20 transition active:scale-95 whitespace-nowrap"
          title="구글맵 앱에서 전체 동선 길찾기 열기"
        >
          <Route className="w-3.5 h-3.5" />
          <span>전체 동선 열기</span>
        </a>
      </div>

      {/* Spot Selector Carousel Chips */}
      <div className="px-3 py-2 bg-slate-800/80 border-b border-slate-700/60 overflow-x-auto no-scrollbar flex items-center gap-1.5 z-10">
        {osakaSpots.map((spot, idx) => {
          const isSelected = selectedSpot && selectedSpot.id === spot.id
          const catInfo = getCategoryInfo(spot.category)

          return (
            <button
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs whitespace-nowrap transition active:scale-95 ${
                isSelected
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30 ring-1 ring-rose-300'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${
                  isSelected ? 'bg-white text-rose-600' : 'bg-slate-600 text-slate-200'
                }`}
              >
                {spot.seqNumber || idx + 1}
              </span>
              <span className="truncate max-w-[100px] sm:max-w-[140px]">
                {spot.title}
              </span>
            </button>
          )
        })}
      </div>

      {/* Google Maps Embed iFrame (100% Free, Zero API Key) */}
      <div className="relative flex-1 w-full h-full bg-slate-950">
        {selectedSpot ? (
          <iframe
            title={`Google Map - ${selectedSpot.title}`}
            src={getEmbedUrl(selectedSpot)}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs">
            지도를 표시할 장소를 선택해주세요.
          </div>
        )}

        {/* Selected Spot Bottom Floating Card */}
        {selectedSpot && (
          <div className="absolute bottom-3 left-3 right-3 z-10 bg-slate-900/90 text-white backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 shadow-2xl animate-fade-in flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden flex-1">
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-md">
                {selectedSpot.seqNumber}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-rose-300 bg-rose-500/20 px-1.5 py-0.2 rounded">
                    {selectedSpot.time}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {selectedSpot.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {selectedSpot.location || selectedSpot.description}
                </p>
              </div>
            </div>

            {/* Actions: Prev, Next & Open in Google Maps */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handlePrevSpot}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition active:scale-95"
                title="이전 장소"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextSpot}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition active:scale-95"
                title="다음 장소"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <a
                href={
                  selectedSpot.links && selectedSpot.links[0]
                    ? selectedSpot.links[0].url
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        selectedSpot.title + ' 오사카'
                      )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition active:scale-95 shadow-md shadow-rose-500/20"
                title="구글맵 앱에서 열기"
              >
                <Navigation className="w-3 h-3" />
                <span className="hidden sm:inline">길찾기</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
