import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Playfair_Display, Lora, Inter } from "next/font/google";
import Link from "next/link";
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
  title: "argos's notes | 사색과 경험의 기록",
  description: "사색과 경험의 기록을 나누는 조용한 사색의 공간. 철학, 심리학, 역사, 정치, 문화를 다룹니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${playfair.variable} ${lora.variable} ${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <header className="site-header">
          <div className="container">
            <div className="logo-area">
              <Link href="/">
                <h1 className="logo-title">argos's notes</h1>
              </Link>
              <p className="logo-sub">사색과 경험의 기록</p>
            </div>
            <hr className="editorial-hr" />
            <nav className="site-nav">
              <Link href="/" className="nav-link">홈</Link>
              <Link href="/?category=Philosophy" className="nav-link">철학</Link>
              <Link href="/?category=Psychology" className="nav-link">심리학</Link>
              <Link href="/?category=Politics" className="nav-link">정치</Link>
              <Link href="/?category=Culture" className="nav-link">문화</Link>
              <Link href="/?category=Lifestyle" className="nav-link">생활</Link>
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
              <Link href="/about">블로그 소개</Link>
            </nav>
            <p className="copyright">
              © {new Date().getFullYear()} argos's notes. All rights reserved.
            </p>
            <p className="footer-motto" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
              “사색과 경험의 기록.”
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
