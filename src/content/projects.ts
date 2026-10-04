export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: "Full Stack" | "Algorithms" | "Quantitative" | "Systems";
  stack: string[];
  status: "Live" | "In Progress" | "Archived";
  metrics?: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  accentColor?: string;
  previewImage?: string;
}

export const projectsData: Project[] = [
  {
    slug: "qub-geoguessr",
    title: "QUB GeoGuessr",
    tagline: "Campus geography exploration game with custom Leaflet coordinates & Elo rating",
    description: "A fast-paced, competitive GeoGuessr-inspired game tailored for the Queen's University Belfast campus. Features proprietary high-resolution campus photography, custom Leaflet interactive mapping with distance-based exponential decay scoring, Elo-style player rating, and institutional email verification for campus leaderboards.",
    category: "Full Stack",
    stack: ["Next.js", "TypeScript", "Leaflet.js", "PostgreSQL", "Tailwind CSS", "Prisma"],
    status: "In Progress",
    metrics: ["Sub-50ms map response", "Elo matchmaking engine", "100+ Campus Waypoints"],
    githubUrl: "https://github.com/dhairyabhatt/qub-geoguessr",
    liveUrl: "https://geoguessr.dhairyabhatt.me",
    featured: true,
    accentColor: "#FF4632",
    previewImage: "/photos/pictures (1).jpeg",
  },
  {
    slug: "pathfinding-visualizer",
    title: "Pathfinding Visualizer",
    tagline: "Interactive 2D graph traversal engine supporting BFS, DFS, Dijkstra & A*",
    description: "Real-time interactive pathfinding and graph exploration tool built to visualize traversal heuristics, state expansions, and weighted cost evaluations. Includes recursive division maze generation, dynamic obstacle weight painting, adjustable animation tick speed, and live benchmark metrics comparing nodes visited vs. optimal path length.",
    category: "Algorithms",
    stack: ["TypeScript", "React", "Canvas API", "Data Structures", "Tailwind CSS"],
    status: "Live",
    metrics: ["4 Search Heuristics", "60 FPS Canvas Render", "Maze Generation"],
    githubUrl: "https://github.com/dhairyabhatt/pathfinding-visualizer",
    liveUrl: "https://pathfinding.dhairyabhatt.me",
    featured: true,
    accentColor: "#3B82F6",
    previewImage: "/photos/pictures (3).jpeg",
  },
  {
    slug: "limit-order-book-simulator",
    title: "LOB Simulator & Matching Engine",
    tagline: "High-throughput in-memory order book simulation with price-time priority",
    description: "Deterministic in-memory limit order book matching engine modeling continuous double auctions. Implements price-time priority queues using B-Trees and doubly-linked order buckets, real-time depth-of-book telemetry, order cancellation handling, and synthetic geometric Brownian motion market makers.",
    category: "Quantitative",
    stack: ["TypeScript", "C++ / WebAssembly", "WebSockets", "Chart.js"],
    status: "In Progress",
    metrics: ["Price-Time Priority (FIFO)", "Level 2 Market Depth", "Microsecond latencies"],
    githubUrl: "https://github.com/dhairyabhatt/lob-matching-engine",
    liveUrl: undefined,
    featured: true,
    accentColor: "#10B981",
    previewImage: "/photos/pictures (6).jpeg",
  },
  {
    slug: "discrete-event-cache-simulator",
    title: "Memory Hierarchy & Cache Simulator",
    tagline: "Trace-driven cache simulation comparing LRU, LFU & FIFO eviction policies",
    description: "Hardware-level cache hierarchy modeling tool testing hit/miss ratios across diverse L1/L2 associative architectures (Direct, N-Way Set Associative, Fully Associative). Parses Valgrind memory trace files to visualize memory bottlenecks and penalty cycles.",
    category: "Systems",
    stack: ["Python", "TypeScript", "D3.js", "Web Workers"],
    status: "In Progress",
    metrics: ["L1 / L2 Hierarchy", "Memory Trace Analysis", "Hit/Miss Profiling"],
    githubUrl: "https://github.com/dhairyabhatt/cache-sim",
    liveUrl: undefined,
    featured: false,
    accentColor: "#F59E0B",
    previewImage: "/photos/pictures (8).jpeg",
  },
];
