import type { Metadata } from "next";
import { JourneyPlanner } from "./JourneyPlanner";

export const metadata: Metadata = {
  title: "서울 역사 가족여행 | 2박 3일 일정 지도",
  description:
    "2026년 8월 12일부터 14일까지, 서울의 궁궐과 박물관을 잇는 가족 역사여행 일정 지도입니다.",
};

export default function Home() {
  return <JourneyPlanner />;
}
