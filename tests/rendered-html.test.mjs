import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the trip planner shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(html, /서울 역사 가족여행/);
  assert.match(html, /8\.12/);
  assert.match(html, /서울식물원/);
  assert.match(html, /오봉집/);
  assert.match(html, /8\.13/);
  assert.match(html, /8\.14/);
  assert.doesNotMatch(html, /codex-preview|Building your site/);
});

test("keeps all three days in source and removes the starter preview", async () => {
  const [page, layout, packageJson, tripData, planner] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/trip-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/JourneyPlanner.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /JourneyPlanner/);
  assert.match(layout, /<html lang="ko">/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(tripData, /창덕궁·후원/);
  assert.match(tripData, /허준박물관/);
  assert.match(tripData, /time: "14:00경"/);
  assert.match(tripData, /지하 4층 주차/);
  assert.match(tripData, /낙지볶음 2인분/);
  assert.match(tripData, /딸과 호텔 수영장/);
  assert.match(tripData, /얼음이 모두 떨어져 커피는 마시지 못했습니다/);
  assert.match(tripData, /공항철도 → 홍대입구 환승 → 안국·창덕궁/);
  assert.match(tripData, /time: "점심 무렵–15:20경"/);
  assert.match(tripData, /창덕궁 해설 관람 · 약 1시간/);
  assert.match(tripData, /time: "16:00–17:00경"/);
  assert.doesNotMatch(tripData, /경복궁/);
  assert.match(tripData, /서대문형무소역사관/);
  assert.match(tripData, /전쟁기념관/);
  assert.match(tripData, /time: "20:00"/);
  assert.doesNotMatch(planner, /^(<<<<<<<|=======|>>>>>>>)/m);
  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});
