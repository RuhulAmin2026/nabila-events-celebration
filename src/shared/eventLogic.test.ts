import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeEventSummaryMetrics,
  filterEvents,
  filterGalleryItems,
  formatGuestCount,
  validateEventInput,
  validateInquiryInput,
} from './eventLogic';
import type { EventItem, GalleryItem, InquiryItem } from './types';

test('validateInquiryInput rejects invalid phone/email and short message', () => {
  const invalid = validateInquiryInput({
    name: 'A',
    phone: '123',
    message: 'Hi',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.message);
});

test('validateInquiryInput accepts valid phone or email and detailed inquiry', () => {
  const validPhone = validateInquiryInput({
    name: 'Nadia Karim',
    phone: '+880 1712-345678',
    message: 'Looking for full stage production for 1,200 guests in Dhaka.',
  });
  assert.equal(validPhone.valid, true);
  assert.deepEqual(validPhone.errors, {});

  const validEmail = validateInquiryInput({
    name: 'Tariq Hasan',
    phone: 'tariq@meridian.io',
    message: 'Need AV and lighting design for our annual leadership summit.',
  });
  assert.equal(validEmail.valid, true);
});

test('validateEventInput enforces title, location, and minimum guest count', () => {
  const bad = validateEventInput({
    title: 'Hi',
    category: 'Concert',
    date: '2026',
    location: '',
    guests: 5,
    summary: 'Short',
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.title);
  assert.ok(bad.errors.location);
  assert.ok(bad.errors.guests);
  assert.ok(bad.errors.summary);

  const good = validateEventInput({
    title: 'Summit Live 2026',
    category: 'Conference',
    date: '2026-10-18',
    location: 'Austin, TX',
    guests: 850,
    summary: 'Two-day enterprise leadership keynote with multi-track AV rooms.',
  });
  assert.equal(good.valid, true);
});

test('filterGalleryItems and filterEvents return accurate subsets', () => {
  const gallery: GalleryItem[] = [
    {
      id: 'g1',
      title: 'Blue Laser Arena',
      category: 'Concert',
      venue: 'Metro Arena',
      imageKey: 'concert_laser_crowd',
      aspect: 'tall',
    },
    {
      id: 'g2',
      title: 'Garden Reception',
      category: 'Gala',
      venue: 'Oakwood Estate',
      imageKey: 'outdoor_gala_lights',
      aspect: 'wide',
    },
  ];
  assert.equal(filterGalleryItems(gallery, 'All').length, 2);
  assert.equal(filterGalleryItems(gallery, 'Gala').length, 1);

  const events: EventItem[] = [
    {
      id: 'e1',
      title: 'Meridian Tech Summit',
      category: 'Conference',
      date: '2026-04-12',
      location: 'San Francisco, CA',
      guests: 2400,
      summary: 'Global product launch and keynote series.',
      highlights: ['4K LED Wall'],
      imageKey: 'conference_keynote_audience',
      createdAt: '2026-04-12T10:00:00Z',
    },
    {
      id: 'e2',
      title: 'Pulse Sunset Festival',
      category: 'Festival',
      date: '2026-06-20',
      location: 'Miami, FL',
      guests: 5000,
      summary: 'Open-air live music showcase.',
      highlights: ['Line-Array Audio'],
      imageKey: 'golden_festival_stage',
      createdAt: '2026-06-20T10:00:00Z',
    },
  ];

  assert.equal(filterEvents(events, 'miami', 'All').length, 1);
  assert.equal(filterEvents(events, '', 'Conference').length, 1);
  assert.equal(filterEvents(events, 'miami', 'Conference').length, 0);
});

test('computeEventSummaryMetrics aggregates totals cleanly', () => {
  const events: EventItem[] = [
    {
      id: 'e1',
      title: 'Event A',
      category: 'Gala',
      date: '2026-03-01',
      location: 'Boston',
      guests: 400,
      summary: 'Charity banquet dinner.',
      highlights: [],
      imageKey: 'banquet_wedding_ballroom',
      createdAt: '2026-03-01T00:00:00Z',
    },
    {
      id: 'e2',
      title: 'Event B',
      category: 'Concert',
      date: '2026-05-01',
      location: 'Chicago',
      guests: 1600,
      summary: 'Arena concert production.',
      highlights: [],
      imageKey: 'concert_laser_crowd',
      createdAt: '2026-05-01T00:00:00Z',
    },
  ];
  const inquiries: InquiryItem[] = [
    {
      id: 'i1',
      ticketCode: 'ES-1001',
      name: 'Client 1',
      phone: '+1 555 0100',
      message: 'Need stage rigging.',
      status: 'New',
      createdAt: '2026-07-01T00:00:00Z',
    },
    {
      id: 'i2',
      ticketCode: 'ES-1002',
      name: 'Client 2',
      phone: '+1 555 0101',
      message: 'Booking corporate gala.',
      status: 'Scheduled',
      createdAt: '2026-07-02T00:00:00Z',
    },
  ];

  const metrics = computeEventSummaryMetrics(events, inquiries);
  assert.equal(metrics.totalEvents, 2);
  assert.equal(metrics.totalGuestsServed, 2000);
  assert.equal(metrics.openInquiries, 1);
  assert.equal(metrics.scheduledInquiries, 1);
  assert.equal(formatGuestCount(2000), '2,000');
});
