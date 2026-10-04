export type PhotoEffect = 
  | "grayscale-color"
  | "frosted-glass"
  | "magnetic"
  | "tilt-3d"
  | "lift-reset"
  | "rgb-glitch"
  | "polaroid-flip"
  | "duotone"
  | "glow-pulse";

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  location?: string;
  effect: PhotoEffect;
  rotation: number; // degrees
  scale?: number;
  width?: number;
  height?: number;
  featured?: boolean;
}

export const portraitPhoto = {
  src: "/photos/dhairya-portrait.jpg",
  alt: "Dhairya Bhatt portrait at Queen's University Belfast",
  caption: "Dhairya Bhatt · Belfast, 2025",
};

export const photosData: GalleryPhoto[] = [
  {
    id: "photo-1",
    src: "/photos/pictures (1).jpeg",
    alt: "Evening lights around Belfast architecture",
    caption: "Belfast City Hall at twilight — crisp architectural lines.",
    location: "Donegall Square, Belfast",
    effect: "grayscale-color",
    rotation: -3,
  },
  {
    id: "photo-2",
    src: "/photos/pictures (2).jpeg",
    alt: "Sunny day on the Queen's University lawn",
    caption: "Clear skies over the Quad before afternoon lectures.",
    location: "Queen's University Belfast",
    effect: "frosted-glass",
    rotation: 4,
  },
  {
    id: "photo-3",
    src: "/photos/pictures (3).jpeg",
    alt: "Autumn foliage and stone courtyard",
    caption: "Hidden quiet corners between the maths and CS buildings.",
    location: "Lanyon Courtyard",
    effect: "magnetic",
    rotation: -2,
  },
  {
    id: "photo-4",
    src: "/photos/pictures (4).jpeg",
    alt: "Ocean view and coastal ferry",
    caption: "Looking out toward the Irish Sea on a ferry crossing.",
    location: "Northern Ireland Coast",
    effect: "tilt-3d",
    rotation: 2,
  },
  {
    id: "photo-5",
    src: "/photos/pictures (5).jpeg",
    alt: "Tree branches silhouetted against deep dusk sky",
    caption: "Evening stroll after late lab session.",
    location: "Botanic Gardens, Belfast",
    effect: "lift-reset",
    rotation: -5,
  },
  {
    id: "photo-6",
    src: "/photos/pictures (6).jpeg",
    alt: "Residential street with glowing autumnal trees",
    caption: "Golden hour through the avenues of South Belfast.",
    location: "University Road",
    effect: "rgb-glitch",
    rotation: 3,
  },
  {
    id: "photo-7",
    src: "/photos/pictures (7).jpeg",
    alt: "Gothic tower rising into blue sky",
    caption: "Red brick and neo-Gothic towers against afternoon blue.",
    location: "Lanyon Building",
    effect: "polaroid-flip",
    rotation: -4,
  },
  {
    id: "photo-8",
    src: "/photos/pictures (8).jpeg",
    alt: "Street scene with classic architecture and red bus",
    caption: "Street life on a quiet weekend morning.",
    location: "Belfast Central",
    effect: "duotone",
    rotation: 5,
  },
  {
    id: "photo-9",
    src: "/photos/pictures (9).jpeg",
    alt: "Lush green tree canopy against clear skies",
    caption: "Summertime canopy in the gardens.",
    location: "Botanic Avenue",
    effect: "tilt-3d",
    rotation: -2,
  },
  {
    id: "photo-10",
    src: "/photos/pictures (10).jpeg",
    alt: "Red brick collegiate facade in sunset light",
    caption: "Warm evening light illuminating the brickwork.",
    location: "College Park",
    effect: "frosted-glass",
    rotation: 3,
  },
  {
    id: "photo-11",
    src: "/photos/pictures (11).jpeg",
    alt: "Intricate pagoda roof against twilight",
    caption: "Patterns, symmetry, and geometric structural details.",
    location: "Travel Journal",
    effect: "grayscale-color",
    rotation: -6,
  },
  {
    id: "photo-12",
    src: "/photos/pictures (12).jpeg",
    alt: "Aerial view of coastline and urban sprawl",
    caption: "Approaching Belfast Lough from above.",
    location: "Flight into Belfast City Airport",
    effect: "lift-reset",
    rotation: 2,
  },
  {
    id: "photo-13",
    src: "/photos/pictures (13).jpeg",
    alt: "Historic collegiate stone building with manicured lawn",
    caption: "Symmetrical heritage architecture under overcast skies.",
    location: "Belfast Heritage Quarter",
    effect: "polaroid-flip",
    rotation: -3,
  },
  {
    id: "photo-14",
    src: "/photos/pictures (14).jpeg",
    alt: "Tree branches framing Victorian facade",
    caption: "Spring blossoms on campus avenues.",
    location: "Malone Road",
    effect: "magnetic",
    rotation: 4,
  },
];
