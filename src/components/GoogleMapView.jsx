import React, { useState, useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  Navigation,
  Route,
  Compass,
  ChevronLeft,
  ChevronRight,
  Layers,
  MapPin
} from 'lucide-react'
import { getCategoryInfo } from '../utils/helpers'

export default function GoogleMapView({ days, activeDay, focusedItem }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const layerGroupRef = useRef(null)

  // Filter spots to display based on activeDay
  const displayedSpots = useMemo(() => {
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

  // Filter only Osaka spots (excluding airport outside main area for clean local view)
  const osakaSpots = useMemo(() => {
    return displayedSpots.filter((s) => s.coords.lat < 36.0)
  }, [displayedSpots])

  // Current selected spot
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

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return // Avoid re-initialization

    // Default center Osaka
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([34.685, 135.505], 13)

    // Google Maps Tile Layer
    L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 19
    }).addTo(map)

    // Add custom zoom control at top right
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

  // Function to build marker HTML
  const createMarkerIcon = (seqNum, isSelected) => {
    const iconHtml = `
      <div class="relative flex items-center justify-center transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2">
        ${
          isSelected
            ? `<div class="absolute -inset-2 bg-rose-500/40 rounded-full animate-ping"></div>`
            : ''
        }
        <div class="w-8 h-8 rounded-full ${
          isSelected
            ? 'bg-rose-600 text-white ring-4 ring-rose-300 scale-125 z-50 shadow-2xl font-black'
            : 'bg-slate-900 text-white border-2 border-rose-500 shadow-lg hover:scale-110 font-bold'
        } flex items-center justify-center text-xs transition-all duration-200">
          ${seqNum}
        </div>
      </div>
    `
    return L.divIcon({
      className: 'custom-route-marker',
      html: iconHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
  }

  // Helper to fit map to all spots of the current day
  const handleFitBounds = () => {
    const map = mapInstanceRef.current
    if (!map || osakaSpots.length === 0) return
    const bounds = L.latLngBounds(osakaSpots.map((s) => [s.coords.lat, s.coords.lng]))
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true })
  }

  // Update Markers & Polylines when osakaSpots changes (Day change ONLY)
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
        color: '#f43f5e',
        weight: 8,
        opacity: 0.3,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layerGroup)

      // Inner dashed path line
      L.polyline(latLngs, {
        color: '#e11d48',
        weight: 4,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layerGroup)
    }

    // 2. Draw Numbered Markers
    osakaSpots.forEach((spot, idx) => {
      const isSelected = selectedSpot && selectedSpot.id === spot.id
      const seqNum = spot.seqNumber || idx + 1

      const marker = L.marker([spot.coords.lat, spot.coords.lng], {
        icon: createMarkerIcon(seqNum, isSelected),
        zIndexOffset: isSelected ? 1000 : idx * 10
      })

      marker.on('click', () => {
        setSelectedSpot(spot)
      })

      marker.addTo(layerGroup)
      markersRef.current[spot.id] = marker
    })

    // Auto-fit bounds ONLY on Day change
    handleFitBounds()
  }, [osakaSpots])

  // Update selected spot highlight & smooth pan WITHOUT changing zoom level
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedSpot || !selectedSpot.coords) return

    // Update marker icons (highlight active, reset others)
    osakaSpots.forEach((spot, idx) => {
      const marker = markersRef.current[spot.id]
      if (marker) {
        const isSelected = spot.id === selectedSpot.id
        const seqNum = spot.seqNumber || idx + 1
        marker.setIcon(createMarkerIcon(seqNum, isSelected))
        marker.setZIndexOffset(isSelected ? 1000 : idx * 10)
      }
    })

    // Smooth Pan to selected spot at current zoom level
    map.panTo([selectedSpot.coords.lat, selectedSpot.coords.lng], {
      animate: true,
      duration: 0.4
    })
  }, [selectedSpot, osakaSpots])

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
      <div className="p-2.5 sm:p-3 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md flex items-center justify-between gap-1.5 sm:gap-2 z-10 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 flex-shrink-0">
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-xs font-bold text-white truncate">
                {activeDay === 'all' ? '전체 동선' : `Day ${activeDay} 동선`}
              </span>
              <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap flex-shrink-0">
                {osakaSpots.length}곳
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Fit Bounds Button */}
          <button
            onClick={handleFitBounds}
            className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-2.5 py-1 rounded-lg sm:rounded-xl border border-slate-700 transition active:scale-95 whitespace-nowrap shadow-sm"
            title="현재 날짜 동선 전체 한눈에 보기"
          >
            <Compass className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span>전체 보기</span>
          </button>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="relative flex-1 w-full h-full bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-0" />

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

