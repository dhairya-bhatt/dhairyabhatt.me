export interface SiteConfig {
  name: string;
  role: string;
  subRole: string;
  university: string;
  location: string;
  timezone: string;
  domain: string;
  url: string;
  bio: {
    lead: string;
    body: string[];
    focus: string[];
  };
  socials: {
    name: string;
    label: string;
    href: string;
    username: string;
    icon: string;
    isPrimary?: boolean;
  }[];
  cvUrl: string;
}

export const siteConfig: SiteConfig = {
  name: "Dhairya Bhatt",
  role: "Mathematics & Computer Science Undergrad",
  subRole: "Queen's University Belfast · Mathematics & Computer Science",
  university: "Queen's University Belfast",
  location: "Belfast, United Kingdom",
  timezone: "Europe/London",
  domain: "dhairyabhatt.me",
  url: "https://dhairyabhatt.me",
  bio: {
    lead: "Hi, I'm Dhairya Bhatt — a second-year Mathematics & Computer Science student at Queen's University Belfast.",
    body: [
      "I build software and care about getting the fundamentals right: correct algorithms, clean structure, and code I can explain line by line.",
      "Secretary of the Geography Society (organising events, managing communications, and rebuilding 'The Graticule' journal site), Course Representative on the Student Voice Committee, and peer mentor in applied mathematics. Looking for a summer 2027 placement in tech/engineering roles."
    ],
    focus: [
      "Quantitative Development & Trading Systems",
      "Algorithm Design & Graph Theory",
      "Full-Stack Web Architectures",
      "High-Performance Computing"
    ],
  },
  socials: [
    {
      name: "GitHub",
      label: "Code & Open Source",
      href: "https://github.com/dhairya-bhatt",
      username: "@dhairya-bhatt",
      icon: "github",
      isPrimary: true,
    },
    {
      name: "LinkedIn",
      label: "Professional Profile",
      href: "https://www.linkedin.com/in/dhairya-bhatt/",
      username: "dhairya-bhatt",
      icon: "linkedin",
      isPrimary: true,
    },
    {
      name: "LeetCode",
      label: "Algorithms & Contests",
      href: "https://leetcode.com/u/dhairyabhatt/",
      username: "dhairyabhatt",
      icon: "code",
      isPrimary: true,
    },
    {
      name: "Email",
      label: "Direct Communication",
      href: "mailto:dhairyabhatt.work@gmail.com",
      username: "dhairyabhatt.work@gmail.com",
      icon: "mail",
      isPrimary: true,
    },
    {
      name: "Instagram",
      label: "Moments & Visuals",
      href: "https://www.instagram.com/dhairyabhatt/",
      username: "@dhairyabhatt",
      icon: "instagram",
    },
    {
      name: "Discord",
      label: "Community & Chat",
      href: "https://discord.com/users/dhairyabhatt",
      username: "dhairyabhatt",
      icon: "discord",
    },
    {
      name: "Spotify",
      label: "On Heavy Rotation",
      href: "https://open.spotify.com/",
      username: "Dhairya Bhatt",
      icon: "spotify",
    },
    {
      name: "Letterboxd",
      label: "Film Diary & Lists",
      href: "https://letterboxd.com/dhairyabhatt/",
      username: "@dhairyabhatt",
      icon: "letterboxd",
    },
    {
      name: "Goodreads",
      label: "Bookshelf & Reviews",
      href: "https://www.goodreads.com/",
      username: "Dhairya Bhatt",
      icon: "goodreads",
    },
    {
      name: "AniList",
      label: "Anime & Manga Log",
      href: "https://anilist.co/user/dhairyabhatt/",
      username: "dhairyabhatt",
      icon: "anilist",
    },
  ],
  cvUrl: "/Dhairya_Bhatt_CV.pdf",
};
