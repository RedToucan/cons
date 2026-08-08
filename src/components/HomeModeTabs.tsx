import Link from "next/link";

type HomeModeTabsProps = {
  active: "featured" | "guide" | "archive";
  postCount: number;
};

type HomeModeTab = {
  key: HomeModeTabsProps["active"];
  href: string;
  label: string;
};

export default function HomeModeTabs({ active, postCount }: HomeModeTabsProps) {
  const tabs: HomeModeTab[] = [
    { key: "featured", href: "/", label: "추천 사색" },
    { key: "guide", href: "/guides/conservative-progressive", label: "읽기 가이드" },
    { key: "archive", href: "/archive", label: `전체 사색 아카이브 (${postCount}편)` },
  ];

  return (
    <nav className="archive-mode-tabs" aria-label="글 탐색 방식">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`nav-link-tab ${active === tab.key ? "active" : ""}`}
          aria-current={active === tab.key ? "page" : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
