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
  subRole: "Queen's University Belfast · Target Summer 2027 Quant & Tech Placements",
  university: "Queen's University Belfast",
  location: "Belfast, United Kingdom",
  timezone: "Europe/London",
  domain: "dhairyabhatt.me",
  url: "https://dhairyabhatt.me",
  bio: {
    lead: "Hi, I'm Dhairya Bhatt — a second-year Mathematics & Computer Science undergraduate at Queen's University Belfast.",
    body: [
      "My work sits at the intersection of rigorous mathematical reasoning and low-level computational performance. I'm fascinated by stochastic processes, discrete mathematics, and algorithms that scale under real-time constraints.",
      "Currently preparing for Summer 2027 Quantitative Trading, Quantitative Research, and Core Software Engineering internships. When I'm not writing algorithmic simulations or solving contest problems, I build playful tools and explore Belfast with a camera."
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
      href: "https://github.com/dhairyabhatt",
      username: "@dhairyabhatt",
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
      href: "mailto:dhairya@dhairyabhatt.me",
      username: "dhairya@dhairyabhatt.me",
      icon: "mail",
      isPrimary: true,
    },
  ],
  cvUrl: "/cv.pdf",
};
