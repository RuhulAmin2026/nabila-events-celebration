import type {
  EventCategory,
  EventItem,
  GalleryItem,
  InquiryItem,
} from './types';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface InquiryInput {
  name: string;
  phone: string;
  message: string;
}

export interface EventInput {
  title: string;
  category: EventCategory;
  date: string;
  location: string;
  guests: number;
  summary: string;
  highlights?: string[];
}

export function validateInquiryInput(input: InquiryInput): ValidationResult {
  const errors: Record<string, string> = {};
  const name = (input.name ?? '').trim();
  const phone = (input.phone ?? '').trim();
  const message = (input.message ?? '').trim();

  if (name.length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }

  const normalizedPhone = phone.replace(/[\s\-().+]/g, '');
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phone);
  const looksLikePhone = /^\d{7,15}$/.test(normalizedPhone);
  if (!looksLikePhone && !looksLikeEmail) {
    errors.phone = 'Enter a valid phone number (7–15 digits) or email address.';
  }

  if (message.length < 10) {
    errors.message = 'Tell us a bit more about your event (at least 10 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateEventInput(input: EventInput): ValidationResult {
  const errors: Record<string, string> = {};
  if ((input.title ?? '').trim().length < 3) {
    errors.title = 'Event title must be at least 3 characters.';
  }
  if ((input.date ?? '').trim().length < 4) {
    errors.date = 'Provide a valid event date.';
  }
  if ((input.location ?? '').trim().length < 2) {
    errors.location = 'Provide an event city or venue.';
  }
  if (!Number.isFinite(input.guests) || input.guests < 10) {
    errors.guests = 'Guest count must be at least 10.';
  }
  if ((input.summary ?? '').trim().length < 12) {
    errors.summary = 'Summary must be at least 12 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function filterGalleryItems(
  items: GalleryItem[],
  category: EventCategory | 'All',
): GalleryItem[] {
  if (category === 'All') {
    return items;
  }
  return items.filter((item) => item.category === category);
}

export function filterEvents(
  events: EventItem[],
  search: string,
  category: EventCategory | 'All',
): EventItem[] {
  const query = search.trim().toLowerCase();
  return events.filter((event) => {
    const matchesCategory = category === 'All' || event.category === category;
    if (!matchesCategory) return false;
    if (!query) return true;
    return (
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.summary.toLowerCase().includes(query)
    );
  });
}

export function computeEventSummaryMetrics(
  events: EventItem[],
  inquiries: InquiryItem[],
): {
  totalEvents: number;
  totalGuestsServed: number;
  openInquiries: number;
  scheduledInquiries: number;
} {
  const totalEvents = events.length;
  const totalGuestsServed = events.reduce((acc, ev) => acc + (ev.guests || 0), 0);
  const openInquiries = inquiries.filter((inq) => inq.status !== 'Scheduled').length;
  const scheduledInquiries = inquiries.filter((inq) => inq.status === 'Scheduled').length;

  return {
    totalEvents,
    totalGuestsServed,
    openInquiries,
    scheduledInquiries,
  };
}

export function formatGuestCount(guests: number): string {
  return new Intl.NumberFormat('en-US').format(guests);
}
