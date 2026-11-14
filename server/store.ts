import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type {
  AuthUser,
  EventItem,
  ExperienceItem,
  GalleryItem,
  InquiryItem,
  InquiryStatus,
  ResourceItem,
} from '../src/shared/types';

interface StoredUser extends AuthUser {
  passwordHash: string;
  salt: string;
}

interface DatabaseSchema {
  events: EventItem[];
  gallery: GalleryItem[];
  inquiries: InquiryItem[];
  experiences: ExperienceItem[];
  resources: ResourceItem[];
  users: StoredUser[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

const sessionStore = new Map<string, AuthUser>();

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function createInitialData(): DatabaseSchema {
  const demoSalt = crypto.randomBytes(16).toString('hex');
  return {
    events: [
      {
        id: 'evt-1',
        title: 'Echoes Electric Arena Tour',
        category: 'Concert',
        date: '2026-09-14',
        location: 'Los Angeles, CA',
        guests: 6500,
        summary:
          'Full-scale arena production featuring synchronized laser arrays, timecoded LED stage walls, and spatial L-Acoustics sound engineering.',
        highlights: [
          '180ft Panoramic LED Backdrop',
          'Timecoded DMX Laser Rig',
          'Zero-latency Broadcast Feed',
        ],
        imageKey: 'pink_stage_performers',
        featured: true,
        createdAt: '2026-09-14T18:00:00.000Z',
      },
      {
        id: 'evt-2',
        title: 'Aurora Garden Charity Gala',
        category: 'Gala',
        date: '2026-08-22',
        location: 'Napa Valley, CA',
        guests: 620,
        summary:
          'Twilight outdoor estate celebration with custom draped canopies, acoustic string quartet amplification, and seamless VIP table service.',
        highlights: [
          'Custom Canopy & Bistro Lighting',
          'Live Auction Display',
          'Multi-Course Hospitality Flow',
        ],
        imageKey: 'outdoor_gala_lights',
        createdAt: '2026-08-22T17:00:00.000Z',
      },
      {
        id: 'evt-3',
        title: 'Heritage Grand Ballroom Awards',
        category: 'Gala',
        date: '2026-07-19',
        location: 'Chicago, IL',
        guests: 940,
        summary:
          'Black-tie annual leadership recognition banquet featuring warm architectural uplighting, floral installations, and broadcast-grade stage cues.',
        highlights: [
          '90-Table Precision Seating',
          'Warm Architectural Uplighting',
          'Live Teleprompter & Stage Cueing',
        ],
        imageKey: 'banquet_wedding_ballroom',
        createdAt: '2026-07-19T19:30:00.000Z',
      },
      {
        id: 'evt-4',
        title: 'Horizon Sunset Music Festival',
        category: 'Festival',
        date: '2026-06-11',
        location: 'Austin, TX',
        guests: 8200,
        summary:
          'Open-air sunset festival stage engineered for rapid artist changeovers, high-SPL outdoor dispersion, and festival crowd safety.',
        highlights: [
          'Dual Rolling Risers for 12-Min Turnarounds',
          'Weather-Rated Line Array Rig',
          'RFID Cashless Gate Integration',
        ],
        imageKey: 'golden_festival_stage',
        createdAt: '2026-06-11T16:00:00.000Z',
      },
      {
        id: 'evt-5',
        title: 'Meridian Global Tech Summit',
        category: 'Conference',
        date: '2026-05-04',
        location: 'San Francisco, CA',
        guests: 2400,
        summary:
          'Multi-track enterprise keynote conference with simultaneous interpretation booths, hybrid live-streaming, and interactive expo lounges.',
        highlights: [
          '4 Concurrent Breakout Stages',
          'Global 4K Livestream Production',
          'Badge Check-in Under 12 Seconds',
        ],
        imageKey: 'conference_keynote_audience',
        createdAt: '2026-05-04T09:00:00.000Z',
      },
      {
        id: 'evt-6',
        title: 'Harborfront Waterfront Showcase',
        category: 'Corporate',
        date: '2026-04-16',
        location: 'Boston, MA',
        guests: 1150,
        summary:
          'Architectural glass pavilion brand reveal illuminated with custom magenta structural washes and waterfront cocktail terraces.',
        highlights: [
          'Custom Architectural LED Wash',
          'Waterfront VIP Lounge Deck',
          'Interactive Product Demo Pods',
        ],
        imageKey: 'pavilion_evening_lights',
        createdAt: '2026-04-16T18:00:00.000Z',
      },
    ],
    gallery: [
      {
        id: 'gal-1',
        title: 'Volumetric Arena Laser Matrix',
        category: 'Concert',
        venue: 'Metro Dome, Los Angeles',
        imageKey: 'concert_laser_crowd',
        aspect: 'tall',
      },
      {
        id: 'gal-2',
        title: 'Headliner Mainstage Rig',
        category: 'Concert',
        venue: 'Pier 27 Pavilion, SF',
        imageKey: 'pink_stage_performers',
        aspect: 'tall',
      },
      {
        id: 'gal-3',
        title: 'Twilight Garden Canopy Gala',
        category: 'Gala',
        venue: 'Meadowood Estate, Napa',
        imageKey: 'outdoor_gala_lights',
        aspect: 'wide',
      },
      {
        id: 'gal-4',
        title: 'Waterfront Glass Pavilion Illumination',
        category: 'Corporate',
        venue: 'Harborview Hall, Boston',
        imageKey: 'pavilion_evening_lights',
        aspect: 'tall',
      },
      {
        id: 'gal-5',
        title: 'Golden Hour Festival Stage',
        category: 'Festival',
        venue: 'Zilker Parklands, Austin',
        imageKey: 'golden_festival_stage',
        aspect: 'wide',
      },
      {
        id: 'gal-6',
        title: 'Executive Keynote Auditorium',
        category: 'Conference',
        venue: 'Moscone West, San Francisco',
        imageKey: 'conference_keynote_audience',
        aspect: 'wide',
      },
      {
        id: 'gal-7',
        title: 'Grand Timber Ballroom Dinner',
        category: 'Gala',
        venue: 'Union Hall, Chicago',
        imageKey: 'banquet_wedding_ballroom',
        aspect: 'wide',
      },
      {
        id: 'gal-8',
        title: 'Executive Networking Reception',
        category: 'Corporate',
        venue: 'Foundry Lounge, New York',
        imageKey: 'networking_cocktail_guests',
        aspect: 'square',
      },
    ],
    inquiries: [
      {
        id: 'inq-1',
        ticketCode: 'NE-2041',
        name: 'Tasnim Chowdhury',
        phone: '+880 1711-248910',
        message:
          'Planning a 1,500-person annual corporate summit in October with mainstage LED wall and 3 breakout tracks.',
        status: 'Scheduled',
        createdAt: '2026-11-10T14:22:00.000Z',
      },
      {
        id: 'inq-2',
        ticketCode: 'NE-2042',
        name: 'Rafiqul Islam',
        phone: 'rafiq@dhakacapital.com',
        message:
          'Looking for full lighting, floral staging, and live acoustic setup for our winter charity gala.',
        status: 'Reviewed',
        createdAt: '2026-11-12T09:15:00.000Z',
      },
    ],
    experiences: [
      {
        id: 'exp-1',
        title: 'Corporate Summits & Keynotes',
        subtitle: 'Precision multi-track conferences and product launches',
        deliverables: [
          'Custom 4K panoramic LED stage design',
          'Multi-camera hybrid broadcast & live captioning',
          'Executive speaker green-room & cue direction',
        ],
        turnaround: '4–8 weeks lead time',
      },
      {
        id: 'exp-2',
        title: 'Live Concerts & Festivals',
        subtitle: 'High-impact touring, arena, and outdoor festival production',
        deliverables: [
          'Timecoded DMX lighting & volumetric laser shows',
          'Line-array acoustic modeling for indoor/outdoor venues',
          'Artist hospitality, backline & rapid stage changeovers',
        ],
        turnaround: '3–12 weeks lead time',
      },
      {
        id: 'exp-3',
        title: 'Luxury Galas & Hospitality',
        subtitle: 'Bespoke architectural lighting, dining, and donor experiences',
        deliverables: [
          'Custom tented canopies & warm architectural washes',
          'Live pledge boards & synchronized audio cues',
          'End-to-end vendor, catering & valet choreography',
        ],
        turnaround: '2–6 weeks lead time',
      },
    ],
    resources: [
      {
        id: 'res-1',
        title: 'Event Run-of-Show Schedule',
        format: 'Interactive Checklist · 24 Checkpoints',
        description:
          'Minute-by-minute cue template covering load-in, soundcheck, doors open, keynote transitions, and strike.',
        checklist: [
          'Lock rigging plots & power distribution 21 days out',
          'Confirm artist/speaker slide decks & aspect ratios 72h prior',
          'Run full-dress audio + DMX lighting cue rehearsal on T-1 day',
        ],
      },
      {
        id: 'res-2',
        title: 'Venue AV & Rigging Rider Guide',
        format: 'Technical Spec Sheet · Audio / Video / Power',
        description:
          'Standardized stage dimensions, 3-phase power requirements, truss load limits, and fiber backbone specs.',
        checklist: [
          'Verify 200A 3-phase cam-lok tie-in availability',
          'Measure ceiling trim height & rigging point capacities',
          'Allocate dedicated 1Gbps symmetrical upload line for streams',
        ],
      },
      {
        id: 'res-3',
        title: 'Guest Experience & Crowd Flow Kit',
        format: 'Operations Blueprint · Registration to Exit',
        description:
          'Queue-busting check-in ratios, ADA accessibility routing, acoustic zoning, and emergency egress protocols.',
        checklist: [
          'Deploy 1 check-in scanner per 180 arriving guests',
          'Separate VIP hospitality lanes from general admission gates',
          'Position directional illuminated signage at every decision point',
        ],
      },
    ],
    users: [
      {
        id: 'usr-organizer',
        name: 'Nabila Rahman (Lead Producer)',
        email: 'admin@nabilaevents.com',
        role: 'organizer',
        salt: demoSalt,
        passwordHash: hashPassword('EventPro2026!', demoSalt),
      },
    ],
  };
}

function ensureDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const initial = createInitialData();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch {
    const fallback = createInitialData();
    fs.writeFileSync(DB_PATH, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function writeDatabase(db: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tmpPath, DB_PATH);
}

export function getSiteData() {
  const db = ensureDatabase();
  return {
    experiences: db.experiences,
    resources: db.resources,
    gallery: db.gallery,
    events: db.events,
  };
}

export function listEvents(): EventItem[] {
  return ensureDatabase().events;
}

export function getEventById(id: string): EventItem | undefined {
  return ensureDatabase().events.find((e) => e.id === id);
}

export function createEvent(
  input: Omit<EventItem, 'id' | 'createdAt'>,
): EventItem {
  const db = ensureDatabase();
  const created: EventItem = {
    ...input,
    id: `evt-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };
  db.events.unshift(created);
  writeDatabase(db);
  return created;
}

export function updateEvent(
  id: string,
  patch: Partial<Omit<EventItem, 'id' | 'createdAt'>>,
): EventItem | null {
  const db = ensureDatabase();
  const idx = db.events.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  db.events[idx] = { ...db.events[idx], ...patch };
  writeDatabase(db);
  return db.events[idx];
}

export function deleteEvent(id: string): boolean {
  const db = ensureDatabase();
  const next = db.events.filter((e) => e.id !== id);
  if (next.length === db.events.length) return false;
  db.events = next;
  writeDatabase(db);
  return true;
}

export function listGallery(): GalleryItem[] {
  return ensureDatabase().gallery;
}

export function addGalleryItem(input: Omit<GalleryItem, 'id'>): GalleryItem {
  const db = ensureDatabase();
  const created: GalleryItem = {
    ...input,
    id: `gal-${crypto.randomUUID().slice(0, 8)}`,
  };
  db.gallery.unshift(created);
  writeDatabase(db);
  return created;
}

export function listInquiries(): InquiryItem[] {
  return ensureDatabase().inquiries;
}

export function createInquiry(input: {
  name: string;
  phone: string;
  message: string;
}): InquiryItem {
  const db = ensureDatabase();
  const nextNum = 2040 + db.inquiries.length + 1;
  const created: InquiryItem = {
    id: `inq-${crypto.randomUUID().slice(0, 8)}`,
    ticketCode: `NE-${nextNum}`,
    name: input.name.trim(),
    phone: input.phone.trim(),
    message: input.message.trim(),
    status: 'New',
    createdAt: new Date().toISOString(),
  };
  db.inquiries.unshift(created);
  writeDatabase(db);
  return created;
}

export function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): InquiryItem | null {
  const db = ensureDatabase();
  const idx = db.inquiries.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  db.inquiries[idx] = { ...db.inquiries[idx], status };
  writeDatabase(db);
  return db.inquiries[idx];
}

export function authenticateUser(
  email: string,
  password: string,
): { token: string; user: AuthUser } | null {
  const db = ensureDatabase();
  const normalized = email.trim().toLowerCase();
  const found = db.users.find((u) => u.email.toLowerCase() === normalized);
  if (!found) return null;
  const candidateHash = hashPassword(password, found.salt);
  if (candidateHash !== found.passwordHash) return null;
  const user: AuthUser = {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
  };
  const token = crypto.randomBytes(24).toString('hex');
  sessionStore.set(token, user);
  return { token, user };
}

export function registerUser(
  name: string,
  email: string,
  password: string,
): { token: string; user: AuthUser } | { error: string } {
  const db = ensureDatabase();
  const normalized = email.trim().toLowerCase();
  if (db.users.some((u) => u.email.toLowerCase() === normalized)) {
    return { error: 'An account with this email already exists.' };
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const newUser: StoredUser = {
    id: `usr-${crypto.randomUUID().slice(0, 8)}`,
    name: name.trim(),
    email: normalized,
    role: 'organizer',
    salt,
    passwordHash: hashPassword(password, salt),
  };
  db.users.push(newUser);
  writeDatabase(db);
  const user: AuthUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
  const token = crypto.randomBytes(24).toString('hex');
  sessionStore.set(token, user);
  return { token, user };
}

export function createDemoOrganizerSession(): { token: string; user: AuthUser } {
  const db = ensureDatabase();
  const demo = db.users[0];
  const user: AuthUser = {
    id: demo.id,
    name: demo.name,
    email: demo.email,
    role: demo.role,
  };
  const token = crypto.randomBytes(24).toString('hex');
  sessionStore.set(token, user);
  return { token, user };
}

export function getSessionUser(token: string | undefined): AuthUser | null {
  if (!token) return null;
  return sessionStore.get(token) ?? null;
}

export function revokeSession(token: string | undefined): void {
  if (token) {
    sessionStore.delete(token);
  }
}
