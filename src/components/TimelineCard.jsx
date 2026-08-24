import React from 'react'
import {
  Clock,
  MapPin,
  ExternalLink,
  Tag,
  CheckCircle2,
  Circle,
  Coins,
  ChevronRight,
  Sparkles,
  Utensils,
  ShoppingBag,
  Building,
  Train,
  Plane,
  Camera,
  Film,
  Coffee
} from 'lucide-react'
import { getCategoryInfo, formatCurrency } from '../utils/helpers'

const getCategoryIcon = (category) => {
  switch (category) {
    case 'flight': return Plane
    case 'transit': return Train
    case 'hotel': return Building
    case 'food': return Utensils
    case 'cafe': return Coffee
    case 'shopping': return ShoppingBag
    case 'sightseeing': return Camera
    case 'activity': return Film
    default: return MapPin
  }
}

export default function TimelineCard({
  item,
  index,
  dayNumber,
  isVisited,
  onToggleVisited,
  onFocusOnMap,
  isSelected
}) {
  const categoryInfo = getCategoryInfo(item.category)
  const IconComponent = getCategoryIcon(item.category)

  return (
    <div
      id={`timeline-card-${item.id}`}
      data-item-id={item.id}
      onClick={() => onFocusOnMap(item, true)}
      className={`timeline-card-item relative group rounded-2xl border-2 transition-all duration-300 cursor-pointer scroll-mt-[380px] md:scroll-mt-36 ${
        isSelected
          ? 'bg-rose-50/90 border-rose-500 shadow-md shadow-rose-500/10 ring-2 ring-rose-400/30 z-10'
          : isVisited
          ? 'bg-slate-50/80 border-slate-200 opacity-75'
          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="p-3 sm:p-4">
        {/* Top Header: Time, Order Badge, Category, Visited Check */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center flex-wrap gap-1.5">
            {/* Sequence number badge */}
            <span
              className={`w-5.5 h-5.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold flex items-center justify-center shadow-sm transition-all duration-300 ${
                isSelected
                  ? 'bg-rose-600 text-white ring-2 ring-rose-300 scale-110 font-black'
                  : 'bg-slate-900 text-white'
              }`}
            >
              {index + 1}
            </span>

            {/* Time badge */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{item.time}</span>
              {item.duration && (
                <span className="text-slate-400 font-normal">({item.duration})</span>
              )}
            </div>

            {/* Category badge */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md border ${categoryInfo.bg}`}
            >
              <IconComponent className="w-3 h-3" />
              {categoryInfo.label}
            </span>
          </div>

          {/* Visit Check Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleVisited(item.id)
            }}
            className="text-slate-400 hover:text-emerald-600 transition p-1 -mr-1 rounded-lg active:scale-90"
            title={isVisited ? '방문 완료 취소' : '방문 완료 체크'}
          >
            {isVisited ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300 hover:text-slate-400" />
            )}
          </button>
        </div>

        {/* Title and Cost */}
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3
            className={`text-sm sm:text-base font-bold tracking-tight transition-colors ${
              isSelected
                ? 'text-rose-600 font-extrabold'
                : isVisited
                ? 'line-through text-slate-500'
                : 'text-slate-900'
            }`}
          >
            {item.title}
          </h3>

          {item.cost > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60 whitespace-nowrap">
              <Coins className="w-3 h-3" />
              <span>¥{formatCurrency(item.cost)}</span>
            </div>
          )}
        </div>

        {/* Location / Destination */}
        {item.location && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1.5">
            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        )}

        {/* Description */}
        {item.description && (
          <p className="text-xs text-slate-600 mb-2 bg-slate-50/80 p-2 rounded-xl border border-slate-100 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Bullet Points / Tips / Floor Info */}
        {item.bullets && item.bullets.length > 0 && (
          <div className="mb-2 space-y-1 pl-1">
            {item.bullets.map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 flex-shrink-0" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Actions: Map Focus & External Links */}
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
          {/* Map focus button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFocusOnMap(item, true)
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2 py-1 rounded-lg transition active:scale-95"
          >
            <MapPin className="w-3 h-3" />
            <span>지도 위치</span>
          </button>

          {/* External Links */}
          <div className="flex items-center gap-1 flex-wrap">
            {item.links &&
              item.links.map((link, lIdx) => {
                const isCoupon = link.type === 'coupon'
                return (
                  <a
                    key={lIdx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition active:scale-95 ${
                      isCoupon
                        ? 'bg-amber-500 text-white font-semibold border-amber-600 shadow-sm shadow-amber-500/20 hover:bg-amber-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    {isCoupon ? <Sparkles className="w-3 h-3 text-white" /> : <ExternalLink className="w-3 h-3" />}
                    <span>{link.label}</span>
                  </a>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
