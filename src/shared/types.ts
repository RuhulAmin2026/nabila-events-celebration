export type EventCategory = 'Concert' | 'Corporate' | 'Gala' | 'Festival' | 'Conference';

export type InquiryStatus = 'New' | 'Reviewed' | 'Scheduled';

export type AssetKey =
  | 'concert_laser_crowd'
  | 'pink_stage_performers'
  | 'outdoor_gala_lights'
  | 'conference_keynote_audience'
  | 'networking_cocktail_guests'
  | 'banquet_wedding_ballroom'
  | 'event_planning_tablet'
  | 'pavilion_evening_lights'
  | 'golden_festival_stage';

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  location: string;
  guests: number;
  summary: string;
  highlights: string[];
  imageKey: AssetKey;
  customImageUrl?: string;
  featured?: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: EventCategory;
  venue: string;
  imageKey: AssetKey;
  customImageUrl?: string;
  aspect: 'tall' | 'wide' | 'square';
}

export interface InquiryItem {
  id: string;
  ticketCode: string;
  name: string;
  phone: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  subtitle: string;
  deliverables: string[];
  turnaround: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  format: string;
  description: string;
  checklist: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'client';
}

export interface SiteDataResponse {
  experiences: ExperienceItem[];
  resources: ResourceItem[];
  gallery: GalleryItem[];
  events: EventItem[];
}
