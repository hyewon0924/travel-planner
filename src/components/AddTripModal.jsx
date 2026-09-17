import React, { useState } from 'react'
import { X, Calendar, MapPin, Building, PlusCircle } from 'lucide-react'
import { createDaysFromDates } from '../utils/tripStorage'

export default function AddTripModal({ isOpen, onClose, onAddTrip }) {
  const today = new Date().toISOString().split('T')[0]
  const defaultEnd = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(defaultEnd)
  const [hotelName, setHotelName] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('여행 제목을 입력해 주세요.')
      return
    }

    const newTripId = `trip-${Date.now()}`
    const generatedDays = createDaysFromDates(startDate, endDate)

    const newTrip = {
      id: newTripId,
      tripInfo: {
        title: title.trim(),
        destination: destination.trim() || '여행지 미정',
        startDate: startDate,
        endDate: endDate,
        currency: 'KRW',
        currencySymbol: '₩',
        totalDays: generatedDays.length,
        hotel: hotelName.trim()
          ? {
              name: hotelName.trim(),
              station: '',
              coords: { lat: 37.5665, lng: 126.978 }
            }
          : null
      },
      days: generatedDays
    }

    onAddTrip(newTrip)

    // Reset Form
    setTitle('')
    setDestination('')
    setStartDate(today)
    setEndDate(defaultEnd)
    setHotelName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-slate-300" />
            <h2 className="text-lg font-bold">새 여행 계획 추가</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition active:scale-95 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* 여행 제목 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              여행 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="예: 26년 가을 도쿄 여행"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
            />
          </div>

          {/* 여행지 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>목적지 / 여행지</span>
            </label>
            <input
              type="text"
              placeholder="예: 오사카, 일본 / 후쿠오카"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
            />
          </div>

          {/* 일정 (시작일 / 종료일) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>시작일</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>종료일</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
              />
            </div>
          </div>

          {/* 호텔 / 숙소 (선택) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>대표 숙소/호텔 (선택)</span>
            </label>
            <input
              type="text"
              placeholder="예: 호텔 케이한 요도야바시"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
            />
          </div>

          {/* 하단 생성 버튼 */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition shadow-md"
            >
              새 여행 생성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
