export type ReadingGuideChapter = {
  id: string;
  number: string;
  title: string;
  description: string;
  slugs: string[];
};

export const conservativeProgressiveGuide = {
  slug: "conservative-progressive",
  kicker: "읽기 가이드 01",
  title: "보수와 진보는 무엇이 다른가",
  description:
    "관찰된 차이에서 출발해 그 차이가 생겨난 배경을 살펴보고, 가족·복지·도덕·관계의 실제 쟁점에서 두 관점이 어떻게 갈라지는지 차례로 읽습니다.",
  chapters: [
    {
      id: "differences",
      number: "1부",
      title: "무엇이 다른가",
      description:
        "보수와 진보는 정말 다른가, 만약에 다르면 무엇이 다른가에 대한 연구 결과들.",
      slugs: [
        "jonathan-haidt-moral-foundations",
        "how-differently-do-conservatives-and-progressives-see-the-world",
        "conservatives-vs-liberals-views-on-infidelity",
        "conservative-vs-progressive-views-on-marriage",
        "do-conservatives-and-liberals-think-or-feel-differently",
        "do-conservatives-really-see-the-world-as-more-dangerous",
        "long-term-orientation-and-ethical-values",
      ],
    },
    {
      id: "origins",
      number: "2부",
      title: "보수주의자들이 진보주의자와 다르게 판단하는 이유",
      description:
        "위험을 감지하고 감정을 조절하며 질서에 적응하는 인간의 오래된 능력이 정치적 성향과 어떻게 이어지는지, 가설과 연구의 한계까지 함께 살펴봅니다.",
      slugs: [
        "how-do-those-who-see-danger-first-actually-behave",
        "evolution-of-emotion-regulation",
        "wolf-to-dog-domestication-and-conservatism",
        "were-conservatives-timid-as-children",
        "why-conservatives-fear-change-and-prefer-stability-over-reform",
      ],
    },
    {
      id: "issues",
      number: "3부",
      title: "어디에서 충돌하는가",
      description:
        "추상적인 성향의 차이가 결혼, 복지, 기부, 마약 정책과 인간관계 같은 구체적인 판단에서 어떤 의견 차이로 나타나는지 비교합니다.",
      slugs: [
        "conservative-vs-progressive-views-on-marriage",
        "universal-vs-selective-welfare-the-definition-of-fairness",
        "are-conservatives-more-charitable-than-liberals",
        "why-are-liberals-more-tolerant-of-drugs",
        "does-politics-overrule-friendship",
      ],
    },
  ] satisfies ReadingGuideChapter[],
};
