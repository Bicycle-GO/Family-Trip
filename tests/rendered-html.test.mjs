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
  assert.match(html, /대한민국역사박물관/);
  assert.match(html, /8\.13/);
  assert.match(html, /8\.14/);
  assert.doesNotMatch(html, /codex-preview|Building your site/);
});

test("keeps all three days in source and removes the starter preview", async () => {
  const [page, layout, packageJson, tripData] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/trip-data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /JourneyPlanner/);
  assert.match(layout, /<html lang="ko">/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(tripData, /창덕궁 후원/);
  assert.match(tripData, /허준박물관/);
  assert.match(tripData, /time: "07:00"/);
  assert.match(tripData, /time: "16:00–17:10"/);
  assert.match(tripData, /서대문형무소역사관/);
  assert.match(tripData, /time: "15:20–20:00"/);
  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});
