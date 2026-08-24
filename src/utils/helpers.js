export const CATEGORY_CONFIG = {
  flight: {
    label: '항공',
    bg: 'bg-sky-100 text-sky-700 border-sky-200',
    iconColor: '#0284c7',
    markerColor: '#0284c7'
  },
  transit: {
    label: '이동',
    bg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    iconColor: '#059669',
    markerColor: '#059669'
  },
  hotel: {
    label: '숙소',
    bg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    iconColor: '#4f46e5',
    markerColor: '#4f46e5'
  },
  food: {
    label: '맛집',
    bg: 'bg-amber-100 text-amber-700 border-amber-200',
    iconColor: '#d97706',
    markerColor: '#d97706'
  },
  cafe: {
    label: '디저트/카페',
    bg: 'bg-pink-100 text-pink-700 border-pink-200',
    iconColor: '#db2777',
    markerColor: '#db2777'
  },
  shopping: {
    label: '쇼핑',
    bg: 'bg-purple-100 text-purple-700 border-purple-200',
    iconColor: '#9333ea',
    markerColor: '#9333ea'
  },
  sightseeing: {
    label: '관광',
    bg: 'bg-rose-100 text-rose-700 border-rose-200',
    iconColor: '#e11d48',
    markerColor: '#e11d48'
  },
  activity: {
    label: '엔터/문화',
    bg: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    iconColor: '#0891b2',
    markerColor: '#0891b2'
  }
}

export const getCategoryInfo = (category) => {
  return CATEGORY_CONFIG[category] || {
    label: '기타',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    iconColor: '#64748b',
    markerColor: '#64748b'
  }
}

export const formatCurrency = (amount) => {
  if (!amount || amount === 0) return '0'
  return new Intl.NumberFormat('ko-KR').format(amount)
}
