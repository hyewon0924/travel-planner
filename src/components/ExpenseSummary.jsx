import React from 'react'
import { Coins, Train, DollarSign, Wallet } from 'lucide-react'
import { formatCurrency } from '../utils/helpers'

export default function ExpenseSummary({ days, activeDay }) {
  // Calculate total costs for transit and overall
  const targetDays = activeDay === 'all' ? days : days.filter((d) => d.day === activeDay)

  const transitTotal = targetDays.reduce((acc, d) => {
    return acc + d.schedules
      .filter((s) => s.category === 'transit' || s.category === 'hotel')
      .reduce((sum, s) => sum + (s.cost || 0), 0)
  }, 0)

  const overallCost = targetDays.reduce((acc, d) => {
    return acc + d.schedules.reduce((sum, s) => sum + (s.cost || 0), 0)
  }, 0)

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-slate-700/80 mb-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">
              {activeDay === 'all' ? '전체 일정 예상 고정비 (1인)' : `Day ${activeDay} 예상 고정비 (1인)`}
            </h3>
            <p className="text-[11px] text-slate-400">교통비 및 필수 이동 경비 기준</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg sm:text-xl font-extrabold text-amber-400">
            ¥{formatCurrency(overallCost)}
          </div>
          <div className="text-[11px] text-slate-400">
            약 {formatCurrency(Math.round(overallCost * 9.2))}원
          </div>
        </div>
      </div>

      {/* Breakdown chips */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-700/60 text-center">
        {days.map((d) => {
          const dayCost = d.schedules.reduce((sum, s) => sum + (s.cost || 0), 0)
          const isSelected = activeDay === d.day
          return (
            <div
              key={d.day}
              className={`p-2 rounded-xl border transition ${
                isSelected
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-300'
              }`}
            >
              <div className="text-[10px] text-slate-400 font-medium">Day {d.day}</div>
              <div className="text-xs font-bold text-white mt-0.5">
                ¥{formatCurrency(dayCost)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
