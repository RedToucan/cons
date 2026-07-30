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

# 블로그 이미지 작업 속도 원칙

커버 이미지 생성은 품질과 함께 작업 속도를 우선한다.

1. 글의 핵심 논지를 빠르게 파악하고 별도 확인 질문 없이 진행한다.
2. 기존 블로그 이미지 스타일 가이드와 16:9 구도를 기본값으로 적용한다.
3. 원칙적으로 시안은 한 번만 생성한다.
4. 인물 수, 문자, 시대 배경 등 명백한 오류가 있을 때만 한 번 수정한다.
5. 최종 이미지는 1200×675 WebP, 품질 84 전후로 경량화한다.
6. 이미지 기본 파일명은 글의 slug 및 MDX 파일명과 일치시킨다.
7. 새 이미지 연결을 확인한 뒤 기존 이미지는 삭제한다.
8. 파일 크기, 경로, 페이지 노출을 한 번에 검증한다.
9. 진행 계획과 중간 설명은 최소화하고 결과를 우선한다.
10. 사용자가 블로그 글의 커버를 요청하면 별도 지시가 없어도 위 절차를 적용한다.
