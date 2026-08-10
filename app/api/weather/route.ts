const KMA_WEATHER_URL =
  "https://www.weather.go.kr/w/forecast/overall/short-term.do?stnId=109";

type Forecast = {
  condition: string;
  high: string;
  low: string;
};

function decodeEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    lt: "<",
    middot: "·",
    nbsp: " ",
    quot: '"',
  };

  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&([a-z]+);/gi, (entity, name: string) =>
      namedEntities[name.toLowerCase()] ?? entity,
    );
}

function plainText(value: string) {
  return decodeEntities(
    value.replace(/<br\s*\/?\s*>/gi, " ").replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function dateKeyForForecastDay(
  year: number,
  month: number,
  announcedDay: number,
  forecastDay: number,
) {
  const date = new Date(Date.UTC(year, month - 1, forecastDay));

  if (forecastDay < announcedDay - 15) {
    date.setUTCMonth(date.getUTCMonth() + 1);
  }

  return date.toISOString().slice(0, 10);
}

function rowCells(table: string, label: string) {
  const row = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].find((match) =>
    plainText(match[1]).includes(label),
  )?.[1];

  if (!row) return [];

  return [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) =>
    plainText(match[1]),
  );
}

function parseKmaForecast(html: string) {
  const announcementBlock = html.match(
    /<div[^>]*class=["'][^"']*cmp-view-announce[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  )?.[1];
  const publishedAt = announcementBlock ? plainText(announcementBlock) : "";
  const announcementDate = publishedAt.match(
    /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일[\s\S]*?(\d{1,2}:\d{2})\s*발표/,
  );

  if (!announcementDate) {
    throw new Error("기상청 발표 시각을 읽지 못했습니다.");
  }

  const [, yearText, monthText, announcedDayText] = announcementDate;
  const year = Number(yearText);
  const month = Number(monthText);
  const announcedDay = Number(announcedDayText);

  const summaryBlock = html.match(
    /<p[^>]*class=["'][^"']*summary[^"']*["'][^>]*>([\s\S]*?)<\/p>/i,
  )?.[1];
  const summaryLines = summaryBlock
    ? [...summaryBlock.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi)].map((match) =>
        plainText(match[1]).replace(/^[□○]\s*/, ""),
      )
    : [];
  const overall =
    summaryLines.find((line) => line.startsWith("(종합)"))?.replace(/^\(종합\)\s*/, "") ??
    "서울 단기예보";
  const conditionByDay = new Map<number, string>();

  summaryLines.forEach((line) => {
    const forecast = line.match(
      /\([^,]+,\s*(\d{1,2})(?:~(\d{1,2}))?일\)\s*(.+)/,
    );
    if (!forecast) return;

    const start = Number(forecast[1]);
    const end = Number(forecast[2] ?? forecast[1]);
    const condition = forecast[3].replace(/,\s*서해5도.*$/, "").trim();

    for (let day = start; day <= end; day += 1) {
      conditionByDay.set(day, condition);
    }
  });

  const table = html.match(
    /<table[^>]*class=["'][^"']*table-col[^"']*whitespaced[^"']*["'][^>]*>([\s\S]*?)<\/table>/i,
  )?.[1];

  if (!table) {
    throw new Error("기상청 기온 표를 읽지 못했습니다.");
  }

  const tableHead = table.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i)?.[1] ?? "";
  const headers = [...tableHead.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)]
    .map((match) => plainText(match[1]))
    .slice(1);
  const lowTemperatures = rowCells(table, "최저기온");
  const highTemperatures = rowCells(table, "최고기온");
  const forecasts: Record<string, Forecast> = {};

  headers.forEach((header, index) => {
    const dayMatch = header.match(/\((\d{1,2})일\)/);
    if (!dayMatch || !lowTemperatures[index] || !highTemperatures[index]) return;

    const forecastDay = Number(dayMatch[1]);
    const dateKey = dateKeyForForecastDay(year, month, announcedDay, forecastDay);
    forecasts[dateKey] = {
      condition: conditionByDay.get(forecastDay) ?? "기상청 단기예보",
      high: highTemperatures[index],
      low: lowTemperatures[index],
    };
  });

  if (Object.keys(forecasts).length === 0) {
    throw new Error("기상청 날짜별 예보를 읽지 못했습니다.");
  }

  return {
    source: "기상청 날씨누리",
    sourceUrl: KMA_WEATHER_URL,
    publishedAt,
    overall,
    forecasts,
  };
}

export async function GET() {
  try {
    const response = await fetch(KMA_WEATHER_URL, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ko-KR,ko;q=0.9",
      },
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      throw new Error(`기상청 응답 오류: ${response.status}`);
    }

    const data = parseKmaForecast(await response.text());

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("KMA weather fetch failed", error);
    return Response.json(
      { error: "기상청 날씨누리 예보를 불러오지 못했습니다." },
      { status: 502 },
    );
  }
}
