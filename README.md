# ✈️ 오사카 2박 3일 여행 일정 웹 앱 (Osaka Travel) 🇯🇵

오사카 2박 3일(8.29 ~ 8.31) 여행 일정을 모바일에서 보기 편하게 정리하고, 일자별 동선을 Google 지도로 시각화한 React(Vite, JS) 기반 웹 애플리케이션입니다.

## ✨ 주요 기능

1. **일자별 타임라인 (Day 1 / Day 2 / Day 3 / 전체)**
   - 각 일정별 시간, 소요시간, 카테고리 태그(항공, 이동, 숙소, 맛집, 쇼핑, 관광 등)
   - 층별 쇼핑 팁, 포켓몬센터, 치이카와랜드, 하브스, 백화점 할인쿠폰(5%) 안내
   - 구글맵 바로가기 및 외부 링크 원터치 연동
   - 1인 기준 교통비 및 예상 비용 계산 요약

2. **Google Maps 동선 시각화**
   - 방문 순서가 적힌 번호 핀 마커 (1, 2, 3...)
   - 일자별 방문지 연결 동선(Polyline) 표시
   - 일정 카드의 "지도에서 위치 확인" 클릭 시 해당 마커로 자동 이동 및 팝업 안내
   - Google Maps API Key를 `.env` 또는 웹 화면의 모달에서 바로 등록 가능

3. **여행자 편의 기능**
   - **방문 체크**: 방문 완료한 일정을 체크하여 진행 상황 한눈에 확인 (LocalStorage 자동 저장)
   - **준비물 체크리스트**: 여권, 비짓재팬, eSIM, 엔화 환전 등 준비물 체크 및 항목 추가/삭제
   - **쿠폰 및 꿀팁 모달**: 비짓재팬 웹, 다이마루 5% 쿠폰, 한큐 5% 쿠폰, 칼디 면세 환급 팁 등

4. **간편한 데이터 수정 (No DB, Pure JSON)**
   - `src/data/travelPlan.json` 파일에서 시간, 장소, 링크, 메모, 비용 등을 텍스트 에디터로 손쉽게 수정 가능

---

## 🛠️ 시작하기

### 설치 및 로컬 실행

```bash
# 의존성 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

### Google Maps API 키 설정 (선택 사항)

프로젝트 루트의 `.env` 파일에 발급받은 Google Maps API Key를 추가하거나 웹 앱 상단의 **'지도키'** 버튼을 눌러 입력할 수 있습니다:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

---

## 📁 프로젝트 구조

```text
osaka-travel/
├── src/
│   ├── data/
│   │   └── travelPlan.json          # 여행 일정 및 장소 좌표, 팁 데이터
│   ├── components/
│   │   ├── Header.jsx               # 상단 헤더 & 바로가기 버튼
│   │   ├── DayTabs.jsx              # Day 1, 2, 3 및 뷰 모드(분할/일정/지도) 탭
│   │   ├── GoogleMapView.jsx        # Google Maps 인터랙티브 지도 및 동선
│   │   ├── TimelineList.jsx         # 타임라인 일정 목록
│   │   ├── TimelineCard.jsx         # 개별 일정 카드 (시간, 비용, 링크, 방문체크)
│   │   ├── ExpenseSummary.jsx       # 1인 기준 비용 합계 요약
│   │   ├── TravelTipsModal.jsx      # 할인 쿠폰 및 여행 팁 모달
│   │   ├── ChecklistModal.jsx       # 준비물 체크리스트 모달
│   │   └── ApiKeyModal.jsx          # 구글 맵 API 키 설정 모달
│   ├── utils/
│   │   └── helpers.js               # 카테고리 색상 및 통화 포맷 함수
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── package.json
```
