import React, { useState, useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Compass, MapPin, Clock, FileText, ChevronRight } from 'lucide-react'

export default function GoogleMapView({ days, activeDay, focusedItem, onSelectSpot }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const layerGroupRef = useRef(null)

  // Filter spots to display based on activeDay (excluding hideOnMap spots)
  const displayedSpots = useMemo(() => {
    const list = []
    const targetDays = activeDay === 'all' ? days : days.filter((d) => d.day === activeDay)

    targetDays.forEach((d) => {
      d.schedules.forEach((s, idx) => {
        if (!s.hideOnMap && s.coords && s.coords.lat && s.coords.lng) {
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

  // Filter only Osaka spots
  const osakaSpots = useMemo(() => {
    return displayedSpots.filter((s) => !s.hideOnMap && s.coords.lat < 36.0)
  }, [displayedSpots])

  // Current selected spot
  const [selectedSpot, setSelectedSpot] = useState(null)

  useEffect(() => {
    if (focusedItem && focusedItem.coords && !focusedItem.hideOnMap) {
      setSelectedSpot(focusedItem)
    } else if (osakaSpots.length > 0) {
      setSelectedSpot(osakaSpots[0])
    } else {
      setSelectedSpot(null)
    }
  }, [focusedItem, activeDay, osakaSpots])

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return // Avoid re-initialization

    // Default center Osaka (Zoom level 15)
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([34.685, 135.505], 15)

    // Google Maps Tile Layer
    L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 19
    }).addTo(map)

    // Add custom zoom control at top right below header
    L.control.zoom({ position: 'topright' }).addTo(map)

    const layerGroup = L.layerGroup().addTo(map)
    layerGroupRef.current = layerGroup
    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  const markersRef = useRef({})

  // Function to build marker HTML with sequence number & spot title badge
  const createMarkerIcon = (spot, isSelected) => {
    const seqNum = spot.seqNumber || 1
    const titleText = spot.title || ''

    const iconHtml = `
      <div class="relative flex items-center gap-1.5 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
        <!-- 원형 번호 배지 (뒤 파란색 비침 0% + 또렷한 커스텀 광채 펄스) -->
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full ${
          isSelected
            ? 'bg-[#fb0442] text-white z-50 font-black animate-marker-glow'
            : 'bg-[#2909f6] text-white border-2 border-white shadow-lg hover:scale-105 font-extrabold'
        } flex items-center justify-center text-xs transition-all duration-200 flex-shrink-0">
          <span>${seqNum}</span>
        </div>

        <!-- 번호 옆 장소명 타이틀 말풍선 뱃지 -->
        <div class="px-2 py-1 rounded-xl ${
          isSelected
            ? 'bg-slate-900 text-white border-2 border-[#fb0442] shadow-2xl scale-105 z-50 font-black'
            : 'bg-slate-900/90 text-slate-100 border border-slate-700 shadow-md font-bold hover:bg-slate-900'
        } text-[11px] leading-none whitespace-nowrap transition-all flex items-center gap-1">
          <span>${titleText}</span>
        </div>
      </div>
    `
    return L.divIcon({
      className: 'custom-route-marker',
      html: iconHtml,
      iconSize: [120, 36],
      iconAnchor: [16, 18]
    })
  }

  // Helper to fit map to all spots of the current day
  const handleFitBounds = () => {
    const map = mapInstanceRef.current
    if (!map || osakaSpots.length === 0) return
    const bounds = L.latLngBounds(osakaSpots.map((s) => [s.coords.lat, s.coords.lng]))
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true })
  }

  // Update Markers & Polylines when osakaSpots changes
  useEffect(() => {
    const map = mapInstanceRef.current
    const layerGroup = layerGroupRef.current
    if (!map || !layerGroup) return

    layerGroup.clearLayers()
    markersRef.current = {}

    if (osakaSpots.length === 0) return

    // 1. Draw Polyline Route (Connecting spots in sequence)
    if (osakaSpots.length > 1) {
      const latLngs = osakaSpots.map((s) => [s.coords.lat, s.coords.lng])

      // Outer glow line
      L.polyline(latLngs, {
        color: '#fb0442',
        weight: 8,
        opacity: 0.3,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layerGroup)

      // Inner dashed path line
      L.polyline(latLngs, {
        color: '#533af8',
        weight: 4,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layerGroup)
    }

    // 2. Draw Numbered Markers with Title Badges
    osakaSpots.forEach((spot, idx) => {
      const isSelected = selectedSpot && selectedSpot.id === spot.id

      const marker = L.marker([spot.coords.lat, spot.coords.lng], {
        icon: createMarkerIcon(spot, isSelected),
        zIndexOffset: isSelected ? 1000 : idx * 10
      })

      marker.on('click', () => {
        setSelectedSpot(spot)
        if (onSelectSpot) {
          onSelectSpot(spot)
        }
      })

      marker.addTo(layerGroup)
      markersRef.current[spot.id] = marker
    })

    // Auto-fit bounds ONLY on Day change
    handleFitBounds()
  }, [osakaSpots])

  // Update selected spot highlight & smooth pan
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedSpot || !selectedSpot.coords) return

    // Update marker icons (highlight active, reset others)
    osakaSpots.forEach((spot, idx) => {
      const marker = markersRef.current[spot.id]
      if (marker) {
        const isSelected = spot.id === selectedSpot.id
        marker.setIcon(createMarkerIcon(spot, isSelected))
        marker.setZIndexOffset(isSelected ? 1000 : idx * 10)
      }
    })

    // Smooth Pan to selected spot
    map.panTo([selectedSpot.coords.lat, selectedSpot.coords.lng], {
      animate: true,
      duration: 0.4
    })
  }, [selectedSpot, osakaSpots])

  return (
    <div className="relative w-full h-full min-h-[350px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col">
      {/* 1. Top Header Bar (Floating overlay over map) */}
      <div className="absolute top-3 left-3 right-14 z-20 p-2 sm:p-2.5 bg-slate-900/95 border border-slate-800 backdrop-blur-md rounded-2xl flex items-center justify-between gap-1.5 sm:gap-2 shadow-xl">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 flex-shrink-0">
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-white truncate">
                {activeDay === 'all' ? '전체 동선 지도' : `Day ${activeDay} 이동 동선`}
              </span>
              <span className="text-[10px] bg-secondary-500 text-white font-extrabold px-2 py-0.2 rounded-full whitespace-nowrap flex-shrink-0">
                총 {osakaSpots.length}곳
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Fit Bounds Button */}
          <button
            onClick={handleFitBounds}
            className="flex items-center gap-1 text-[10.5px] bg-primary-600 hover:bg-primary-500 text-white font-bold px-2.5 py-1 rounded-xl transition active:scale-95 whitespace-nowrap shadow-xs cursor-pointer"
            title="현재 날짜 동선 전체 한눈에 보기"
          >
            <span>전체보기</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Leaflet Map View */}
      <div className="w-full flex-1 relative bg-slate-900">
        <div ref={mapContainerRef} className="w-full h-full min-h-[350px] z-0" />

        {/* 3. 지도 하단: 동선 번호별 장소 빠른 이동 칩 바 & 선택 스폿 세부 카드 */}
        <div className="absolute bottom-3 left-3 right-3 z-20 space-y-2 pointer-events-auto">
          {/* 선택된 번호 스폿 요약 카드 (클릭된 핀의 내용 상세 노출) */}
          {selectedSpot && (
            <div className="p-3 bg-slate-900/95 border border-slate-700/90 backdrop-blur-md rounded-2xl shadow-2xl text-white animate-fade-in flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-md">
                    {selectedSpot.seqNumber || 1}
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">
                    {selectedSpot.title}
                  </h4>
                  {selectedSpot.location && (
                    <span className="text-[9.5px] text-sky-300 bg-sky-950/80 border border-sky-800 px-1.5 py-0.2 rounded-full truncate flex-shrink-0">
                      📍 {selectedSpot.location}
                    </span>
                  )}
                </div>

                {selectedSpot.time && (
                  <span className="text-[10px] font-extrabold text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md flex-shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {selectedSpot.time}
                  </span>
                )}
              </div>

              {/* 세부 메모 / 이동방법 */}
              {(selectedSpot.transitInfo || selectedSpot.memo) && (
                <div className="text-[10.5px] text-slate-300 flex flex-col gap-0.5 pt-0.5 leading-snug">
                  {selectedSpot.transitInfo && (
                    <p className="text-emerald-300 font-medium truncate">
                      🧭 {selectedSpot.transitInfo}
                    </p>
                  )}
                  {selectedSpot.memo && (
                    <p className="text-slate-400 font-normal line-clamp-2">
                      🗒️ {selectedSpot.memo}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 동선 번호별 칩 버튼 가로 리스트 바 (①, ②, ③... 한눈에 클릭 전환) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-0.5">
            {osakaSpots.map((spot, sIdx) => {
              const isCurr = selectedSpot && selectedSpot.id === spot.id
              const seqNum = spot.seqNumber || sIdx + 1

              return (
                <button
                  key={spot.id}
                  onClick={() => {
                    setSelectedSpot(spot)
                    if (onSelectSpot) {
                      onSelectSpot(spot)
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-extrabold transition-all flex-shrink-0 border cursor-pointer shadow-md ${
                    isCurr
                      ? 'bg-rose-500 text-white border-rose-400 scale-105 ring-2 ring-rose-300/40'
                      : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[9.5px] font-black flex items-center justify-center ${
                      isCurr ? 'bg-white text-rose-600' : 'bg-slate-800 text-white'
                    }`}
                  >
                    {seqNum}
                  </span>
                  <span className="whitespace-nowrap max-w-[100px] truncate">{spot.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
