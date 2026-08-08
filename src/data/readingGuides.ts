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
    "관찰된 차이에서 출발해 그 차이가 생겨난 배경을 살펴보고, 보수주의자를 둘러싼 오해를 검토한 뒤 실제 쟁점에서 두 관점이 어떻게 갈라지는지 차례로 읽습니다.",
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
        "do-conservatives-and-liberals-think-or-feel-differently",
        "long-term-orientation-and-ethical-values",
        "conservative-vs-progressive-views-on-marriage",
        "conservatives-vs-liberals-views-on-infidelity",
        "do-conservatives-have-more-children",
      ],
    },
    {
      id: "origins",
      number: "2부",
      title: "보수주의자들이 진보주의자와 다르게 판단하는 이유",
      description:
        "위험을 감지하고 감정을 조절하며 질서에 적응하는 인간의 오래된 능력이 정치적 성향과 어떻게 이어지는지, 가설과 연구의 한계까지 함께 살펴봅니다.",
      slugs: [
        "popper-kuhn-reality-and-models",
        "how-do-those-who-see-danger-first-actually-behave",
        "do-conservatives-really-see-the-world-as-more-dangerous",
        "neuroscience-of-fear-and-conservatism",
        "evolution-of-emotion-regulation",
        "wolf-to-dog-domestication-and-conservatism",
        "why-conservatives-fear-change-and-prefer-stability-over-reform",
        "david-hume-on-miracles",
        "empiricism-as-life-attitude",
        "newton-hume-and-empiricism",
        "origin-of-dogmatism",
      ],
    },
    {
      id: "misconceptions",
      number: "3부",
      title: "보수주의자에 대한 오해",
      description:
        "보수주의자는 겁이 많고, 멍청하며, 권위주의적이고, 이기적이라는 통념이 실제 연구와 보수주의의 철학에 비추어 얼마나 타당한지 검토합니다.",
      slugs: [
        "dogmatism-and-beliefs",
        "liberal-quotes-on-conservatism",
        "liberal-elitism-quotes-sources",
        "how-liberals-see-conservatives",
        "how-liberals-understand-conservatives",
        "were-conservatives-timid-as-children",
        "are-conservatives-really-stupid",
        "why-liberals-misunderstand-conservatism-as-authoritarianism",
        "is-conservatism-a-philosophy-to-justify-selfishness",
        "misunderstanding-winner-take-all",
        "strict-father-did-lakoff-understand-conservatism",
      ],
    },
    {
      id: "issues",
      number: "4부",
      title: "보수와 진보의 의견 차이",
      description:
        "결혼과 외도, 복지, 기부, 마약 정책, 인간관계 같은 구체적인 쟁점에서 보수와 진보의 판단이 어떻게 갈라지는지 비교합니다.",
      slugs: [
      
        "universal-vs-selective-welfare-the-definition-of-fairness",
        "are-conservatives-more-charitable-than-liberals",
        "why-are-liberals-more-tolerant-of-drugs",
        "does-politics-overrule-friendship",
      ],
    },
  ] satisfies ReadingGuideChapter[],
};
