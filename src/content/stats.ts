export interface StatItem {
  label: string;
  value: string;
  note?: string;
}

export const statsData: StatItem[] = [
  {
    value: "~100",
    label: "LeetCode problems solved",
    note: "updated manually",
  },
  {
    value: "1,200",
    label: "books printed and sold",
  },
  {
    value: "₹1.6 lakh",
    label: "crowdfunded",
  },
  {
    value: "500+",
    label: "students at Bhavnagar Maths Competition",
  },
  {
    value: "4",
    label: "editions of the competition",
  },
  {
    value: "4",
    label: "pathfinding algorithms visualised",
  },
];

export const wantedBountyData = {
  wantedFor: "DHAIRYA BHATT",
  alias: '"THE QUANT CADET"',
  crime: "SOLVING RECURRENCES IN REAL TIME & OPTIMIZING BFS SEARCH SPACE",
  bounty: "500,000,000 BERRIES",
  issuedBy: "NERV / MARINE HEADQUARTERS",
  status: "ACTIVE EXPLORER & BUILDER",
};

