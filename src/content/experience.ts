import { aboutContent } from "./about";

export interface ExperienceItem {
  role: string;
  organisation: string;
  description: string;
  dates?: string | null;
  metrics?: string[];
  link?: string | null;
}

export const volunteeringAndExperienceData: ExperienceItem[] = aboutContent.volunteeringAndExperience.map((item) => ({
  role: item.role,
  organisation: item.organisation,
  description: item.description,
  dates: item.dates || null,
}));

export const educationData = aboutContent.educations;

export const cvDownloadUrl: string | null = aboutContent.cvUrl || null;
