export interface UIStrings {
  hero?: {
    badge?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
  };
  nav?: {
    ctaLabel?: string;
  };
  sections?: {
    services?: string;
    about?: string;
    gallery?: string;
    testimonials?: string;
    contact?: string;
  };
  cta?: {
    phone?: string;
    email?: string;
    directions?: string;
  };
  footer?: {
    tagline?: string;
  };
}

export interface SiteContent {
  business: Business;
  contact: Contact;
  hours: HoursOfOperation;
  services: Service[];
  team: TeamMember[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  announcements: Announcement[];
  seo: SEOMetadata;
  ui?: UIStrings;
}

export interface Business {
  name: string;
  tagline: string;
  description: string;
  logo?: string;
  favicon?: string;
  heroImage?: string;
  aboutImage?: string;
  primaryColor?: string;
  accentColor?: string;
}

export interface Contact {
  phone: string;
  email: string;
  address: Address;
  socials?: SocialLinks;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  nextdoor?: string;
  yelp?: string;
}

export interface HoursOfOperation {
  timezone: string;
  regular: DayHours[];
  exceptions?: HoursException[];
  note?: string;
}

export interface DayHours {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  open: string;
  close: string;
  closed?: boolean;
}

export interface HoursException {
  date: string;
  label: string;
  open?: string;
  close?: string;
  closed?: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon?: string;
  image?: string;
  featured?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  phone?: string;
  email?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  rating?: number;
  date?: string;
  source?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: "info" | "warning" | "promo";
  active: boolean;
  startsAt?: string;
  endsAt?: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

export interface SectionDef {
  type: string;
  variant?: string;
  props?: Record<string, any>;
}

export interface PageDef {
  title: string;
  sections: SectionDef[];
}
