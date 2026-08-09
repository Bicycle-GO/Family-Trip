import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "서울 역사 가족여행",
    template: "%s",
  },
  description:
    "2026년 여름, 서울의 궁궐과 박물관을 잇는 2박 3일 가족여행 일정 지도",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
