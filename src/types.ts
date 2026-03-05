export interface Article {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  image: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface VisaGuide {
  id?: string;
  title: string;
  slug: string;
  type: string;
  requirements: string;
  process: string;
  documents: string;
  processingTime: string;
  tips: string;
  image: string;
  createdAt: string;
}

export interface Job {
  id?: string;
  title: string;
  company: string;
  location: string;
  province: string;
  industry: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  applicationLink: string;
  featured: boolean;
  createdAt: string;
}

export interface StudyProgram {
  id?: string;
  title: string;
  institution: string;
  type: string;
  cost: string;
  duration: string;
  description: string;
  link: string;
  createdAt: string;
}

export interface SiteSettings {
  adsenseHeader?: string;
  adsenseSidebar?: string;
  adsenseInArticle?: string;
  adsenseFooter?: string;
  adsenseMobile?: string;
  adsTxt?: string;
  siteName: string;
  siteDescription: string;
  logoUrl?: string;
}

export interface Subscriber {
  id?: string;
  email: string;
  subscribedAt: string;
}
