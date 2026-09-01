import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Playfair_Display, Lora, Inter } from "next/font/google";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--next-font-serif",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--next-font-serif-body",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--next-font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    (process.env.NEXT_PUBLIC_SITE_URL || "https://argosnotes.com").replace(/\/+$/, "")
  ),
  title: "아르고스의 노트 | 심리학과 경험주의로 읽는 세상",
  description: "심리학과 경험주의로 읽는 세상을 나누는 조용한 사색의 공간. 철학, 심리학, 역사, 정치, 문화를 다룹니다.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon/brand-mark.svg", type: "image/svg+xml" },
      { url: "/icon/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: {
      url: "/icon/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
  openGraph: {
    title: "아르고스의 노트 | 심리학과 경험주의로 읽는 세상",
    description: "심리학과 경험주의로 읽는 세상을 나누는 조용한 사색의 공간. 철학, 심리학, 역사, 정치, 문화를 다룹니다.",
    url: "/",
    siteName: "아르고스의 노트",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "아르고스의 노트 | 심리학과 경험주의로 읽는 세상",
    description: "심리학과 경험주의로 읽는 세상을 나누는 조용한 사색의 공간. 철학, 심리학, 역사, 정치, 문화를 다룹니다.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf9f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1210" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${playfair.variable} ${lora.variable} ${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* RSS autodiscovery — kept here (not in metadata) because every page overrides `alternates`. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="아르고스의 노트"
          href="/feed.xml"
        />
        <header className="site-header">
          <div className="container">
            <div className="logo-area">
              <Link href="/">
                <p className="logo-title">아르고스의 노트</p>
              </Link>
              <p className="logo-sub">심리학과 경험주의로 읽는 세상</p>
              <SearchInput />
            </div>
            <hr className="editorial-hr" />
            <nav className="site-nav">
              <Link href="/" className="nav-link">홈</Link>
              <Link href="/categories/philosophy" className="nav-link">철학</Link>
              <Link href="/categories/humanism" className="nav-link">인본주의</Link>
              <Link href="/categories/psychology" className="nav-link">심리학</Link>
              <Link href="/categories/politics" className="nav-link">정치</Link>
              <Link href="/categories/culture" className="nav-link">문화</Link>
              <Link href="/categories/lifestyle" className="nav-link">생활</Link>
              <Link href="/categories/influencer" className="nav-link">인물 비평</Link>
              <Link href="/board" className="nav-link">자유게시판</Link>
              <Link href="/about" className="nav-link">블로그 소개</Link>
            </nav>
            <hr className="editorial-hr" style={{ marginTop: '0.75rem', marginBottom: '0' }} />
          </div>
        </header>

        <main className="main-content">
          <div className="container">
            {children}
          </div>
        </main>

        <footer className="site-footer">
          <div className="container">
            <nav className="footer-nav">
              <Link href="/">홈</Link>
              <Link href="/guides/conservative-progressive">읽기 가이드</Link>
              <Link href="/archive">전체 아카이브</Link>
              <Link href="/board">자유게시판</Link>
              <Link href="/about">블로그 소개</Link>
              <a href="/feed.xml">RSS</a>
            </nav>
            <p className="copyright">
              © {new Date().getFullYear()} 아르고스의 노트. All rights reserved.
            </p>
            <p className="footer-motto" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
              “심리학과 경험주의로 읽는 세상.”
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
