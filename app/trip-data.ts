export type Place = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  provisional?: boolean;
};

export type TripStop = {
  id: string;
  time: string;
  title: string;
  placeId?: string;
  meta: string;
  detail: string;
  transit?: string;
  status?: "예약" | "확인 필요" | "미정" | "장거리";
  history?: string;
  question?: string;
};

export type DayPlan = {
  id: "day1" | "day2" | "day3";
  tab: string;
  date: string;
  weekday: string;
  eyebrow: string;
  theme: string;
  color: string;
  distanceNote: string;
  summary: string;
  alert?: string;
  route: string[];
  stops: TripStop[];
};

export const places: Record<string, Place> = {
  hotel: {
    id: "hotel",
    name: "머큐어 앰배서더 서울 마곡",
    address: "서울 강서구 마곡중앙로 143",
    lat: 37.566148,
    lng: 126.82563,
  },
  magokMeal: {
    id: "magokMeal",
    name: "마곡 점심 지역",
    address: "호텔·마곡나루역 인근, 식당 미정",
    lat: 37.5661,
    lng: 126.8262,
    provisional: true,
  },
  historyMuseum: {
    id: "historyMuseum",
    name: "대한민국역사박물관",
    address: "서울 종로구 세종대로 198",
    lat: 37.573713,
    lng: 126.978338,
  },
  daehangnoMeal: {
    id: "daehangnoMeal",
    name: "대학로·창경궁 저녁 지역",
    address: "창경궁 인근, 식당 미정",
    lat: 37.5817,
    lng: 127.001,
    provisional: true,
  },
  changgyeonggung: {
    id: "changgyeonggung",
    name: "창경궁",
    address: "서울 종로구 창경궁로 185",
    lat: 37.577678,
    lng: 126.993855,
  },
  anguk: {
    id: "anguk",
    name: "안국역",
    address: "서울 종로구 율곡로 지하 62",
    lat: 37.576477,
    lng: 126.985443,
  },
  changdeokgung: {
    id: "changdeokgung",
    name: "창덕궁·후원",
    address: "서울 종로구 율곡로 99",
    lat: 37.579032,
    lng: 126.991012,
  },
  angukMeal: {
    id: "angukMeal",
    name: "안국역 점심 지역",
    address: "안국역 인근, 식당 미정",
    lat: 37.5768,
    lng: 126.9848,
    provisional: true,
  },
  craftMuseum: {
    id: "craftMuseum",
    name: "서울공예박물관",
    address: "서울 종로구 율곡로3길 4",
    lat: 37.5767,
    lng: 126.983548,
  },
  jongmyo: {
    id: "jongmyo",
    name: "종묘",
    address: "서울 종로구 종로 157",
    lat: 37.571035,
    lng: 126.995147,
  },
  ikseondong: {
    id: "ikseondong",
    name: "익선동·종로3가 저녁 지역",
    address: "익선동 일대, 식당 미정",
    lat: 37.5743,
    lng: 126.9898,
    provisional: true,
  },
  heojunMuseum: {
    id: "heojunMuseum",
    name: "허준박물관",
    address: "서울 강서구 허준로 87",
    lat: 37.568,
    lng: 126.851,
  },
};

export const dayPlans: DayPlan[] = [
  {
    id: "day1",
    tab: "1일차",
    date: "8.12",
    weekday: "수",
    eyebrow: "근현대의 기억과 궁궐의 복원",
    theme: "나라를 잃고, 나누어지고, 다시 기억하는 과정",
    color: "#c2410c",
    distanceNote: "전주 → 서울 · 약 213km",
    summary: "박물관 1곳 · 궁궐 1곳 · 야간 관람",
    route: [
      "hotel",
      "magokMeal",
      "historyMuseum",
      "daehangnoMeal",
      "changgyeonggung",
      "hotel",
    ],
    stops: [
      {
        id: "d1-depart",
        time: "06:30",
        title: "전주 출발",
        meta: "자가용 · 수도권 진입 정체 고려",
        detail: "서울 시내의 평일 오전 정체를 피해 이른 시간에 출발합니다.",
        transit: "자가용",
        status: "장거리",
      },
      {
        id: "d1-hotel",
        time: "09:50–10:30",
        title: "호텔 도착 · 주차",
        placeId: "hotel",
        meta: "짐 보관 후 마곡에서 휴식",
        detail: "체크인 전 조기 주차와 프런트 짐 보관 가능 여부를 미리 확인합니다.",
        status: "확인 필요",
      },
      {
        id: "d1-lunch",
        time: "10:40–11:50",
        title: "마곡 점심 · 휴식",
        placeId: "magokMeal",
        meta: "냉방과 좌석이 편한 식당 우선",
        detail: "첫날부터 무리하지 않도록 호텔 주변에서 여유 있게 식사합니다.",
        status: "미정",
      },
      {
        id: "d1-transit",
        time: "12:20–13:20",
        title: "광화문으로 이동",
        meta: "공항철도 → 공덕 → 5호선",
        detail: "마곡나루역에서 공덕역을 거쳐 광화문역으로 이동합니다.",
        transit: "지하철",
      },
      {
        id: "d1-history",
        time: "13:30–16:00",
        title: "대한민국역사박물관",
        placeId: "historyMuseum",
        meta: "무료 · 실내 · DMZ 특별전",
        detail: "해방, 정부 수립, 전쟁, 산업화와 민주화를 한 흐름으로 살펴봅니다.",
        history: "광복이 곧바로 평화와 완성을 뜻하지 않았던 근현대사의 흐름을 연결해 봅니다.",
        question: "나라가 나뉜 기억을 다음 세대는 어떤 방식으로 이어가야 할까?",
      },
      {
        id: "d1-dinner",
        time: "16:40–17:40",
        title: "창경궁 인근 이른 저녁",
        placeId: "daehangnoMeal",
        meta: "광화문에서 버스 또는 짧은 택시",
        detail: "브레이크타임이 없고 대기가 짧은 식당을 출발 전에 정합니다.",
        status: "미정",
      },
      {
        id: "d1-palace",
        time: "17:50–20:20",
        title: "창경궁 해질녘 · 야간 관람",
        placeId: "changgyeonggung",
        meta: "홍화문 → 명정전 → 춘당지 → 대온실",
        detail: "밝을 때 전각을 보고 해가 진 뒤 춘당지와 대온실로 이어갑니다.",
        history: "왕실 생활공간이 일제강점기 창경원으로 격하되었다가 다시 궁궐의 이름과 위상을 되찾은 과정을 봅니다.",
        question: "복원은 옛 모습을 되돌리는 일일까, 아픈 역사까지 기억하는 일일까?",
      },
      {
        id: "d1-return",
        time: "20:20–21:30",
        title: "호텔 복귀",
        placeId: "hotel",
        meta: "혜화역 또는 종로3가역 활용",
        detail: "가족 체력과 실시간 길찾기를 보고 가장 편한 귀환 경로를 고릅니다.",
        transit: "지하철",
      },
    ],
  },
  {
    id: "day2",
    tab: "2일차",
    date: "8.13",
    weekday: "목",
    eyebrow: "왕권 · 자연 · 기술 · 의례",
    theme: "조선은 어떤 공간과 의례로 국가를 운영했는가",
    color: "#0369a1",
    distanceNote: "마곡 ↔ 종로 · 대중교통 중심",
    summary: "궁궐 1곳 · 박물관 1곳 · 종묘",
    alert: "창덕궁 후원 10:00 회차 예약 필수 · 전각 입장권 별도",
    route: [
      "hotel",
      "anguk",
      "changdeokgung",
      "angukMeal",
      "craftMuseum",
      "jongmyo",
      "ikseondong",
      "hotel",
    ],
    stops: [
      {
        id: "d2-breakfast",
        time: "07:00",
        title: "아침 식사",
        placeId: "hotel",
        meta: "생수와 간단한 간식 준비",
        detail: "걷는 시간이 가장 긴 날이므로 출발 전에 물과 간식을 챙깁니다.",
      },
      {
        id: "d2-depart",
        time: "07:30",
        title: "호텔 출발",
        meta: "9호선 급행 → 고속터미널 → 3호선",
        detail: "후원 예약보다 최소 70분 먼저 호텔을 나섭니다.",
        transit: "지하철",
      },
      {
        id: "d2-anguk",
        time: "08:40–08:55",
        title: "안국역 도착 · 정비",
        placeId: "anguk",
        meta: "화장실 이용 · 물 보충",
        detail: "예약 화면과 신분증을 확인하고 후원 관람 전 물을 보충합니다.",
      },
      {
        id: "d2-palace",
        time: "09:00–09:40",
        title: "창덕궁 전각 관람",
        placeId: "changdeokgung",
        meta: "돈화문 · 금천교 · 인정전 · 선정전",
        detail: "후원 입구와 가까워지는 방향으로 핵심 전각을 먼저 봅니다.",
        history: "임진왜란 이후 약 270년간 실질적인 중심 궁궐로 쓰인 공간과 자연 지형을 따른 배치를 살펴봅니다.",
        question: "곧은 축의 궁궐과 지형을 따라 배치한 궁궐은 어떤 생각의 차이를 보여줄까?",
      },
      {
        id: "d2-garden",
        time: "10:00–11:20",
        title: "창덕궁 후원 해설",
        placeId: "changdeokgung",
        meta: "부용지 · 주합루 중심",
        detail: "09:40까지 후원 입구로 이동해 예약 확인 후 해설 관람에 참여합니다.",
        status: "예약",
      },
      {
        id: "d2-rest",
        time: "11:25–12:00",
        title: "약방 · 낙선재 일대 휴식",
        placeId: "changdeokgung",
        meta: "궁피서 냉방 쉼터 활용",
        detail: "후원 관람 뒤 더위를 충분히 식히고 다음 일정으로 이동합니다.",
      },
      {
        id: "d2-lunch",
        time: "12:10–13:30",
        title: "안국역 인근 점심",
        placeId: "angukMeal",
        meta: "대기시간보다 냉방과 좌석 우선",
        detail: "가장 더운 시간의 야외 대기를 줄일 수 있는 식당을 고릅니다.",
        status: "미정",
      },
      {
        id: "d2-craft",
        time: "13:40–15:10",
        title: "서울공예박물관",
        placeId: "craftMuseum",
        meta: "무료 · 실내 · 장인과 생활기술",
        detail: "왕실 문화를 완성한 장인, 재료와 기술자의 노동을 연결해 봅니다.",
        history: "역사는 왕의 명령만이 아니라 이름 없는 장인과 기술자의 노동으로 완성됐다는 점에 주목합니다.",
        question: "전통기술은 오늘날의 디자인과 산업에 어떤 모습으로 남아 있을까?",
      },
      {
        id: "d2-jongmyo",
        time: "15:40–16:50",
        title: "종묘",
        placeId: "jongmyo",
        meta: "정전 · 영녕전 중심 60–70분",
        detail: "평일 마지막 입장 시각을 고려해 이동을 늦추지 않습니다.",
        history: "왕과 왕비의 신주를 모시고 국가 제례를 행한 공간에서 절제와 질서의 건축을 관찰합니다.",
        question: "국가는 왜 법과 군대뿐 아니라 기억과 의례로 정통성을 설명했을까?",
      },
      {
        id: "d2-dinner",
        time: "17:00–18:20",
        title: "익선동 · 종로3가 저녁",
        placeId: "ikseondong",
        meta: "식사 후 바로 호텔 복귀",
        detail: "가족의 걸음 수를 보고 대기가 적은 식당을 선택합니다.",
        status: "미정",
      },
      {
        id: "d2-pool",
        time: "19:30 이후",
        title: "호텔 휴식 또는 수영장",
        placeId: "hotel",
        meta: "가족 체력에 따라 선택",
        detail: "수영장 포함 여부, QR 예약과 수영모 준비를 확인합니다.",
        status: "확인 필요",
      },
    ],
  },
  {
    id: "day3",
    tab: "3일차",
    date: "8.14",
    weekday: "금",
    eyebrow: "허준과 백성을 위한 지식",
    theme: "좋은 지식은 누구를 위해 사용되어야 하는가",
    color: "#047857",
    distanceNote: "강서구 짧은 이동 → 전주",
    summary: "박물관 1곳 · 정오 전 서울 출발",
    alert: "광복절 연휴 전날 · 늦어도 정오 전후 서울 출발 권장",
    route: ["hotel", "heojunMuseum", "hotel"],
    stops: [
      {
        id: "d3-breakfast",
        time: "07:30–08:30",
        title: "아침 식사 · 짐 정리",
        placeId: "hotel",
        meta: "체크아웃과 주차 연장 확인",
        detail: "박물관 관람 중 짐 보관과 차량 주차가 가능한지 확인합니다.",
        status: "확인 필요",
      },
      {
        id: "d3-depart",
        time: "09:20",
        title: "호텔 출발",
        meta: "허준박물관까지 짧은 택시",
        detail: "무더위와 짐을 고려해 강서구 안에서도 택시 이동을 권장합니다.",
        transit: "택시",
      },
      {
        id: "d3-museum",
        time: "10:00–11:15",
        title: "허준박물관",
        placeId: "heojunMuseum",
        meta: "성인 1,000원 · 학생 500원",
        detail: "허준의 생애, 동의보감과 조선 의학의 체계화를 살펴봅니다.",
        history: "의학 지식을 개인의 비법이 아니라 책으로 정리해 널리 보급한 의미를 생각합니다.",
        question: "지식을 많은 사람이 활용할 수 있게 하는 일은 사회를 어떻게 바꿀까?",
      },
      {
        id: "d3-return",
        time: "11:15–11:35",
        title: "호텔 복귀 · 차량 회수",
        placeId: "hotel",
        meta: "짐을 싣고 바로 출발 준비",
        detail: "금요일 오후 정체 전에 서울을 벗어날 수 있도록 머무는 시간을 줄입니다.",
      },
      {
        id: "d3-jeonju",
        time: "11:40 전후",
        title: "전주로 출발",
        meta: "휴게소에서 점심 · 약 213km",
        detail: "광복절 연휴 차량 증가 전에 서울을 출발합니다.",
        transit: "자가용",
        status: "장거리",
      },
    ],
  },
];
