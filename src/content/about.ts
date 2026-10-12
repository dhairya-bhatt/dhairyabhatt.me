export interface LeadershipItem {
  id: string;
  role: string;
  organisation: string;
  description: string;
  dates?: string | null;
}

export interface EducationInfo {
  institution: string;
  degree: string;
  year: string;
  board?: string | null;
}

export interface SocietyItem {
  name: string;
  role?: string;
  detail?: string;
}

export interface AboutContent {
  bio: {
    lead: string;
    body: string[];
  };
  shortBio: string;
  metaDescription: string;
  cvUrl?: string | null;
  educations: EducationInfo[];
  volunteeringAndExperience: LeadershipItem[];
  societies: SocietyItem[];
}

export const aboutContent: AboutContent = {
  bio: {
    lead: "I'm a second-year Mathematics and Computer Science student at Queen's University Belfast. I build software and care about getting the fundamentals right: correct algorithms, clean structure, and code I can explain line by line. Recent projects include a campus GeoGuessr game with an Elo-based rating system and a pathfinding visualiser comparing BFS, Dijkstra and A*.",
    body: [
      "I'm Secretary of the Geography Society, where I organise events, raise funding and maintain The Graticule, the society's student-led journal site. I've also been a course representative, a peer mentor in applied mathematics, and for four years the organiser of a school maths competition. I'm looking for a summer 2027 placement in quantitative trading or software engineering.",
    ],
  },
  shortBio:
    "Second-year Mathematics and Computer Science student at Queen's, Belfast. I write software and solve algorithm problems most days. I also run things: Geography Society Secretary, course rep, peer maths mentor, and organiser of a four-year school maths competition. Applying for 2027 placements.",
  metaDescription:
    "Second-year Mathematics and Computer Science student at Queen's, Belfast. Applying for 2027 placements in quantitative trading and software engineering.",
  cvUrl: "/cv.pdf",
  educations: [
    {
      institution: "Queen's University Belfast",
      degree: "BSc Mathematics and Computer Science",
      year: "2nd year",
    },
    {
      institution: "Silver Bells Public School",
      degree: "Higher Secondary School",
      year: "2025 graduate",
      board: "CBSE Board",
    },
  ],
  volunteeringAndExperience: [
    {
      id: "geog-soc",
      role: "Secretary",
      organisation: "Geography Society",
      description:
        "Organised events, raised funding, rebuilt The Graticule (the society's student-led journal site).",
      dates: null,
    },
    {
      id: "svc",
      role: "Course Representative",
      organisation: "SVC",
      description:
        "Communicated between students and teaching staff/management and organised cohort events.",
      dates: null,
    },
    {
      id: "peer-mentor",
      role: "Peer Mentor",
      organisation: "Applied Mathematics (school)",
      description: "Supported students in applied mathematics.",
      dates: null,
    },
  ],
  societies: [
    {
      name: "Geography Society",
      role: "Secretary",
      detail: "Organising events, funding, and leading 'The Graticule' journal platform.",
    },
    {
      name: "Computer Science Society",
      role: "Member",
      detail: "Hackathons, tech talks, and collaborative development workshops.",
    },
    {
      name: "Mathematics Society",
      role: "Member",
      detail: "Problem-solving colloquiums and quantitative discussions.",
    },
  ],
};
