export type AvailabilityStatus = 'open' | 'freelance' | 'closed';

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  /** lucide-react 图标名，未命中映射时降级为 Globe */
  icon: string;
  handle?: string;
}

export interface Availability {
  status: AvailabilityStatus;
  text: string;
}

export interface Profile {
  name: string;
  role: string;
  headline: string[];
  slogan: string;
  avatar: string;
  avatarAlt: string;
  location: string;
  email: string;
  resumeUrl: string;
  bio: string[];
  availability: Availability;
  socials: SocialLink[];
}
