import React, { useState, useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Compass, MapPin } from 'lucide-react'
import { getCategoryInfo } from '../utils/helpers'

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

    // Add custom zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map)

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

  return (
    <div className="relative w-full h-full min-h-[300px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Top Header Bar (Floating overlay over map) */}
      <div className="absolute top-3 left-3 right-3 z-20 p-2 sm:p-2.5 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-2xl flex items-center justify-between gap-1.5 sm:gap-2 shadow-lg">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 flex-shrink-0">
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-white truncate">
                {activeDay === 'all' ? '전체 동선' : `Day ${activeDay}`}
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
            className="flex items-center gap-1 text-[11px] bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold px-2 py-1 rounded-lg sm:rounded-xl border border-slate-700 transition active:scale-95 whitespace-nowrap shadow-sm"
            title="현재 날짜 동선 전체 한눈에 보기"
          >
            <Compass className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span>전체 보기</span>
          </button>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="w-full h-full bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-0" />
      </div>
    </div>
  )
}

