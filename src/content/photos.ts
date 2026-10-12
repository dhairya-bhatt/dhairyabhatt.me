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
  caption?: string;
  location?: string;
  effect: PhotoEffect;
  rotation: number; // degrees
  scale?: number;
  width?: number;
  height?: number;
  featured?: boolean;
}

export const portraitPhoto = {
  src: "/photos/portrait-black.png",
  hoverSrc: "/photos/portrait-hover.png",
  alt: "Dhairya Bhatt",
  caption: "",
};

export const photosData: GalleryPhoto[] = [
  {
    id: "photo-1",
    src: "/photos/pictures (1).png",
    alt: "Snapshot 1",
    effect: "grayscale-color",
    rotation: -3,
  },
  {
    id: "photo-2",
    src: "/photos/pictures (2).png",
    alt: "Snapshot 2",
    effect: "frosted-glass",
    rotation: 4,
  },
  {
    id: "photo-3",
    src: "/photos/pictures (3).png",
    alt: "Snapshot 3",
    effect: "magnetic",
    rotation: -2,
  },
  {
    id: "photo-4",
    src: "/photos/pictures (4).png",
    alt: "Snapshot 4",
    effect: "tilt-3d",
    rotation: 2,
  },
  {
    id: "photo-5",
    src: "/photos/pictures (5).png",
    alt: "Snapshot 5",
    effect: "lift-reset",
    rotation: -5,
  },
  {
    id: "photo-6",
    src: "/photos/pictures (6).png",
    alt: "Snapshot 6",
    effect: "rgb-glitch",
    rotation: 3,
  },
  {
    id: "photo-7",
    src: "/photos/pictures (7).png",
    alt: "Snapshot 7",
    effect: "polaroid-flip",
    rotation: -4,
  },
  {
    id: "photo-8",
    src: "/photos/pictures (8).png",
    alt: "Snapshot 8",
    effect: "duotone",
    rotation: 5,
  },
  {
    id: "photo-9",
    src: "/photos/pictures (9).png",
    alt: "Snapshot 9",
    effect: "tilt-3d",
    rotation: -2,
  },
  {
    id: "photo-10",
    src: "/photos/pictures (10).png",
    alt: "Snapshot 10",
    effect: "frosted-glass",
    rotation: 3,
  },
  {
    id: "photo-11",
    src: "/photos/pictures (11).png",
    alt: "Snapshot 11",
    effect: "grayscale-color",
    rotation: -6,
  },
];

