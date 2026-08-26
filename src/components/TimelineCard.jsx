import React from 'react'
import {
  Compass,
  Navigation,
  Map,
  Building2,
  Clock,
  FileText,
  Link2
} from 'lucide-react'

// <br> 태그 및 \n 개행 처리 헬퍼
const renderTextWithBreaks = (text) => {
  if (!text) return null
  const lines = String(text).split(/<br\s*\/?>|\n/gi)
  return lines.map((line, idx) => (
    <React.Fragment key={idx}>
      {line}
      {idx < lines.length - 1 && <br />}
    </React.Fragment>
  ))
}

// 구분별 뱃지 스타일 정의 (작게 표시)
const getCategoryBadge = (category, categoryLabel) => {
  const label = categoryLabel || '기타'
  switch (category) {
    case 'flight':
      return { label: label || '항공', bg: 'bg-blue-50 text-blue-700 border-blue-200' }
    case 'transit':
      return { label: label || '대중교통', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    case 'hotel':
      return { label: label || '숙소', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
    case 'food':
      return { label: label || '식당', bg: 'bg-amber-50 text-amber-700 border-amber-200' }
    case 'shopping':
      return { label: label || '쇼핑', bg: 'bg-rose-50 text-rose-700 border-rose-200' }
    case 'sightseeing':
      return { label: label || '관광', bg: 'bg-teal-50 text-teal-700 border-teal-200' }
    case 'cafe':
      return { label: label || '카페', bg: 'bg-orange-50 text-orange-700 border-orange-200' }
    default:
      return { label: label || '기타', bg: 'bg-slate-100 text-slate-700 border-slate-200' }
  }
}

// 길찾기 URL 생성
const getDirectionsUrl = (item) => {
  const destination = item.location || item.title || ''
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}

// 지도보기 URL 생성
const getMapUrl = (item) => {
  if (item.mapUrl) return item.mapUrl
  const query = item.location || item.title || ''
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export default function TimelineCard({
  item,
  index,
  onFocusOnMap,
  isSelected,
  isLast
}) {
  const badgeInfo = getCategoryBadge(item.category, item.categoryLabel)

  // 층별정보 배열화 파싱 (/ 구분자 또는 배열 형식 수용)
  const floorItems = Array.isArray(item.floorInfo)
    ? item.floorInfo
    : typeof item.floorInfo === 'string'
    ? item.floorInfo.split('/').map((s) => s.trim()).filter(Boolean)
    : []

  const hasSubContent =
    Boolean(item.transitInfo) ||
    floorItems.length > 0 ||
    Boolean(item.businessHours) ||
    Boolean(item.memo) ||
    (item.extraLinks && item.extraLinks.length > 0) ||
    Boolean(item.mapUrl)

  return (
    <div className="flex items-start gap-2.5 relative pb-5 group">
      {/* 타임라인 연결 수직선 (원형 아이콘 뒤쪽부터 아래 카드까지 쭉 연결) */}
      {!isLast && (
        <div className="w-[2px] bg-slate-900 absolute top-3 -bottom-5 left-[23px] z-0" />
      )}

      {/* 1. 타임라인 좌측: 완벽한 원형 번호 ①②③ + 시각/소요시간 */}
      <div className="flex flex-col items-center flex-shrink-0 w-12 pt-0.5 relative z-10">
        {/* 원형 인디케이터 번호 (완벽한 동그라미) */}
        <div
          className={`w-6 h-6 rounded-full aspect-square flex-shrink-0 flex items-center justify-center text-xs font-black transition-all ${
            isSelected
              ? 'bg-rose-600 text-white shadow-lg ring-4 ring-rose-200 scale-110'
              : 'bg-slate-900 text-white shadow-md'
          }`}
        >
          {index + 1}
        </div>

        {/* 시각 및 소요시간 (배경 지정으로 뒤쪽 수직선 완벽 가림) */}
        <div className="flex flex-col items-center mt-1 bg-slate-100 border border-slate-300 px-1 py-0.5 rounded-md z-10 shadow-xs text-center min-w-[40px]">
          <span className="text-[10.5px] font-extrabold text-slate-900 leading-tight">
            {item.time}
          </span>
          {item.duration && (
            <span className="text-[8.5px] font-bold text-slate-600 leading-tight mt-0.5">
              ({item.duration})
            </span>
          )}
        </div>
      </div>

      {/* 2. 타임라인 우측: 손스케치 형태 카드 */}
      <div
        id={`timeline-card-${item.id}`}
        onClick={() => {
          if (!item.hideOnMap) {
            onFocusOnMap(item, true)
          }
        }}
        className={`flex-1 rounded-2xl border-2 px-3 py-2.5 transition-all duration-200 cursor-pointer shadow-sm relative bg-white z-10 ${
          isSelected
            ? 'border-rose-500 shadow-md ring-2 ring-rose-400/20 bg-rose-50/30'
            : 'border-slate-800 hover:border-rose-400 hover:shadow-md'
        }`}
      >
        {/* 헤더: 장소명 (주요일정) & 아래 구분 뱃지 (폰트 크기 9px) */}
        <div className={`space-y-0.5 ${hasSubContent ? 'mb-2' : ''}`}>
          {/* 장소명 (폰트 크기 14px) */}
          <h3 className="text-[14px] font-extrabold tracking-tight leading-tight text-slate-900">
            {renderTextWithBreaks(item.title)}
          </h3>

          {/* 장소명 밑 구분 표시 뱃지 (폰트 크기 9px) */}
          <div>
            <span
              className={`inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border ${badgeInfo.bg}`}
            >
              {badgeInfo.label}
            </span>
          </div>
        </div>

        {/* 🧭 이동방법 */}
        {item.transitInfo && (
          <div className="flex items-start gap-1.5 text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 mb-1.5 font-medium">
            <Compass className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{renderTextWithBreaks(item.transitInfo)}</span>
          </div>
        )}

        {/* 🏢 층별정보 (배열/줄바꿈 형태로 개별 출력, 메모 위 위치) */}
        {floorItems.length > 0 && (
          <div className="flex items-start gap-1.5 text-[11px] text-indigo-950 bg-indigo-50/80 border border-indigo-200 rounded-xl px-2.5 py-1.5 mb-1.5 font-bold">
            <Building2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5 leading-snug">
              {floorItems.map((floor, fIdx) => (
                <span key={fIdx}>{renderTextWithBreaks(floor)}</span>
              ))}
            </div>
          </div>
        )}

        {/* ⏰ 영업시간 정보 */}
        {item.businessHours && (
          <div className="flex items-start gap-1.5 text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-1.5 mb-1.5 font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>영업시간: {renderTextWithBreaks(item.businessHours)}</span>
          </div>
        )}

        {/* 🗒️ 메모 (기타 메모) */}
        {item.memo && (
          <div className="flex items-start gap-1.5 text-[11px] text-slate-700 bg-slate-50/90 border border-slate-200 rounded-xl px-2.5 py-1.5 mb-1.5 font-normal">
            <FileText className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{renderTextWithBreaks(item.memo)}</span>
          </div>
        )}

        {/* 🔗 추가링크 (버튼 형태) */}
        {item.extraLinks && item.extraLinks.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap mb-2 pt-0.5">
            {item.extraLinks.map((link, lIdx) => (
              <a
                key={lIdx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-[10.5px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-full transition shadow-xs active:scale-95"
              >
                <Link2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* 하단 액션 버튼: [길찾기] [지도보기] (mapUrl이 있는 경우에만 표시) */}
        {item.mapUrl && (
          <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100 mt-1.5">
            {/* 📍 길찾기 버튼 */}
            <a
              href={getDirectionsUrl(item)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 h-8 flex items-center justify-center gap-1 text-[11px] font-extrabold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition active:scale-95 shadow-xs box-border"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>길찾기</span>
            </a>

            {/* 📍 지도보기 버튼 */}
            <a
              href={getMapUrl(item)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 h-8 flex items-center justify-center gap-1 text-[11px] font-extrabold text-white bg-slate-900 hover:bg-slate-800 border border-slate-900 rounded-xl transition active:scale-95 shadow-xs box-border"
            >
              <Map className="w-3.5 h-3.5 text-rose-400" />
              <span>지도보기</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
