import React from 'react'
import { X, Sparkles, ExternalLink, ShieldCheck, ShoppingBag, Gift, Ticket } from 'lucide-react'

export default function TravelTipsModal({ isOpen, onClose, quickLinks }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-lg font-bold">오사카 여행 필수 꿀팁 & 쿠폰</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Quick links & Coupons */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-amber-500" />
              <span>모바일 전용 할인 쿠폰 & 입국 링크</span>
            </h3>

            {quickLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3.5 rounded-2xl bg-slate-50 hover:bg-rose-50/50 border border-slate-200/80 hover:border-rose-300 transition shadow-sm group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
                      {link.category}
                    </span>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition">
                      {link.title}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-500 pl-1">{link.desc}</p>
              </a>
            ))}
          </div>

          {/* Key tips notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-800 text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>현지 여행 중요 체크포인트</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-amber-800/90 pl-1">
              <li>
                <strong>오니기리 고리짱</strong>: 현금 결제만 가능 (카드 불가)
              </li>
              <li>
                <strong>파르코 백화점</strong>: 백화점 5% 할인쿠폰 적용 불가 (다이마루, 한큐는 적용 가능)
              </li>
              <li>
                <strong>칼디 난바시티점</strong>: 5,500엔 이상 구매 시 B2F 면세 카운터에서 사후 면세 환급
              </li>
              <li>
                <strong>미도스지선 막차</strong>: 난바 ➔ 요도야바시 막차 시간은 00:10 전후이므로 심야 이동 주의
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition active:scale-95 text-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
