export type ProjectStatus = "Live" | "In progress" | "Ongoing" | "Completed" | "Published";
export type ProjectGroup = "Code" | "Beyond the code";

export interface Project {
  slug: string;
  title: string;
  headingFallback?: string;
  summary: string;
  group: ProjectGroup;
  stack: string[];
  role?: string;
  status: ProjectStatus;
  stats?: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  linkLabel?: string;
  featured: boolean;
  featuredOrder?: number;
  previewImage?: string;
  label?: string; // e.g. "Beyond the code" badge
}

export const projectsData: Project[] = [
  // 1. The Graticule (Featured 1)
  {
    slug: "the-graticule",
    title: "The Graticule",
    summary:
      "Student-led geography journal, rebuilt from a Wix site into a custom site with a JSON database and an admin panel so editors can publish without touching code.",
    group: "Code",
    stack: ["TypeScript", "HTML", "CSS", "JSON"],
    role: "Sole developer, Geography Society",
    status: "Live",
    stats: undefined,
    liveUrl: null,
    repoUrl: null,
    featured: true,
    featuredOrder: 1,
    previewImage: "/projects/the-graticule.gif",
  },

  // 2. QUB GeoGuessr (Featured 2)
  {
    slug: "qub-geoguessr",
    title: "QUB GeoGuessr",
    summary:
      "GeoGuessr-style game set on the QUB campus, using my own photographs and a custom Leaflet map. Distance-based scoring, an Elo-style rating system, and sign-up restricted to @qub.ac.uk emails.",
    group: "Code",
    stack: ["Node.js", "Express", "Supabase", "PostgreSQL", "Leaflet"],
    role: "Solo project",
    status: "In progress",
    stats: ["~30 campus photos", "Elo rating system"],
    liveUrl: "https://geoguessr.dhairyabhatt.me",
    repoUrl: null,
    featured: true,
    featuredOrder: 2,
    previewImage: "/projects/qub-geogussr.gif",
  },

  // 3. Book (Featured 3, labeled "Beyond the code")
  {
    slug: "my-book",
    title: "My book",
    headingFallback: "My book",
    summary:
      "Wrote a book at 13. Raised ₹1.6 lakh through crowdfunding to publish and print 1,200 copies, then sold them and donated the proceeds to local school funding, in instalments as copies sold. Also available as an ebook on Google Play Books.",
    group: "Beyond the code",
    label: "Beyond the code",
    stack: [],
    role: "Author and campaign organiser",
    status: "Published",
    stats: ["₹1.6 lakh raised", "1,200 copies printed and sold", "Proceeds to local school funding"],
    liveUrl: "https://play.google.com/store/books/details?id=xlosEAAAQBAJ",
    repoUrl: null,
    linkLabel: "Read on Google Play Books",
    featured: true,
    featuredOrder: 3,
    previewImage: "/projects/all-about-maths-book.gif",
  },

  // 4. Pathfinding Visualizer (Code group)
  {
    slug: "pathfinding-visualizer",
    title: "Pathfinding Visualizer",
    summary:
      "Animated BFS, DFS, Dijkstra and A* (Manhattan heuristic) on an interactive grid, with maze generation, speed control and live per-algorithm stats. Algorithms are pure, unit-tested functions.",
    group: "Code",
    stack: ["JavaScript", "React"],
    role: "Developer",
    status: "Live",
    stats: ["4 algorithms", "Unit-tested core"],
    liveUrl: "https://pathfinding.dhairyabhatt.me",
    repoUrl: null,
    featured: false,
    previewImage: "/projects/pathfinding-visualizer.png",
  },

  // 5. DSA in C++ (Code group)
  {
    slug: "dsa-in-cpp",
    title: "DSA in C++",
    summary:
      "Public log of data structures and algorithms practice following NeetCode 150 and Striver's A2Z.",
    group: "Code",
    stack: ["C++"],
    role: "Student",
    status: "Ongoing",
    stats: ["~100 LeetCode problems solved"],
    liveUrl: null,
    repoUrl: null,
    featured: false,
    previewImage: "/photos/pictures (4).png",
  },

  // 6. This Portfolio (Code group)
  {
    slug: "this-portfolio",
    title: "This Portfolio",
    summary:
      "Interactive personal site with a live Spotify widget, a grain-to-clear name effect and a pokéball menu.",
    group: "Code",
    stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    role: "Sole developer",
    status: "Live",
    stats: undefined,
    liveUrl: "https://dhairyabhatt.me",
    repoUrl: null,
    featured: false,
    previewImage: "/photos/pictures (5).png",
  },

  // 7. Bhavnagar Maths Competition (Beyond the code group)
  {
    slug: "bhavnagar-maths-competition",
    title: "Bhavnagar Maths Competition",
    summary:
      "Annual maths competition for classes 3-10, organised over four consecutive years. I wrote the question papers, built the registration forms and marked the scripts, working with volunteer teachers who handled management and logistics.",
    group: "Beyond the code",
    stack: [],
    role: "Organiser",
    status: "Completed",
    stats: ["4 editions", "Classes 3-10", "500+ students"],
    liveUrl: null,
    repoUrl: null,
    featured: false,
    previewImage: "/photos/pictures (8).png",
  },
];
