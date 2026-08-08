export type CategoryDefinition = {
  slug: string;
  value: string;
  label: string;
  description: string;
};

export const categoryDefinitions: CategoryDefinition[] = [
  {
    slug: "philosophy",
    value: "Philosophy",
    label: "철학",
    description: "경험주의와 합리주의, 보수주의와 진보주의, 인간과 사회를 바라보는 사상적 전제를 탐구합니다.",
  },
  {
    slug: "humanism",
    value: "Humanism",
    label: "인본주의",
    description: "추상적인 이념보다 불완전한 인간과 구체적인 삶을 먼저 바라보는 사색을 모았습니다.",
  },
  {
    slug: "psychology",
    value: "Psychology",
    label: "심리학",
    description: "감정, 도덕 판단, 정치 성향, 편향과 재현성 문제를 경험적 연구와 함께 살펴봅니다.",
  },
  {
    slug: "politics",
    value: "Politics",
    label: "정치",
    description: "정당과 권력, 제도와 이념이 현실에서 어떻게 작동하는지 역사적 사례와 자료로 분석합니다.",
  },
  {
    slug: "culture",
    value: "Culture",
    label: "문학·문화",
    description: "문학, 영화와 대중문화를 통해 인간의 선택과 현대 사회의 도덕적 갈등을 읽습니다.",
  },
  {
    slug: "lifestyle",
    value: "Lifestyle",
    label: "삶과 생활",
    description: "결혼과 가족, 기부와 행복처럼 정치적 가치가 일상의 선택과 만나는 지점을 살펴봅니다.",
  },
  {
    slug: "influencer",
    value: "Influencer",
    label: "인물 비평",
    description: "정치인과 지식인, 문화적 영향력을 가진 인물의 주장과 실제 행적을 함께 검토합니다.",
  },
  {
    slug: "freedom",
    value: "Freedom",
    label: "자유",
    description: "표현과 결제, 사생활과 기술의 변화 속에서 개인의 자유가 어떻게 지켜지고 제한되는지 다룹니다.",
  },
  {
    slug: "corruption",
    value: "Corruption",
    label: "부패와 책임",
    description: "제도와 금융, 권력의 틈에서 책임이 사라지고 부패가 구조화되는 과정을 추적합니다.",
  },
  {
    slug: "climate",
    value: "Climate",
    label: "기후와 환경",
    description: "기후·환경 정책의 명분과 실제 효과, 농업과 에너지의 현실적 갈등을 검토합니다.",
  },
];

export function getCategoryBySlug(slug: string) {
  return categoryDefinitions.find((category) => category.slug === slug.toLowerCase());
}

export function getCategoryByValue(value: string) {
  return categoryDefinitions.find(
    (category) => category.value.toLowerCase() === value.toLowerCase(),
  );
}

export function getCategoryLabel(value: string) {
  return getCategoryByValue(value)?.label || value;
}

export function getCategoryHref(value: string) {
  const category = getCategoryByValue(value);
  return category ? `/categories/${category.slug}` : "/archive";
}
