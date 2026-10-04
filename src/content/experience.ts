export interface Education {
  institution: string;
  degree: string;
  field: string;
  location: string;
  period: string;
  details: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  period: string;
  type: "Internship" | "Part-time" | "Fellowship" | "Leadership" | "Research";
  bullets: string[];
  techStack?: string[];
  isPlaceholder?: boolean;
}

export const educationData: Education[] = [
  {
    institution: "Queen's University Belfast",
    degree: "BSc (Hons)",
    field: "Mathematics and Computer Science",
    location: "Belfast, United Kingdom",
    period: "2024 — Present (Expected 2028 / Placement Year 2026-2027)",
    details: [
      "Second-year undergraduate studying joint honours in Mathematics and Computer Science.",
      "Core Coursework: Discrete Mathematics, Linear Algebra, Real Analysis, Data Structures & Algorithms, Object-Oriented Programming, Probability & Statistics.",
      "Active participant in computing societies, competitive programming, and algorithm workshops.",
    ],
  },
];

// NOTE: Fill in the placeholders below with details from your LinkedIn:
// https://www.linkedin.com/in/dhairya-bhatt/
export const experienceData: ExperienceItem[] = [
  {
    company: "TODO: [Company / Organization Name]",
    role: "TODO: [Software Engineering Intern / Research Assistant / Teaching Assistant]",
    location: "TODO: [City, Country / Remote]",
    period: "TODO: [e.g. Jun 2025 — Aug 2025]",
    type: "Internship",
    bullets: [
      "TODO: [Add key accomplishment, impact metric, or project deliverable]",
      "TODO: [Add technical challenge solved and tools utilized]",
    ],
    techStack: ["TODO: [e.g. Python, TypeScript, SQL]"],
    isPlaceholder: true,
  },
  {
    company: "TODO: [Previous Company / Student Leadership Role]",
    role: "TODO: [Role Title]",
    location: "TODO: [Location]",
    period: "TODO: [Dates]",
    type: "Leadership",
    bullets: [
      "TODO: [Add leadership initiative or student society responsibility]",
    ],
    techStack: ["TODO: [Tools]"],
    isPlaceholder: true,
  },
];

export const skillsData = {
  languages: ["TypeScript", "JavaScript", "Python", "C / C++", "Java", "SQL", "HTML / CSS"],
  frameworks: ["Next.js", "React", "Node.js", "Tailwind CSS", "Express", "Prisma"],
  mathematics: ["Linear Algebra", "Calculus & Analysis", "Discrete Mathematics", "Probability Theory", "Graph Theory"],
  tools: ["Git & GitHub", "Linux / Bash", "Docker", "PostgreSQL", "VS Code", "Vercel"],
};
