import React from 'react'
import { X, Plane, Check, Calendar, MapPin } from 'lucide-react'
import { sortTripsByDate } from '../utils/tripStorage'

export default function TripManagerModal({
  isOpen,
  onClose,
  trips,
  activeTripId,
  onSelectTrip
}) {
  if (!isOpen) return null

  const sortedTrips = sortTripsByDate(trips)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">여행 선택</h2>
              <p className="text-[11px] text-slate-300 font-medium">
                원하시는 여행을 선택하면 일정 정보로 바로 이동합니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition active:scale-95 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content - Trip List (날짜순) */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {sortedTrips.map((trip) => {
            const isSelected = trip.id === activeTripId
            const info = trip.tripInfo || {}
            const totalDays = trip.days?.length || info.totalDays || 1

            return (
              <div
                key={trip.id}
                onClick={() => {
                  onSelectTrip(trip.id)
                  onClose()
                }}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99] ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900 ring-offset-1'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-900'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {totalDays}일간 일정
                    </span>
                    {info.destination && (
                      <span
                        className={`text-xs font-semibold flex items-center gap-1 ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        <MapPin className="w-3 h-3" />
                        {info.destination}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold truncate">
                    {info.title || '제목 없는 여행'}
                  </h3>

                  {(info.startDate || info.endDate) && (
                    <div
                      className={`flex items-center gap-1 text-xs mt-1 ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {info.startDate} {info.endDate ? `~ ${info.endDate}` : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* 현재 선택됨 표시 */}
                {isSelected && (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
