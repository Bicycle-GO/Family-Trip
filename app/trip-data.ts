export type Place = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  provisional?: boolean;
  summary: string;
  image?: {
    src: string;
    alt: string;
    credit: string;
    sourceUrl: string;
  };
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
    summary: "마곡나루역과 서울식물원에 가까운 이번 여행의 숙소입니다. 장거리 이동 뒤 쉬고, 2일차에는 비가 그친 뒤 도심으로 출발하는 거점으로 이용합니다.",
  },
  magokMeal: {
    id: "magokMeal",
    name: "마곡 점심 지역",
    address: "호텔·마곡나루역 인근, 식당 미정",
    lat: 37.5661,
    lng: 126.8262,
    provisional: true,
    summary: "호텔과 마곡나루역 주변에서 식당을 정할 예정인 구역입니다. 가족 좌석, 대기 시간, 아이가 먹기 편한 메뉴를 기준으로 당일 선택하세요.",
  },
  historyMuseum: {
    id: "historyMuseum",
    name: "대한민국역사박물관",
    address: "서울 종로구 세종대로 198",
    lat: 37.573713,
    lng: 126.978338,
    summary: "광화문 앞에서 개항 이후 오늘까지 대한민국의 근현대사를 살펴보는 국립 박물관입니다. 가족과 함께 민주주의, 산업화, 분단과 일상의 변화를 시대순으로 연결해 보기 좋습니다.",
    image: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/20240413%20National%20Museum%20of%20Korean%20Contemporary%20History.jpg?width=900",
      alt: "광화문 앞 대한민국역사박물관 건물",
      credit: "Jjw · CC BY 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:20240413_National_Museum_of_Korean_Contemporary_History.jpg",
    },
  },
  daehangnoMeal: {
    id: "daehangnoMeal",
    name: "대학로·창경궁 저녁 지역",
    address: "창경궁 인근, 식당 미정",
    lat: 37.5817,
    lng: 127.001,
    provisional: true,
    summary: "창경궁 야간 관람 전에 저녁을 먹을 예정인 대학로·창경궁 주변 구역입니다. 관람 입장 시각과 도보 이동을 고려해 가까운 식당을 선택하세요.",
  },
  changgyeonggung: {
    id: "changgyeonggung",
    name: "창경궁",
    address: "서울 종로구 창경궁로 185",
    lat: 37.577678,
    lng: 126.993855,
    summary: "조선 왕실의 생활 공간이었던 궁궐로, 명정전과 통명전, 춘당지까지 이어지는 길에서 궁궐의 쓰임과 일제강점기 훼손 뒤 복원 과정을 함께 살펴볼 수 있습니다.",
    image: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Korea-Seoul-Changgyeonggung-Myeongjeongjeon-01.jpg?width=900",
      alt: "창경궁 명정전과 앞뜰",
      credit: "d'n'c · CC BY-SA",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Korea-Seoul-Changgyeonggung-Myeongjeongjeon-01.jpg",
    },
  },
  anguk: {
    id: "anguk",
    name: "안국역",
    address: "서울 종로구 율곡로 지하 62",
    lat: 37.576477,
    lng: 126.985443,
    summary: "창덕궁과 서울공예박물관, 북촌으로 이어지는 도심 이동 거점입니다. 3호선을 이용하며 출구에 따라 보행 거리가 달라질 수 있습니다.",
  },
  changdeokgung: {
    id: "changdeokgung",
    name: "창덕궁·후원",
    address: "서울 종로구 율곡로 99",
    lat: 37.579032,
    lng: 126.991012,
    summary: "자연 지형을 살린 배치로 잘 알려진 조선의 궁궐입니다. 인정전 일대와 예약제로 운영되는 후원을 함께 보면 왕실의 공식 공간과 휴식 공간의 차이를 이해하기 좋습니다.",
    image: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Changdeokgung0001.jpg?width=900",
      alt: "창덕궁의 전각과 마당",
      credit: "Ori~ · Public domain",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Changdeokgung0001.jpg",
    },
  },
  angukMeal: {
    id: "angukMeal",
    name: "안국역 점심 지역",
    address: "안국역 인근, 식당 미정",
    lat: 37.5768,
    lng: 126.9848,
    provisional: true,
    summary: "안국역 주변에서 점심을 고를 예정인 구역입니다. 이후 일정이 실내 관람과 후원 해설로 이어지므로 이동이 짧고 대기가 적은 곳이 적합합니다.",
  },
  craftMuseum: {
    id: "craftMuseum",
    name: "서울공예박물관",
    address: "서울 종로구 율곡로3길 4",
    lat: 37.5767,
    lng: 126.983548,
    summary: "옛 풍문여고 터에 자리한 공예 전문 박물관입니다. 전통 재료와 장인의 기술이 오늘의 생활과 디자인으로 어떻게 이어지는지 실내 전시로 살펴볼 수 있습니다.",
    image: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Seoul%20Museum%20of%20Craft%20Art.jpg?width=900",
      alt: "서울공예박물관 외관",
      credit: "Youngjin · CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Seoul_Museum_of_Craft_Art.jpg",
    },
  },
  jongmyo: {
    id: "jongmyo",
    name: "종묘",
    address: "서울 종로구 종로 157",
    lat: 37.571035,
    lng: 126.995147,
    summary: "조선 왕과 왕비의 신주를 모시고 제례를 올리던 왕실 사당입니다. 길게 이어진 정전과 절제된 공간 구성에서 조선 왕실의 유교적 예법을 살펴볼 수 있습니다.",
    image: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Jeongjeon%2C%20Jongmyo%20Shrine%20%28oblique%29%20-%20Seoul%2C%20Korea.jpg?width=900",
      alt: "종묘 정전의 긴 전각",
      credit: "Daderot · Public domain",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Jeongjeon,_Jongmyo_Shrine_(oblique)_-_Seoul,_Korea.jpg",
    },
  },
  ikseondong: {
    id: "ikseondong",
    name: "익선동·종로3가 저녁 지역",
    address: "익선동 일대, 식당 미정",
    lat: 37.5743,
    lng: 126.9898,
    provisional: true,
    summary: "한옥 골목과 작은 식당·카페가 모인 익선동 일대입니다. 저녁 식사 뒤 기온과 가족 체력을 살펴 짧게 산책하거나 바로 쉬어 갈 수 있습니다.",
  },
  heojunMuseum: {
    id: "heojunMuseum",
    name: "허준박물관",
    address: "서울 강서구 허준로 87",
    lat: 37.568,
    lng: 126.851,
    summary: "강서구와 인연이 깊은 의관 허준의 생애와 《동의보감》을 중심으로 조선 의학을 소개하는 박물관입니다. 사람을 살피고 지식을 책으로 나눈 의미를 가족과 이야기해 보기 좋습니다.",
    image: {
      src: "https://culture.gangseo.seoul.kr/resources/gsfc/img/sub/hj-img_01.jpg",
      alt: "허준박물관 입구와 전경",
      credit: "강서구 허준박물관",
      sourceUrl: "https://culture.gangseo.seoul.kr/gsfc/main/contents.do?menuNo=800119",
    },
  },
  seodaemunPrison: {
    id: "seodaemunPrison",
    name: "서대문형무소역사관",
    address: "서울 서대문구 통일로 251",
    lat: 37.574271,
    lng: 126.956071,
    summary: "일제강점기 독립운동가들이 수감되었던 현장을 보존한 역사관입니다. 옥사와 전시관을 통해 식민지 억압, 독립운동, 민주화운동의 기억을 차분히 살펴봅니다.",
    image: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Seodaemun%20Prison%2020190331%20162931.jpg?width=900",
      alt: "붉은 벽돌로 지어진 서대문형무소역사관",
      credit: "H. Y. Shin 000 · CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Seodaemun_Prison_20190331_162931.jpg",
    },
  },
  warMemorial: {
    id: "warMemorial",
    name: "전쟁기념관",
    address: "서울 용산구 이태원로 29",
    lat: 37.53653,
    lng: 126.977139,
    summary: "한반도의 전쟁사와 6·25전쟁, 국군의 역사를 전시하는 기념관입니다. 전쟁의 과정뿐 아니라 희생과 평화의 의미에 초점을 두고 핵심 전시를 골라 관람합니다.",
    image: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/War%20Memorial%20Korea%2020150623%2018%20%2819044457186%29.jpg?width=900",
      alt: "서울 용산 전쟁기념관 전경",
      credit: "Jeon Han / Korea.net · CC BY-SA",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:War_Memorial_Korea_20150623_18_(19044457186).jpg",
    },
  },
  yongsanMeal: {
    id: "yongsanMeal",
    name: "삼각지·용산 저녁 지역",
    address: "전쟁기념관 인근, 식당 미정",
    lat: 37.5354,
    lng: 126.9739,
    provisional: true,
    summary: "전쟁기념관 관람 뒤 저녁과 휴식을 위해 잡은 삼각지·용산 주변 구역입니다. 전주로 출발하기 전 주차, 화장실, 운전자 휴식 시간을 함께 확보하세요.",
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
    eyebrow: "지식 · 독립 · 전쟁과 평화",
    theme: "사람을 살린 지식에서 자유와 평화의 기억까지",
    color: "#047857",
    distanceNote: "강서구 → 서대문 → 용산 → 전주",
    summary: "역사관 3곳 · 20:00 서울 출발",
    alert: "20:00 전주로 출발 · 휴게소 1~2회 이용 시 자정 전후 도착 예상",
    route: [
      "hotel",
      "heojunMuseum",
      "seodaemunPrison",
      "warMemorial",
      "yongsanMeal",
    ],
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
        id: "d3-war-transit",
        time: "15:20–16:00",
        title: "용산으로 이동",
        placeId: "warMemorial",
        meta: "서대문 → 전쟁기념관 · 차량 이동",
        detail: "17시 입장 마감 전에 도착할 수 있도록 서대문형무소 관람을 15시 20분에 마칩니다.",
        transit: "자가용",
      },
      {
        id: "d3-war",
        time: "16:00–17:50",
        title: "전쟁기념관",
        placeId: "warMemorial",
        meta: "무료 · 실내 · 입장 마감 17:00",
        detail: "호국추모실과 6·25전쟁실을 중심으로 관람하고 야외 전시는 체력에 따라 줄입니다.",
        history: "전쟁을 승패의 기록에만 머물지 않고 사람의 희생과 평화의 가치로 바라봅니다.",
        question: "전쟁을 기억하는 일은 다음 전쟁을 막는 데 어떤 도움을 줄 수 있을까?",
      },
      {
        id: "d3-dinner",
        time: "18:00–19:15",
        title: "삼각지 · 용산 이른 저녁",
        placeId: "yongsanMeal",
        meta: "밤 운전 전 충분히 식사하고 휴식",
        detail: "대기가 짧고 주차가 가능한 식당을 선택해 운전자도 여유 있게 쉽니다.",
        status: "미정",
      },
      {
        id: "d3-drive-prep",
        time: "19:15–20:00",
        title: "출발 준비 · 운전자 휴식",
        placeId: "yongsanMeal",
        meta: "주유 · 화장실 · 생수와 간식 준비",
        detail: "차량 상태와 실시간 교통을 확인하고 운전자는 출발 전 충분히 쉽니다.",
        status: "확인 필요",
      },
      {
        id: "d3-jeonju",
        time: "20:00",
        title: "전주로 출발",
        meta: "약 213km · 휴게소 1~2회 · 자정 전후 도착 예상",
        detail: "졸음이나 피로가 느껴지면 도착 시각보다 안전을 우선해 휴게소에서 쉬고, 필요하면 숙박 후 이동합니다.",
        transit: "자가용",
        status: "장거리",
      },
    ],
  },
];
