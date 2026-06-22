<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 한국어 마크다운 볼드체(Bold) 규칙
한국어 마크다운 파서에서는 볼드체(`**본문**`) 바로 뒤에 조사(은/는/이/가/을/를/에 등)가 공백 없이 붙을 경우, 볼드 렌더링이 깨지는 문법 오류가 발생합니다. 

따라서 본문 내에서 볼드체를 사용할 때는 반드시 마크다운 기호 바깥을 큰따옴표로 감싸는 **`"**본문**"조사`** 형태로 작성해야 합니다.
* **잘못된 예:** `**도덕 매트릭스**는`, `**편도체**가`
* **올바른 예:** `"**도덕 매트릭스**"는`, `"**편도체**"가`

# 블로그 이미지 스타일 가이드라인 (Blog Image Style Guideline)
이 블로그("보수주의자의 정원")의 대표 이미지(커버 이미지) 및 본문 이미지를 생성할 때는 다음 스타일 가이드를 엄격히 준수해야 합니다.

1. Create a refined editorial-style cover image for a philosophy, psychology, or political essay. Use a warm ivory parchment background with soft watercolor texture, sepia ink illustration, muted blue-gray and ochre accents, and a calm intellectual mood. The composition should be clean and symbolic rather than busy. Show the core idea of the article through one central human figure or two contrasting figures, with subtle conceptual background elements that visually represent the topic. The image should feel thoughtful, elegant, and suitable for a serious blog cover. Avoid photorealism, avoid bright saturated colors, avoid modern commercial poster style. 16:9 wide composition, minimalist layout, no text.