import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "아르고스의 노트 | 심리학과 경험주의로 읽는 세상",
    short_name: "아르고스",
    description: "심리학과 경험주의로 읽는 세상을 나누는 조용한 사색의 공간. 철학, 심리학, 역사, 정치, 문화를 다룹니다.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf9f3",
    theme_color: "#fbf9f3",
    icons: [
      {
        src: "/icon/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
