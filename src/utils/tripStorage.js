import defaultTravelPlan from '../data/travelPlan.json'
import jejuTravelPlan from '../data/jejuTravelPlan.json'

const STORAGE_KEY_TRIPS = 'travel_planner_trips'
const STORAGE_KEY_ACTIVE_ID = 'travel_planner_active_trip_id'

// 기본 여행 데이터 객체 준비 (id 보장)
const osakaTrip = {
  id: 'osaka-default',
  ...defaultTravelPlan,
  isDefault: true
}

const jejuTrip = {
  id: 'jeju-2026',
  ...jejuTravelPlan,
  isDefault: true
}

export const defaultTrips = [jejuTrip, osakaTrip]

/**
 * 날짜순으로 여행 정렬하는 헬퍼
 */
export function sortTripsByDate(tripsList) {
  return [...tripsList].sort((a, b) => {
    const startA = a.tripInfo?.startDate || '9999-99-99'
    const startB = b.tripInfo?.startDate || '9999-99-99'
    return startA.localeCompare(startB)
  })
}

/**
 * 저장된 여행 목록 가져오기 (없으면 기본 오사카 & 제주도 여행으로 초기화)
 */
export function getStoredTrips() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_TRIPS)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        // 기본 여행(isDefault) 항목들은 최신 JSON 파일 내용으로 항상 갱신/동기화
        let currentTrips = parsed.map((t) => {
          if (t.id === 'osaka-default') return osakaTrip
          if (t.id === 'jeju-2026') return jejuTrip
          return t
        })

        const hasOsaka = currentTrips.some((t) => t.id === 'osaka-default')
        const hasJeju = currentTrips.some((t) => t.id === 'jeju-2026')

        if (!hasOsaka) currentTrips.unshift(osakaTrip)
        if (!hasJeju) currentTrips.unshift(jejuTrip)

        saveTrips(currentTrips)
        return sortTripsByDate(currentTrips)
      }
    }
  } catch (e) {
    console.error('Failed to load stored trips:', e)
  }
  
  // 기본 데이터 저장 후 반환
  const initialTrips = [jejuTrip, osakaTrip]
  saveTrips(initialTrips)
  return sortTripsByDate(initialTrips)
}

/**
 * 여행 목록 저장하기
 */
export function saveTrips(trips) {
  try {
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips))
  } catch (e) {
    console.error('Failed to save trips:', e)
  }
}

/**
 * 현재 선택된 여행 ID 가져오기
 */
export function getActiveTripId(trips) {
  try {
    const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID)
    if (savedId && trips.some((t) => t.id === savedId)) {
      return savedId
    }
  } catch (e) {
    console.error('Failed to load active trip ID:', e)
  }
  return trips[0]?.id || 'osaka-default'
}

/**
 * 현재 선택된 여행 ID 저장하기
 */
export function setActiveTripId(tripId) {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, tripId)
  } catch (e) {
    console.error('Failed to set active trip ID:', e)
  }
}

/**
 * 시작일과 종료일을 바탕으로 일차별 기본 구조 생성
 */
export function createDaysFromDates(startDateStr, endDateStr) {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  let start = new Date(startDateStr)
  let end = new Date(endDateStr)

  if (isNaN(start.getTime())) start = new Date()
  if (isNaN(end.getTime())) {
    end = new Date(start)
    end.setDate(start.getDate() + 2)
  }

  // 시작일이 종료일보다 늦으면 조정
  if (start > end) {
    end = new Date(start)
  }

  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  const days = []
  for (let i = 0; i < diffDays; i++) {
    const currentDate = new Date(start)
    currentDate.setDate(start.getDate() + i)

    const month = currentDate.getMonth() + 1
    const date = currentDate.getDate()
    const dayOfWeek = dayNames[currentDate.getDay()]
    const yyyy = currentDate.getFullYear()
    const mm = String(month).padStart(2, '0')
    const dd = String(date).padStart(2, '0')

    days.push({
      day: i + 1,
      date: `${month}.${date}(${dayOfWeek})`,
      fullDate: `${yyyy}-${mm}-${dd}`,
      title: `Day ${i + 1} ${month}/${date}(${dayOfWeek})`,
      schedules: []
    })
  }

  return days
}

/**
 * 여행 데이터를 JSON 파일로 다운로드
 */
export function exportTripToJson(trip) {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    const fileName = `${trip.tripInfo?.title || '여행계획'}_${trip.id}.json`.replace(/[/\\?%*:|"<>]/g, '_')
    downloadAnchor.setAttribute('download', fileName)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  } catch (e) {
    console.error('Failed to export trip JSON:', e)
  }
}
