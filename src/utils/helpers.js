export const CATEGORY_CONFIG = {
  flight: {
    label: '항공',
    bg: 'bg-primary-950 text-primary-500 border-primary-900',
    iconColor: '#2909f6',
    markerColor: '#2909f6'
  },
  transit: {
    label: '대중교통',
    bg: 'bg-background-950 text-background-400 border-background-800',
    iconColor: '#3333cc',
    markerColor: '#3333cc'
  },
  hotel: {
    label: '숙소',
    bg: 'bg-text-950 text-text-400 border-text-900',
    iconColor: '#140c5a',
    markerColor: '#140c5a'
  },
  food: {
    label: '식당',
    bg: 'bg-secondary-950 text-secondary-500 border-secondary-900',
    iconColor: '#fb0442',
    markerColor: '#fb0442'
  },
  cafe: {
    label: '카페',
    bg: 'bg-secondary-950 text-secondary-600 border-secondary-900',
    iconColor: '#fc3668',
    markerColor: '#fc3668'
  },
  shopping: {
    label: '쇼핑',
    bg: 'bg-accent-950 text-accent-500 border-accent-900',
    iconColor: '#f6098f',
    markerColor: '#f6098f'
  },
  sightseeing: {
    label: '관광',
    bg: 'bg-primary-950 text-primary-600 border-primary-900',
    iconColor: '#533af8',
    markerColor: '#533af8'
  },
  activity: {
    label: '기타',
    bg: 'bg-background-900 text-text-200 border-background-800',
    iconColor: '#1e1287',
    markerColor: '#1e1287'
  }
}

export const getCategoryInfo = (category) => {
  return CATEGORY_CONFIG[category] || {
    label: '기타',
    bg: 'bg-background-900 text-text-200 border-background-800',
    iconColor: '#1e1287',
    markerColor: '#1e1287'
  }
}

export const formatCurrency = (amount) => {
  if (!amount || amount === 0) return '0'
  return new Intl.NumberFormat('ko-KR').format(amount)
}
