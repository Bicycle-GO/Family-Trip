"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { dayPlans, places, type DayPlan, type TripStop } from "./trip-data";

type LeafletLayer = {
  addTo: (target: LeafletMap | LeafletLayer) => LeafletLayer;
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
  panTo: (coords: [number, number], options?: Record<string, unknown>) => void;
  remove: () => void;
  invalidateSize: () => void;
};

type LeafletApi = {
  map: (element: HTMLElement, options?: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options?: Record<string, unknown>) => LeafletLayer;
  layerGroup: () => LeafletLayer;
  polyline: (
    coords: [number, number][],
    options?: Record<string, unknown>,
  ) => LeafletLayer;
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
  const [selectedStopId, setSelectedStopId] = useState("d1-hotel");
  const [mapState, setMapState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const itineraryLayerRef = useRef<LeafletLayer | null>(null);
  const markerRefs = useRef<Record<string, LeafletLayer>>({});
  const listRef = useRef<HTMLDivElement>(null);

  const activeDay = useMemo(
    () => dayPlans.find((day) => day.id === activeDayId) ?? dayPlans[0],
    [activeDayId],
  );

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
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);
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
    };
  }, []);

  useEffect(() => {
    const L = window.L;
    const map = mapRef.current;
    if (!L || !map || mapState !== "ready") return;

    itineraryLayerRef.current?.clearLayers?.();
    const group = L.layerGroup().addTo(map);
    itineraryLayerRef.current = group;
    markerRefs.current = {};

    const routeCoordinates = activeDay.route.map((placeId) => {
      const place = places[placeId];
      return [place.lat, place.lng] as [number, number];
    });

    L.polyline(routeCoordinates, {
      color: "#ffffff",
      weight: 8,
      opacity: 0.92,
      lineJoin: "round",
    }).addTo(group);
    L.polyline(routeCoordinates, {
      color: activeDay.color,
      weight: 4,
      opacity: 0.96,
      dashArray: "10 8",
      lineCap: "round",
      lineJoin: "round",
    }).addTo(group);

    const uniquePlaces = [...new Set(activeDay.route)];
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
          setSelectedStopId(primaryStop.id);
          document
            .getElementById(`stop-${primaryStop.id}`)
            ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }

      relatedStops.forEach((stop) => {
        markerRefs.current[stop.id] = marker;
      });
    });

    const mobile = window.matchMedia("(max-width: 760px)").matches;
    map.fitBounds(routeCoordinates, {
      paddingTopLeft: mobile ? [38, 88] : [470, 84],
      paddingBottomRight: mobile ? [38, 130] : [72, 72],
      maxZoom: activeDay.id === "day3" ? 13 : 12,
      animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });

    window.setTimeout(() => map.invalidateSize(), 120);
  }, [activeDay, mapState]);

  function changeDay(day: DayPlan) {
    setActiveDayId(day.id);
    const firstMappedStop = day.stops.find((stop) => stop.placeId);
    setSelectedStopId(firstMappedStop?.id ?? day.stops[0].id);
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
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
    marker?.openPopup?.();
    mapRef.current?.panTo([place.lat, place.lng], {
      animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }

  return (
    <main className="trip-app" style={{ "--day-color": activeDay.color } as CSSProperties}>
      <a className="skip-link" href="#itinerary-list">
        일정 목록으로 건너뛰기
      </a>

      <section className="map-shell" aria-label="날짜별 여행 동선 지도">
        <div
          ref={mapElementRef}
          className="trip-map"
          role="application"
          aria-label={`${activeDay.date} 서울 여행 동선 지도`}
        />
        {mapState !== "ready" && (
          <div className={`map-fallback map-fallback--${mapState}`} role="status">
            <div className="fallback-grid" aria-hidden="true" />
            <span>{mapState === "error" ? "지도를 불러오지 못했습니다" : "서울 지도를 준비하고 있습니다"}</span>
            <small>일정 목록은 그대로 확인할 수 있습니다.</small>
          </div>
        )}
        <div className="map-caption" aria-hidden="true">
          <span className="map-caption__dot" />
          서울 · {activeDay.date} {activeDay.weekday}요일
        </div>
        <div className="map-legend" aria-label="지도 범례">
          <span><i className="legend-line" />선택한 날의 이동</span>
          <span><i className="legend-marker">H</i>숙소</span>
          <span><i className="legend-marker legend-marker--dashed" />미정 장소</span>
        </div>
      </section>

      <aside className="itinerary-panel" aria-label="가족여행 일정">
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

        <div className="itinerary-scroll" ref={listRef} id="itinerary-list">
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
                      {place && <address>{place.address}</address>}
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
            {activeDay.id === "day1" ? (
              <>
                <strong>첫날의 여행 기록</strong>
                <p>계획을 바꿔 숙소 가까이에서 쉬고 걷고, 가족과 함께 여유로운 오후를 보냈습니다.</p>
                <span>기록에 없는 세부 시각은 실제 흐름에 맞춰 표현했습니다.</span>
              </>
            ) : (
              <>
                <strong>출발 전 마지막 확인</strong>
                <p>날씨, 궁궐 운영 공지와 실시간 교통을 다시 확인하세요.</p>
                <span>식당과 일부 이동 시간은 현장 상황에 따라 조정할 수 있습니다.</span>
              </>
            )}
          </footer>
        </div>
      </aside>
    </main>
  );
}
