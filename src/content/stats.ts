export interface FunStat {
  label: string;
  value: string | number;
  suffix?: string;
  subtext?: string;
  icon?: string;
}

export const funStats: FunStat[] = [
  {
    label: "LeetCode Solved",
    value: 280,
    suffix: "+",
    subtext: "Medium / Hard Algorithmic Problems",
    icon: "code",
  },
  {
    label: "GitHub Commits",
    value: "850",
    suffix: "+",
    subtext: "Pushes, PRs & Contributions in past year",
    icon: "git-commit",
  },
  {
    label: "Placement Target",
    value: "Summer 2027",
    subtext: "Quant Trading & High-Bar Software Engineering",
    icon: "target",
  },
  {
    label: "Cups of Coffee & Tea",
    value: "640",
    suffix: "+",
    subtext: "Fueled by Belfast roasts & late-night proofs",
    icon: "coffee",
  },
  {
    label: "Campus Walk Count",
    value: "14",
    suffix: "k+",
    subtext: "Steps clocked daily around QUB & Botanic",
    icon: "footprints",
  },
  {
    label: "Optimal Pathfinding Latency",
    value: "< 16",
    suffix: "ms",
    subtext: "Smooth 60 FPS A* state expansion",
    icon: "zap",
  },
];

export const wantedBountyData = {
  wantedFor: "DHAIRYA BHATT",
  alias: "\"THE QUANT CADET\"",
  crime: "SOLVING RECURRENCES IN REAL TIME & OPTIMIZING BFS SEARCH SPACE",
  bounty: "SUMMER 2027 INTERNSHIP OFFER",
  issuedBy: "NERV / MARINE HEADQUARTERS",
  status: "ACTIVE & SEEKING OPPORTUNITIES",
};
