import express, { type Request, type Response, type NextFunction } from 'express';
import {
  validateEventInput,
  validateInquiryInput,
} from '../src/shared/eventLogic';
import type { AssetKey, EventCategory, InquiryStatus } from '../src/shared/types';
import {
  addGalleryItem,
  authenticateUser,
  createDemoOrganizerSession,
  createEvent,
  createInquiry,
  deleteEvent,
  getEventById,
  getSessionUser,
  getSiteData,
  listEvents,
  listGallery,
  listInquiries,
  registerUser,
  revokeSession,
  updateEvent,
  updateInquiryStatus,
} from './store';
import { buildProjectZip } from './zipBuilder';

const VALID_CATEGORIES = new Set<EventCategory>([
  'Concert',
  'Corporate',
  'Gala',
  'Festival',
  'Conference',
]);

const VALID_INQUIRY_STATUSES = new Set<InquiryStatus>([
  'New',
  'Reviewed',
  'Scheduled',
]);

const VALID_ASSET_KEYS = new Set<AssetKey>([
  'concert_laser_crowd',
  'pink_stage_performers',
  'outdoor_gala_lights',
  'conference_keynote_audience',
  'networking_cocktail_guests',
  'banquet_wedding_ballroom',
  'event_planning_tablet',
  'pavilion_evening_lights',
  'golden_festival_stage',
]);

function extractBearerToken(req: Request): string | undefined {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('es_session='));
    if (match) {
      return decodeURIComponent(match.slice('es_session='.length));
    }
  }
  return undefined;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(extractBearerToken(req));
  if (!user) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }
  res.locals.user = user;
  next();
}

export function createApiRouter() {
  const router = express.Router();

  router.get('/health', (_req, res) => {
    res.json({
      ok: true,
      backend: 'express-local-json',
      timestamp: new Date().toISOString(),
    });
  });

  router.get('/site-data', (_req, res) => {
    res.json(getSiteData());
  });

  router.get('/project-zip', (_req, res) => {
    try {
      const zipBuffer = buildProjectZip(process.cwd());
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="nabila-events-celebration.zip"',
      );
      res.setHeader('Content-Length', String(zipBuffer.length));
      res.send(zipBuffer);
    } catch {
      res.status(500).json({ error: 'Unable to package project archive.' });
    }
  });

  router.get('/events', (_req, res) => {
    res.json({ events: listEvents() });
  });

  router.get('/events/:id', (req, res) => {
    const event = getEventById(req.params.id);
    if (!event) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }
    res.json({ event });
  });

  router.post('/events', requireAuth, (req, res) => {
    const body = req.body ?? {};
    const category: EventCategory = VALID_CATEGORIES.has(body.category)
      ? body.category
      : 'Corporate';
    const imageKey: AssetKey = VALID_ASSET_KEYS.has(body.imageKey)
      ? body.imageKey
      : 'conference_keynote_audience';

    const validation = validateEventInput({
      title: String(body.title ?? ''),
      category,
      date: String(body.date ?? ''),
      location: String(body.location ?? ''),
      guests: Number(body.guests ?? 0),
      summary: String(body.summary ?? ''),
    });

    if (!validation.valid) {
      res.status(400).json({ error: 'Invalid event payload.', errors: validation.errors });
      return;
    }

    const highlights = Array.isArray(body.highlights)
      ? body.highlights.map((h: unknown) => String(h).trim()).filter(Boolean)
      : ['Full AV Production', 'Dedicated Stage Director'];

    const event = createEvent({
      title: String(body.title).trim(),
      category,
      date: String(body.date).trim(),
      location: String(body.location).trim(),
      guests: Number(body.guests),
      summary: String(body.summary).trim(),
      highlights,
      imageKey,
      customImageUrl:
        typeof body.customImageUrl === 'string' && body.customImageUrl.trim()
          ? body.customImageUrl.trim()
          : undefined,
      featured: Boolean(body.featured),
    });

    res.status(201).json({ event });
  });

  router.patch('/events/:id', requireAuth, (req, res) => {
    const updated = updateEvent(String(req.params.id), req.body ?? {});
    if (!updated) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }
    res.json({ event: updated });
  });

  router.delete('/events/:id', requireAuth, (req, res) => {
    const deleted = deleteEvent(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }
    res.json({ ok: true });
  });

  router.get('/gallery', (_req, res) => {
    res.json({ gallery: listGallery() });
  });

  router.post('/gallery', requireAuth, (req, res) => {
    const body = req.body ?? {};
    const title = String(body.title ?? '').trim();
    const venue = String(body.venue ?? '').trim();
    if (title.length < 3 || venue.length < 2) {
      res.status(400).json({ error: 'Title and venue are required.' });
      return;
    }
    const category: EventCategory = VALID_CATEGORIES.has(body.category)
      ? body.category
      : 'Concert';
    const imageKey: AssetKey = VALID_ASSET_KEYS.has(body.imageKey)
      ? body.imageKey
      : 'concert_laser_crowd';
    const aspect =
      body.aspect === 'tall' || body.aspect === 'square' || body.aspect === 'wide'
        ? body.aspect
        : 'wide';

    const item = addGalleryItem({
      title,
      venue,
      category,
      imageKey,
      customImageUrl:
        typeof body.customImageUrl === 'string' && body.customImageUrl.trim()
          ? body.customImageUrl.trim()
          : undefined,
      aspect,
    });

    res.status(201).json({ item });
  });

  router.post('/inquiries', (req, res) => {
    const body = req.body ?? {};
    const validation = validateInquiryInput({
      name: String(body.name ?? ''),
      phone: String(body.phone ?? ''),
      message: String(body.message ?? ''),
    });

    if (!validation.valid) {
      res.status(400).json({
        error: 'Please check the highlighted fields.',
        errors: validation.errors,
      });
      return;
    }

    const inquiry = createInquiry({
      name: String(body.name),
      phone: String(body.phone),
      message: String(body.message),
    });

    res.status(201).json({ inquiry });
  });

  router.get('/inquiries', requireAuth, (_req, res) => {
    res.json({ inquiries: listInquiries() });
  });

  router.patch('/inquiries/:id', requireAuth, (req, res) => {
    const status = req.body?.status;
    if (!VALID_INQUIRY_STATUSES.has(status)) {
      res.status(400).json({ error: 'Invalid inquiry status.' });
      return;
    }
    const updated = updateInquiryStatus(String(req.params.id), status);
    if (!updated) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }
    res.json({ inquiry: updated });
  });

  router.post('/auth/signin', (req, res) => {
    const email = String(req.body?.email ?? '').trim();
    const password = String(req.body?.password ?? '');
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }
    const result = authenticateUser(email, password);
    if (!result) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }
    res.cookie('es_session', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json(result);
  });

  router.post('/auth/demo', (_req, res) => {
    const result = createDemoOrganizerSession();
    res.cookie('es_session', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json(result);
  });

  router.post('/auth/signup', (req, res) => {
    const name = String(req.body?.name ?? '').trim();
    const email = String(req.body?.email ?? '').trim();
    const password = String(req.body?.password ?? '');

    if (name.length < 2 || !email.includes('@') || password.length < 6) {
      res.status(400).json({
        error: 'Provide a name (2+ chars), valid email, and password (6+ chars).',
      });
      return;
    }

    const result = registerUser(name, email, password);
    if ('error' in result) {
      res.status(409).json({ error: result.error });
      return;
    }

    res.cookie('es_session', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json(result);
  });

  router.get('/auth/me', (req, res) => {
    const user = getSessionUser(extractBearerToken(req));
    res.json({ user });
  });

  router.post('/auth/signout', (req, res) => {
    revokeSession(extractBearerToken(req));
    res.clearCookie('es_session', { path: '/' });
    res.json({ ok: true });
  });

  return router;
}
