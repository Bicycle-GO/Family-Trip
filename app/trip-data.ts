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
  seodaemunPrison: {
    id: "seodaemunPrison",
    name: "서대문형무소역사관",
    address: "서울 서대문구 통일로 251",
    lat: 37.574271,
    lng: 126.956071,
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
        time: "07:00",
        title: "전주 출발",
        meta: "자가용 · 수도권 진입 정체 고려",
        detail: "서울 시내의 평일 오전 정체를 피해 이른 시간에 출발합니다.",
        transit: "자가용",
        status: "장거리",
      },
      {
        id: "d1-hotel",
        time: "10:20–11:00",
        title: "호텔 도착 · 주차",
        placeId: "hotel",
        meta: "짐 보관 후 마곡에서 휴식",
        detail: "체크인 전 조기 주차와 프런트 짐 보관 가능 여부를 미리 확인합니다.",
        status: "확인 필요",
      },
      {
        id: "d1-lunch",
        time: "11:10–12:10",
        title: "마곡 점심 · 휴식",
        placeId: "magokMeal",
        meta: "냉방과 좌석이 편한 식당 우선",
        detail: "첫날부터 무리하지 않도록 호텔 주변에서 여유 있게 식사합니다.",
        status: "미정",
      },
      {
        id: "d1-transit",
        time: "12:30–13:30",
        title: "광화문으로 이동",
        meta: "공항철도 → 공덕 → 5호선",
        detail: "마곡나루역에서 공덕역을 거쳐 광화문역으로 이동합니다.",
        transit: "지하철",
      },
      {
        id: "d1-history",
        time: "13:40–16:10",
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
    theme: "비가 그친 뒤, 공예와 궁궐을 천천히 잇다",
    color: "#0369a1",
    distanceNote: "오전 호텔 휴식 → 오후 안국",
    summary: "실내 박물관 1곳 · 늦은 궁궐 관람",
    alert: "창덕궁 후원 예약을 16:00 회차로 변경 · 전각 입장권 별도",
    route: [
      "hotel",
      "craftMuseum",
      "changdeokgung",
      "ikseondong",
      "hotel",
    ],
    stops: [
      {
        id: "d2-breakfast",
        time: "08:00–09:00",
        title: "아침 식사",
        placeId: "hotel",
        meta: "비 오는 오전은 서두르지 않기",
        detail: "기상 상황을 확인하며 호텔에서 여유 있게 아침을 먹습니다.",
      },
      {
        id: "d2-morning-rest",
        time: "09:00–11:30",
        title: "호텔 휴식 · 수영장 선택",
        placeId: "hotel",
        meta: "오전 비를 피하고 체력 비축",
        detail: "객실에서 쉬거나 예약 가능할 때 수영장을 이용합니다. 수영장 포함 여부와 QR 예약을 확인합니다.",
        status: "확인 필요",
      },
      {
        id: "d2-lunch",
        time: "11:40–12:40",
        title: "마곡에서 이른 점심",
        placeId: "magokMeal",
        meta: "비가 잦아드는 동안 호텔 인근 식사",
        detail: "멀리 이동하기 전에 냉방과 좌석이 편한 식당에서 식사합니다.",
        status: "미정",
      },
      {
        id: "d2-depart",
        time: "13:00–14:10",
        title: "안국으로 이동",
        meta: "9호선 급행 → 고속터미널 → 3호선",
        detail: "비가 그친 뒤 출발해 가장 더운 시간은 실내 박물관에서 보냅니다.",
        transit: "지하철",
      },
      {
        id: "d2-craft",
        time: "14:10–15:25",
        title: "서울공예박물관",
        placeId: "craftMuseum",
        meta: "무료 · 실내 · 더위와 잔비 피하기",
        detail: "가장 더운 시간에는 실내에서 왕실 문화를 완성한 장인과 기술자의 노동을 살펴봅니다.",
        history: "역사는 왕의 명령만이 아니라 이름 없는 장인과 기술자의 노동으로 완성됐다는 점에 주목합니다.",
        question: "전통기술은 오늘날의 디자인과 산업에 어떤 모습으로 남아 있을까?",
      },
      {
        id: "d2-garden-wait",
        time: "15:25–15:55",
        title: "창덕궁 후원 입구 이동 · 대기",
        placeId: "changdeokgung",
        meta: "도보 약 10분 · 예약 화면과 신분증 확인",
        detail: "공예박물관에서 창덕궁으로 이동해 물을 보충하고 16시 해설을 준비합니다.",
      },
      {
        id: "d2-garden",
        time: "16:00–17:10",
        title: "창덕궁 후원 해설",
        placeId: "changdeokgung",
        meta: "부용지 · 주합루 · 늦은 오후 숲길",
        detail: "비가 그치고 기온이 내려가는 시간에 후원의 숲과 연못을 천천히 걷습니다.",
        status: "예약",
        history: "자연 지형을 거스르지 않고 정자와 연못을 배치한 조선 궁궐의 공간 감각을 살펴봅니다.",
        question: "자연을 바꾸는 정원과 자연에 맞추는 정원은 어떤 차이가 있을까?",
      },
      {
        id: "d2-palace",
        time: "17:15–18:15",
        title: "창덕궁 전각 관람",
        placeId: "changdeokgung",
        meta: "돈화문 · 인정전 · 선정전 · 낙선재",
        detail: "문 닫기 전 핵심 전각을 중심으로 짧고 선명하게 관람합니다.",
        history: "임진왜란 이후 약 270년간 실질적인 중심 궁궐로 사용된 공간을 살펴봅니다.",
        question: "아름다운 궁궐에 영광과 주권 상실의 기억이 함께 남아 있다는 사실을 어떻게 기억할까?",
      },
      {
        id: "d2-dinner",
        time: "18:20–19:30",
        title: "익선동 · 종로3가 저녁",
        placeId: "ikseondong",
        meta: "대기 짧고 냉방되는 식당 우선",
        detail: "늦은 궁궐 관람 뒤 가까운 곳에서 충분히 쉬며 저녁을 먹습니다.",
        status: "미정",
      },
      {
        id: "d2-evening-walk",
        time: "19:30–20:20",
        title: "익선동 저녁 산책 · 카페",
        placeId: "ikseondong",
        meta: "기온이 내려간 뒤 짧게 걷기",
        detail: "비가 완전히 그쳤을 때만 골목을 천천히 걷고, 습하면 바로 카페에서 쉽니다.",
      },
      {
        id: "d2-return",
        time: "20:20–21:30",
        title: "호텔 복귀",
        placeId: "hotel",
        meta: "종로3가역 5호선 → 공덕 → 공항철도",
        detail: "가족 체력을 보며 산책을 줄이고 일찍 돌아가도 좋습니다.",
        transit: "지하철",
      },
    ],
  },
  {
    id: "day3",
    tab: "3일차",
    date: "8.14",
    weekday: "금",
    eyebrow: "지식에서 독립의 기억까지",
    theme: "사람을 살린 지식과 자유를 지킨 사람들을 만나다",
    color: "#047857",
    distanceNote: "강서구 → 서대문 → 전주",
    summary: "박물관 2곳 · 20:00 전주 도착 목표",
    alert: "15:20 서울 출발 · 금요일 연휴 정체를 고려해 휴게소 1회만 이용",
    route: ["hotel", "heojunMuseum", "seodaemunPrison"],
    stops: [
      {
        id: "d3-breakfast",
        time: "07:30–08:30",
        title: "아침 식사 · 체크아웃 준비",
        placeId: "hotel",
        meta: "짐은 차량에 싣고 바로 이동",
        detail: "두 박물관을 거쳐 바로 전주로 출발할 수 있도록 체크아웃을 마칩니다.",
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
        time: "11:20–13:20",
        title: "서대문 이동 · 점심",
        placeId: "seodaemunPrison",
        meta: "차량 이동 후 서대문역 인근 식사",
        detail: "짐을 실은 차량으로 서대문까지 이동하고 냉방되는 식당에서 점심을 먹습니다.",
        transit: "자가용",
      },
      {
        id: "d3-prison",
        time: "13:30–15:20",
        title: "서대문형무소역사관",
        placeId: "seodaemunPrison",
        meta: "독립운동 · 민주화운동 · 옥사와 전시관",
        detail: "실내 전시를 중심으로 보고 야외 공간은 햇볕과 체력에 따라 줄입니다.",
        history: "식민지 억압과 독립운동, 이후 민주화운동의 기억이 한 장소에 어떻게 쌓였는지 살펴봅니다.",
        question: "자유를 지키기 위해 감수한 희생을 오늘의 우리는 어떻게 기억해야 할까?",
      },
      {
        id: "d3-jeonju",
        time: "15:20–20:00",
        title: "전주로 이동 · 귀가",
        meta: "약 213km · 휴게소 1회 · 20시 도착 목표",
        detail: "금요일과 연휴 전날 정체를 감안해 15시 20분에는 서울을 출발합니다. 교통 상황에 따라 도착은 20시 전후로 달라질 수 있습니다.",
        transit: "자가용",
        status: "장거리",
      },
    ],
  },
];
