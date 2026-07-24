import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자유게시판 | 아르고스의 노트",
  alternates: {
    canonical: "/board",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
