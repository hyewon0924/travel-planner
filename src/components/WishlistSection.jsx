import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { ShoppingBag, Store, CheckCircle2, Check, Search, ChevronDown, ChevronUp } from 'lucide-react'
import shoppingData from '../data/shoppingList.json'

export default function WishlistSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [purchasedIds, setPurchasedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('osaka_shopping_purchased')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [previewImage, setPreviewImage] = useState(null)

  // Save purchased state
  const togglePurchased = (id, e) => {
    if (e) e.stopPropagation()
    setPurchasedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      localStorage.setItem('osaka_shopping_purchased', JSON.stringify(next))
      return next
    })
  }

  // Extract unique main categories
  const categories = useMemo(() => {
    const set = new Set()
    shoppingData.forEach((item) => {
      if (item.category) {
        const mainCat = item.category.split('/')[0].trim()
        set.add(mainCat)
      }
    })
    return ['전체', ...Array.from(set)]
  }, [])

  // Filter items based on search and category includes
  const filteredItems = useMemo(() => {
    return shoppingData.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.store && item.store.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchCategory =
        selectedCategory === '전체' ||
        (item.category && item.category.includes(selectedCategory))

      return matchSearch && matchCategory
    })
  }, [searchQuery, selectedCategory])

  // Group items by store
  const groupedByStore = useMemo(() => {
    const groups = {}
    filteredItems.forEach((item) => {
      const storeName = item.store || '기타 / 기타 매장'
      if (!groups[storeName]) {
        groups[storeName] = []
      }
      groups[storeName].push(item)
    })
    return groups
  }, [filteredItems])

  const storeKeys = Object.keys(groupedByStore)

  // 사용자가 수동으로 변경한 접기 상태 (null이면 기본값 사용)
  const [userCollapsedStores, setUserCollapsedStores] = useState(null)

  // 첫 번째 매장만 펼치고, 두 번째 매장부터는 기본적으로 접힌 상태로 설정
  const collapsedStores = useMemo(() => {
    if (userCollapsedStores !== null) {
      return userCollapsedStores
    }
    return storeKeys.slice(1)
  }, [storeKeys, userCollapsedStores])

  const toggleStoreCollapse = (storeName) => {
    setUserCollapsedStores((prev) => {
      const current = prev !== null ? prev : storeKeys.slice(1)
      return current.includes(storeName)
        ? current.filter((s) => s !== storeName)
        : [...current, storeName]
    })
  }

  return (
    <div className="space-y-4 pb-12">
      {/* 타이틀 및 요약 헤더 */}
      <div className="bg-white rounded-2xl p-3.5 border-2 border-slate-800 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                짜우 쇼핑 위시리스트
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200">
                  구매 완료: {purchasedIds.length} / {shoppingData.length}개
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* 검색 및 카테고리 필터 */}
        <div className="space-y-2 pt-0.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="상품명, 설명, 매장 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all"
            />
          </div>

          {/* 카테고리 필터 칩 */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Store별 구분 및 2열 그리드 상품 배치 */}
      {storeKeys.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center border-2 border-slate-800 shadow-sm space-y-2">
          <p className="text-xs font-bold text-slate-700">검색 결과가 없습니다.</p>
          <p className="text-[11px] text-slate-400">다른 검색어나 카테고리를 선택해 보세요.</p>
        </div>
      ) : (
        storeKeys.map((storeName) => {
          const items = groupedByStore[storeName]
          const isCollapsed = collapsedStores.includes(storeName)

          // 구매 완료(purchased) 항목을 맨 아래(뒤쪽)로 정렬
          const sortedItems = [...items].sort((a, b) => {
            const aPurchased = purchasedIds.includes(a.id)
            const bPurchased = purchasedIds.includes(b.id)
            if (aPurchased === bPurchased) return 0
            return aPurchased ? 1 : -1
          })

          return (
            <section key={storeName} className="space-y-2">
              {/* Store 구분 헤더 */}
              <div
                onClick={() => toggleStoreCollapse(storeName)}
                className="flex items-center justify-between px-3 py-2 bg-slate-900 text-white rounded-xl shadow-xs border border-slate-800 cursor-pointer select-none transition-all hover:bg-slate-800 active:scale-[0.99]"
              >
                <div className="flex items-center gap-2">
                  <Store className="w-3.5 h-3.5 text-purple-300" />
                  <h3 className="text-xs font-extrabold flex items-center gap-1.5">
                    <span>{storeName}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-600 text-white">
                      {items.length}
                    </span>
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-purple-200">
                  <span className="text-[10px] text-slate-400">
                    {isCollapsed ? '펼치기' : '접기'}
                  </span>
                  <div className="p-0.5 rounded-md bg-slate-800 text-purple-200">
                    {isCollapsed ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronUp className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </div>

              {/* 2열 그리드 배치 */}
              {!isCollapsed && (
                <div className="grid grid-cols-2 gap-2.5 transition-all animate-fade-in">
                  {sortedItems.map((item) => {
                    const isPurchased = purchasedIds.includes(item.id)
                    const mainCategory = item.category ? item.category.split('/')[0] : ''

                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-2xl p-2.5 border-2 transition-all flex flex-col justify-between relative shadow-sm ${
                          isPurchased
                            ? 'border-emerald-600 bg-emerald-50/30 opacity-80'
                            : 'border-slate-800'
                        }`}
                      >
                        <div>
                          {/* 이미지 영역 + 우측 상단 플로팅 원형 체크 버튼 */}
                          <div
                            onClick={() => setPreviewImage(item.image)}
                            className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-300 mb-2 cursor-pointer transition-transform hover:opacity-95 group"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src =
                                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'
                              }}
                            />

                            {/* 이미지 우측 상단 플로팅 체크 버튼 (클릭 시 구매 상태 토글) */}
                            <button
                              type="button"
                              onClick={(e) => togglePurchased(item.id, e)}
                              title={isPurchased ? '구매 취소' : '구매 완료 체크'}
                              className={`absolute top-1.5 right-1.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                isPurchased
                                  ? 'bg-emerald-600 text-white border border-emerald-500 shadow-md scale-105'
                                  : 'bg-white/90 backdrop-blur-sm border border-slate-300 text-slate-400 hover:text-emerald-600 hover:border-emerald-500 shadow-xs hover:scale-110'
                              }`}
                            >
                              <Check className={`w-4 h-4 ${isPurchased ? 'stroke-[3]' : 'stroke-[2.5]'}`} />
                            </button>

                            {/* 구매 완료 오버레이 */}
                            {isPurchased && (
                              <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[0.5px] pointer-events-none flex items-center justify-center">
                                <span className="bg-emerald-600 text-white text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> 구매완료
                                </span>
                              </div>
                            )}
                          </div>

                          {/* 카테고리 뱃지 */}
                          {mainCategory && (
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 mb-1 w-fit">
                              {mainCategory}
                            </span>
                          )}

                          {/* 상품명 */}
                          <h4
                            className={`text-xs font-extrabold text-slate-900 leading-snug line-clamp-2 ${
                              isPurchased ? 'line-through text-slate-400' : ''
                            }`}
                          >
                            {item.name}
                          </h4>

                          {/* 상품 설명 */}
                          {item.description && (
                            <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )
        })
      )}

      {/* 이미지 확대 모달 (React Portal로 document.body 최상단 마운트 및 z-[100] 오버레이) */}
      {previewImage &&
        createPortal(
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-2 border-2 border-slate-800 animate-fade-in"
            >
              <img src={previewImage} alt="상품 큰 이미지" className="w-full h-auto rounded-2xl max-h-[70vh] object-contain mx-auto" />
              <button
                onClick={() => setPreviewImage(null)}
                className="mt-2 w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-[0.99]"
              >
                닫기
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
