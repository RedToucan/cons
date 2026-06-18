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
이 블로그("보수주의자의 정원")의 대표 이미지(썸네일) 및 본문 이미지를 생성할 때는 다음 스타일 가이드를 엄격히 준수해야 합니다.

1. **흑백 미니멀 펜화 스타일 (B&W Minimal Line Art & Ink Sketch)**
   - 바탕은 반드시 순백색(pure white background)으로 하며, 너무 어두운 배경이나 무거운 해칭(cross-hatching)은 배제합니다.
   - 얇고 정밀한 검은색 잉크 선(fine, elegant black lines) 위주의 가볍고 깔끔한 드로잉 스타일을 유지합니다.

2. **사실적 묘사와 감성적 은유의 결합 (Realistic Anatomy & Subtle Metaphor)**
   - 뇌(brain)나 생물학적 대상물은 왜곡(기괴하게 일그러지는 나무뿌리 등) 없이 해부학적으로 사실적이고 정교하게 묘사합니다.
   - 대상물 위에 작고 섬세한 자연물(새싹, 꽃봉오리 등)이 가볍게 자라나거나 곁들여지도록 하여 지적이고 서정적인 은유를 결합합니다.

