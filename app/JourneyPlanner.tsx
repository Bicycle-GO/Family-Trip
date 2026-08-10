"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { dayPlans, places, type DayPlan, type TripStop } from "./trip-data";

type LeafletLayer = {
  addTo: (target: LeafletMap | LeafletLayer) => LeafletLayer;
  remove?: () => void;
  bindPopup?: (content: string, options?: Record<string, unknown>) => LeafletLayer;
  openPopup?: () => void;
  on?: (event: string, handler: () => void) => LeafletLayer;
  clearLayers?: () => void;
  getElement?: () => HTMLElement | undefined;
};

type LeafletMap = LeafletLayer & {
  fitBounds: (
    bounds: [number, number][],
    options?: Record<string, unknown>,
  ) => void;
  setView: (
    coords: [number, number],
    zoom: number,
    options?: Record<string, unknown>,
  ) => void;
  remove: () => void;
  invalidateSize: () => void;
};

type LeafletApi = {
  map: (element: HTMLElement, options?: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options?: Record<string, unknown>) => LeafletLayer;
  layerGroup: () => LeafletLayer;
  marker: (
    coords: [number, number],
    options?: Record<string, unknown>,
  ) => LeafletLayer;
  divIcon: (options: Record<string, unknown>) => unknown;
};

declare global {
  interface Window {
    L?: LeafletApi;
  }
}

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

type MapStyle = "street" | "satellite";

type WeatherForecast = {
  condition: string;
  high: string;
  low: string;
};

type WeatherResponse = {
  source: string;
  sourceUrl: string;
  publishedAt: string;
  overall: string;
  forecasts: Partial<Record<string, WeatherForecast>>;
};

type WeatherMeta = Omit<WeatherResponse, "forecasts">;

const MAP_TILES: Record<
  MapStyle,
  {
    url: string;
    attribution: string;
    className: string;
    labelUrl?: string;
  }
> = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    className: "map-tiles--street",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    className: "map-tiles--satellite",
    labelUrl:
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  },
};

const TRIP_DATES: Record<DayPlan["id"], string> = {
  day1: "2026-08-12",
  day2: "2026-08-13",
  day3: "2026-08-14",
};

const KMA_WEATHER_URL =
  "https://www.weather.go.kr/w/forecast/overall/short-term.do?stnId=109";

function weatherIcon(condition: string) {
  if (condition.includes("뇌우")) return "⛈️";
  if (condition.includes("눈")) return "🌨️";
  if (condition.includes("소나기") || condition.includes("비")) return "🌧️";
  if (condition.includes("흐림")) return "☁️";
  if (condition.includes("구름")) return "🌤️";
  if (condition.includes("맑")) return "☀️";
  return "🌡️";
}

function announcementLabel(publishedAt: string) {
  const match = publishedAt.match(
    /(\d{1,2})월\s*(\d{1,2})일[\s\S]*?(\d{1,2}:\d{2})\s*발표/,
  );
  return match ? `${Number(match[1])}.${Number(match[2])} ${match[3]} 발표` : "기상청 발표";
}

function loadLeaflet() {
  return new Promise<LeafletApi>((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }

    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${LEAFLET_JS}"]`,
    );
    const onLoad = () => {
      if (window.L) resolve(window.L);
      else reject(new Error("Leaflet did not initialize"));
    };

    if (existingScript) {
      existingScript.addEventListener("load", onLoad, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Map failed")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.crossOrigin = "";
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", () => reject(new Error("Map failed")), {
      once: true,
    });
    document.head.appendChild(script);
  });
}

function popupMarkup(stop: TripStop, day: DayPlan) {
  return `<div class="map-popup"><span>${day.date} · ${stop.time}</span><strong>${stop.title}</strong><p>${stop.meta}</p></div>`;
}

function statusClass(status: TripStop["status"]) {
  if (status === "예약") return "status status--reservation";
  if (status === "미정") return "status status--pending";
  if (status === "장거리") return "status status--distance";
  return "status status--check";
}

export function JourneyPlanner() {
  const [activeDayId, setActiveDayId] = useState<DayPlan["id"]>("day1");
  const [selectedStopId, setSelectedStopId] = useState("d1-history");
  const [mapStyle, setMapStyle] = useState<MapStyle>("street");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [mapState, setMapState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [weatherState, setWeatherState] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [weatherByDay, setWeatherByDay] = useState<
    Partial<Record<DayPlan["id"], WeatherForecast>>
  >({});
  const [weatherMeta, setWeatherMeta] = useState<WeatherMeta | null>(null);
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const baseLayerRef = useRef<LeafletLayer | null>(null);
  const labelLayerRef = useRef<LeafletLayer | null>(null);
  const baseLayerStyleRef = useRef<MapStyle | null>(null);
  const itineraryLayerRef = useRef<LeafletLayer | null>(null);
  const markerRefs = useRef<Record<string, LeafletLayer>>({});
  const panelRef = useRef<HTMLElement>(null);
  const panelBodyRef = useRef<HTMLDivElement>(null);

  const activeDay = useMemo(
    () => dayPlans.find((day) => day.id === activeDayId) ?? dayPlans[0],
    [activeDayId],
  );
  const activeWeather = weatherByDay[activeDay.id];
  const activeWeatherIcon = activeWeather ? weatherIcon(activeWeather.condition) : null;

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/weather", {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Weather request failed");
        return response.json();
      })
      .then((data: WeatherResponse) => {
        const next: Partial<Record<DayPlan["id"], WeatherForecast>> = {};

        dayPlans.forEach((day) => {
          const forecast = data.forecasts?.[TRIP_DATES[day.id]];
          if (forecast) next[day.id] = forecast;
        });

        if (!data.source || !data.sourceUrl || !data.publishedAt || !data.forecasts) {
          throw new Error("KMA forecast response is invalid");
        }

        setWeatherByDay(next);
        setWeatherMeta({
          source: data.source,
          sourceUrl: data.sourceUrl,
          publishedAt: data.publishedAt,
          overall: data.overall,
        });
        setWeatherState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setWeatherState("error");
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    let mounted = true;

    loadLeaflet()
      .then((L) => {
        if (!mounted || !mapElementRef.current || mapRef.current) return;
        const map = L.map(mapElementRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          keyboard: true,
        });
        const initialTiles = MAP_TILES.street;
        baseLayerRef.current = L.tileLayer(initialTiles.url, {
          maxZoom: 19,
          attribution: initialTiles.attribution,
          className: initialTiles.className,
        }).addTo(map);
        baseLayerStyleRef.current = "street";
        mapRef.current = map;
        setMapState("ready");
      })
      .catch(() => {
        if (mounted) setMapState("error");
      });

    return () => {
      mounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      baseLayerRef.current = null;
      labelLayerRef.current = null;
      baseLayerStyleRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = window.L;
    const map = mapRef.current;
    if (!L || !map || mapState !== "ready") return;
    if (baseLayerStyleRef.current === mapStyle) return;

    labelLayerRef.current?.remove?.();
    labelLayerRef.current = null;
    baseLayerRef.current?.remove?.();
    const tileConfig = MAP_TILES[mapStyle];
    baseLayerRef.current = L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      attribution: tileConfig.attribution,
      className: tileConfig.className,
    }).addTo(map);
    if (tileConfig.labelUrl) {
      labelLayerRef.current = L.tileLayer(tileConfig.labelUrl, {
        maxZoom: 19,
        className: "map-tiles--labels",
      }).addTo(map);
    }
    baseLayerStyleRef.current = mapStyle;
  }, [mapState, mapStyle]);

  useEffect(() => {
    const L = window.L;
    const map = mapRef.current;
    if (!L || !map || mapState !== "ready") return;

    itineraryLayerRef.current?.clearLayers?.();
    const group = L.layerGroup().addTo(map);
    itineraryLayerRef.current = group;
    markerRefs.current = {};

    const uniquePlaces = [...new Set(activeDay.route)];
    const placeCoordinates = uniquePlaces.map((placeId) => {
      const place = places[placeId];
      return [place.lat, place.lng] as [number, number];
    });

    uniquePlaces.forEach((placeId, index) => {
      const place = places[placeId];
      const relatedStops = activeDay.stops.filter((stop) => stop.placeId === placeId);
      const primaryStop = relatedStops[0];
      const marker = L.marker([place.lat, place.lng], {
        icon: L.divIcon({
          className: "route-marker-shell",
          html: `<span class="route-marker${place.provisional ? " route-marker--provisional" : ""}" style="--marker-color:${activeDay.color}"><b>${placeId === "hotel" ? "H" : index + 1}</b></span>`,
          iconSize: [36, 42],
          iconAnchor: [18, 38],
          popupAnchor: [0, -34],
        }),
      }).addTo(group);

      if (primaryStop) {
        marker.bindPopup?.(popupMarkup(primaryStop, activeDay), {
          closeButton: false,
          offset: [0, -2],
        });
        marker.on?.("click", () => {
          setIsPanelOpen(true);
          setSelectedStopId(primaryStop.id);
          window.setTimeout(() => {
            mapRef.current?.setView([place.lat, place.lng], 16, {
              animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            });
            document
              .getElementById(`stop-${primaryStop.id}`)
              ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }, 180);
        });
      }

      relatedStops.forEach((stop) => {
        markerRefs.current[stop.id] = marker;
      });
    });

    const mobile = window.matchMedia("(max-width: 760px)").matches;
    map.fitBounds(placeCoordinates, {
      paddingTopLeft: mobile || !isPanelOpen ? [72, 88] : [470, 84],
      paddingBottomRight: mobile ? [38, 130] : [72, 72],
      maxZoom: activeDay.id === "day3" ? 13 : 12,
      animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });

    window.setTimeout(() => map.invalidateSize(), 120);
  }, [activeDay, isPanelOpen, mapState]);

  function changeDay(day: DayPlan) {
    setActiveDayId(day.id);
    const firstMappedStop = day.stops.find((stop) => stop.placeId);
    setSelectedStopId(firstMappedStop?.id ?? day.stops[0].id);
    panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    panelBodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectStop(stop: TripStop) {
    setSelectedStopId(stop.id);
    if (!stop.placeId) return;
    const place = places[stop.placeId];
    const marker = markerRefs.current[stop.id];
    marker?.bindPopup?.(popupMarkup(stop, activeDay), {
      closeButton: false,
      offset: [0, -2],
    });
    mapRef.current?.setView([place.lat, place.lng], 16, {
      animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    marker?.openPopup?.();
  }

  return (
    <main
      className={`trip-app${isPanelOpen ? "" : " trip-app--panel-hidden"}`}
      style={{ "--day-color": activeDay.color } as CSSProperties}
    >
      <a className="skip-link" href="#itinerary-list">
        일정 목록으로 건너뛰기
      </a>

      <section className="map-shell" aria-label="날짜별 여행 장소 지도">
        <div
          ref={mapElementRef}
          className="trip-map"
          role="application"
          aria-label={`${activeDay.date} 서울 여행 장소 지도`}
        />
        {mapState !== "ready" && (
          <div className={`map-fallback map-fallback--${mapState}`} role="status">
            <div className="fallback-grid" aria-hidden="true" />
            <span>{mapState === "error" ? "지도를 불러오지 못했습니다" : "서울 지도를 준비하고 있습니다"}</span>
            <small>일정 목록은 그대로 확인할 수 있습니다.</small>
          </div>
        )}
        <div className="map-control-stack">
          <section
            className="weather-card"
            aria-label={`${activeDay.date} 서울 날씨`}
            aria-live="polite"
            title={weatherMeta?.overall}
          >
            <span className="weather-card__icon" aria-hidden="true">
              {activeWeatherIcon ??
                (weatherState === "error" ? "—" : weatherState === "ready" ? "⌛" : "···")}
            </span>
            <span className="weather-card__copy">
              <span>
                {activeDay.date} 서울 · {weatherMeta ? announcementLabel(weatherMeta.publishedAt) : "기상청 발표"}
              </span>
              {activeWeather ? (
                <strong>
                  {activeWeather.condition} · 최고 {activeWeather.high}° / 최저 {activeWeather.low}°
                </strong>
              ) : (
                <strong>
                  {weatherState === "error"
                    ? "예보를 확인할 수 없어요"
                    : weatherState === "ready"
                      ? "기상청 예보 발표 대기"
                      : "날씨를 불러오는 중"}
                </strong>
              )}
            </span>
            <a
              className="weather-card__source"
              href={weatherMeta?.sourceUrl ?? KMA_WEATHER_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="기상청 날씨누리에서 서울 예보 보기"
            >
              날씨누리 <span aria-hidden="true">↗</span>
            </a>
          </section>

          <div className="map-style-switch" role="group" aria-label="지도 종류 선택">
            <button
              type="button"
              className={mapStyle === "street" ? "is-active" : undefined}
              onClick={() => setMapStyle("street")}
              aria-pressed={mapStyle === "street"}
            >
              일반지도
            </button>
            <button
              type="button"
              className={mapStyle === "satellite" ? "is-active" : undefined}
              onClick={() => setMapStyle("satellite")}
              aria-pressed={mapStyle === "satellite"}
            >
              항공사진
            </button>
          </div>
        </div>
        <div className="map-legend" aria-label="지도 범례">
          <span><i className="legend-marker">H</i>숙소</span>
          <span><i className="legend-marker legend-marker--dashed" />미정 장소</span>
        </div>
      </section>

      {!isPanelOpen && (
        <button
          type="button"
          className="panel-reopen-button"
          onClick={() => setIsPanelOpen(true)}
          aria-controls="trip-itinerary-panel"
          aria-expanded="false"
          aria-label="여행 일정 메뉴 보기"
        >
          <span aria-hidden="true">+</span>
          <strong>일정 보기</strong>
        </button>
      )}

      <aside
        ref={panelRef}
        id="trip-itinerary-panel"
        className="itinerary-panel"
        aria-label="가족여행 일정"
        hidden={!isPanelOpen}
      >
        <div className="panel-handle-row">
          <button
            type="button"
            className="panel-collapse-button"
            onClick={() => setIsPanelOpen(false)}
            aria-controls="trip-itinerary-panel"
            aria-expanded="true"
            aria-label="여행 일정 메뉴 숨기기"
          >
            <span aria-hidden="true">−</span>
          </button>
        </div>

        <header className="panel-header">
          <p className="trip-kicker">2026. 08. 12 — 08. 14</p>
          <h1>서울 역사 가족여행</h1>
          <p className="trip-subtitle">궁궐에서 DMZ까지, 국가의 기억을 걷다</p>
        </header>

        <nav className="day-switcher" aria-label="여행 날짜 선택">
          {dayPlans.map((day) => (
            <button
              key={day.id}
              type="button"
              className={day.id === activeDay.id ? "is-active" : undefined}
              onClick={() => changeDay(day)}
              aria-pressed={day.id === activeDay.id}
            >
              <span>{day.tab}</span>
              <strong>{day.date}</strong>
              <small>{day.weekday}</small>
            </button>
          ))}
        </nav>

        <div className="panel-scroll-body" ref={panelBodyRef}>
          <div className="day-intro">
            <p>{activeDay.eyebrow}</p>
            <h2>{activeDay.theme}</h2>
            <div className="day-facts">
              <span>{activeDay.distanceNote}</span>
              <span>{activeDay.summary}</span>
            </div>
          </div>

          {activeDay.alert && (
            <div className="day-alert" role="note">
              <strong>먼저 확인</strong>
              <span>{activeDay.alert}</span>
            </div>
          )}

          <div className="itinerary-scroll" id="itinerary-list">
            <ol className="stop-list">
              {activeDay.stops.map((stop) => {
                const selected = stop.id === selectedStopId;
                const place = stop.placeId ? places[stop.placeId] : undefined;
                return (
                  <li
                    key={stop.id}
                    id={`stop-${stop.id}`}
                    className={selected ? "stop-item is-selected" : "stop-item"}
                  >
                    <button
                      type="button"
                      className="stop-button"
                      onClick={() => selectStop(stop)}
                      aria-expanded={selected}
                    >
                      <span className="stop-time">{stop.time}</span>
                      <span className="stop-content">
                        <span className="stop-title-row">
                          <strong>{stop.title}</strong>
                          {stop.status && (
                            <span className={statusClass(stop.status)}>{stop.status}</span>
                          )}
                        </span>
                        <span className="stop-meta">{stop.meta}</span>
                      </span>
                      <span className="stop-toggle" aria-hidden="true">{selected ? "−" : "+"}</span>
                    </button>

                    {selected && (
                      <div className="stop-details">
                        <p>{stop.detail}</p>
                        {place && (
                          <article className="place-detail-card">
                            {place.image ? (
                              <figure>
                                {/* External source images retain their original attribution links. */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={place.image.src}
                                  alt={place.image.alt}
                                  loading="lazy"
                                  decoding="async"
                                />
                                <figcaption>
                                  사진: {" "}
                                  <a href={place.image.sourceUrl} target="_blank" rel="noreferrer">
                                    {place.image.credit} <span aria-hidden="true">↗</span>
                                  </a>
                                </figcaption>
                              </figure>
                            ) : (
                              <div className="place-detail-card__placeholder" aria-label="장소 사진 준비 중">
                                <span aria-hidden="true">{place.provisional ? "?" : place.name.slice(0, 1)}</span>
                                <small>{place.provisional ? "장소 확정 후 사진 제공" : "장소 사진 준비 중"}</small>
                              </div>
                            )}
                            <div className="place-detail-card__copy">
                              <span className="place-detail-card__eyebrow">
                                {place.provisional ? "방문 구역 · 장소 미정" : "장소 상세"}
                              </span>
                              <h3>{place.name}</h3>
                              <p>{place.summary}</p>
                              <address>{place.address}</address>
                            </div>
                          </article>
                        )}
                        {stop.history && (
                          <div className="history-note">
                            <strong>역사 포인트</strong>
                            <p>{stop.history}</p>
                          </div>
                        )}
                        {stop.question && (
                          <blockquote>
                            <span>함께 이야기해 보기</span>
                            “{stop.question}”
                          </blockquote>
                        )}
                        {place && (
                          <a
                            className="map-search-link"
                            href={`https://map.kakao.com/link/search/${encodeURIComponent(place.name)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            카카오맵에서 장소 보기 <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            <footer className="panel-footer">
              <strong>출발 전 마지막 확인</strong>
              <p>8월 11일에 날씨, 궁궐 운영 공지와 실시간 교통을 다시 확인하세요.</p>
              <span>식당과 전주 출발지는 아직 확정되지 않았습니다.</span>
            </footer>
          </div>
        </div>
      </aside>
    </main>
  );
}
