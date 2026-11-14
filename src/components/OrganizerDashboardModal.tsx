import { useEffect, useState, type FormEvent } from 'react';
import { Download, Loader2, LogOut, Plus, Trash2, X } from 'lucide-react';
import { ASSET_OPTIONS } from '../data/eventAssets';
import {
  createEventApi,
  createGalleryItemApi,
  deleteEventApi,
  fetchInquiries,
  signOutApi,
  updateInquiryStatusApi,
} from '../lib/api';
import {
  computeEventSummaryMetrics,
  formatGuestCount,
  validateEventInput,
} from '../shared/eventLogic';
import type {
  AssetKey,
  AuthUser,
  EventCategory,
  EventItem,
  GalleryItem,
  InquiryItem,
  InquiryStatus,
} from '../shared/types';

interface OrganizerDashboardModalProps {
  open: boolean;
  user: AuthUser | null;
  events: EventItem[];
  onClose: () => void;
  onEventCreated: (event: EventItem) => void;
  onEventDeleted: (id: string) => void;
  onGalleryCreated: (item: GalleryItem) => void;
  onSignedOut: () => void;
}

type DashboardTab = 'events' | 'inquiries' | 'gallery';

const CATEGORIES: EventCategory[] = [
  'Concert',
  'Corporate',
  'Gala',
  'Festival',
  'Conference',
];

export function OrganizerDashboardModal({
  open,
  user,
  events,
  onClose,
  onEventCreated,
  onEventDeleted,
  onGalleryCreated,
  onSignedOut,
}: OrganizerDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('events');
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Corporate');
  const [date, setDate] = useState('2026-11-28');
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('350');
  const [summary, setSummary] = useState('');
  const [imageKey, setImageKey] = useState<AssetKey>('conference_keynote_audience');
  const [eventErrors, setEventErrors] = useState<Record<string, string>>({});
  const [savingEvent, setSavingEvent] = useState(false);

  const [galTitle, setGalTitle] = useState('');
  const [galVenue, setGalVenue] = useState('');
  const [galCategory, setGalCategory] = useState<EventCategory>('Concert');
  const [galImageKey, setGalImageKey] = useState<AssetKey>('concert_laser_crowd');
  const [savingGallery, setSavingGallery] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !user) return;
    setLoadingInquiries(true);
    fetchInquiries()
      .then((res) => setInquiries(res.inquiries))
      .catch(() => {})
      .finally(() => setLoadingInquiries(false));
  }, [open, user]);

  if (!open || !user) return null;

  const metrics = computeEventSummaryMetrics(events, inquiries);

  async function handleCreateEvent(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);
    const parsedGuests = Number(guests);
    const validation = validateEventInput({
      title,
      category,
      date,
      location,
      guests: parsedGuests,
      summary,
    });
    if (!validation.valid) {
      setEventErrors(validation.errors);
      return;
    }
    setEventErrors({});
    setSavingEvent(true);
    try {
      const { event } = await createEventApi({
        title,
        category,
        date,
        location,
        guests: parsedGuests,
        summary,
        highlights: ['Full AV Production', 'Dedicated Stage Director'],
        imageKey,
      });
      onEventCreated(event);
      setTitle('');
      setLocation('');
      setSummary('');
      setFeedback(`Added "${event.title}" to Past Events.`);
    } catch (err) {
      setFeedback((err as Error).message || 'Could not save event.');
    } finally {
      setSavingEvent(false);
    }
  }

  async function handleDeleteEvent(id: string, eventTitle: string) {
    setFeedback(null);
    try {
      await deleteEventApi(id);
      onEventDeleted(id);
      setFeedback(`Removed "${eventTitle}".`);
    } catch (err) {
      setFeedback((err as Error).message || 'Delete failed.');
    }
  }

  async function handleInquiryStatus(id: string, status: InquiryStatus) {
    try {
      const { inquiry } = await updateInquiryStatusApi(id, status);
      setInquiries((prev) => prev.map((i) => (i.id === id ? inquiry : i)));
    } catch {
      // Ignore transient errors
    }
  }

  async function handleCreateGallery(e: FormEvent) {
    e.preventDefault();
    if (galTitle.trim().length < 3 || galVenue.trim().length < 2) {
      setFeedback('Provide a gallery title and venue.');
      return;
    }
    setSavingGallery(true);
    setFeedback(null);
    try {
      const { item } = await createGalleryItemApi({
        title: galTitle.trim(),
        venue: galVenue.trim(),
        category: galCategory,
        imageKey: galImageKey,
        aspect: 'wide',
      });
      onGalleryCreated(item);
      setGalTitle('');
      setGalVenue('');
      setFeedback(`Added "${item.title}" to Gallery.`);
    } catch (err) {
      setFeedback((err as Error).message || 'Could not add gallery item.');
    } finally {
      setSavingGallery(false);
    }
  }

  async function handleSignOut() {
    await signOutApi();
    onSignedOut();
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Event Admin Dashboard"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-[#060919] text-white flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold">
              Event Admin Dashboard
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Signed in as {user.name} ({user.email})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/project-zip"
              download="nabila-events-celebration.zip"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#4B93FF] hover:bg-[#3582F6] rounded-lg whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download ZIP</span>
            </a>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white border border-white/20 rounded-lg cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
            <button
              type="button"
              aria-label="Close Admin Dashboard"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50 divide-x divide-slate-200">
          <div className="px-5 py-3.5">
            <p className="text-xs text-slate-500">Published Events</p>
            <p className="mt-0.5 font-display text-xl font-bold tabular-nums text-slate-900">
              {metrics.totalEvents}
            </p>
          </div>
          <div className="px-5 py-3.5">
            <p className="text-xs text-slate-500">Total Guests Served</p>
            <p className="mt-0.5 font-display text-xl font-bold tabular-nums text-slate-900">
              {formatGuestCount(metrics.totalGuestsServed)}
            </p>
          </div>
          <div className="px-5 py-3.5">
            <p className="text-xs text-slate-500">Open Inquiries</p>
            <p className="mt-0.5 font-display text-xl font-bold tabular-nums text-slate-900">
              {metrics.openInquiries}
            </p>
          </div>
          <div className="px-5 py-3.5">
            <p className="text-xs text-slate-500">Scheduled Calls</p>
            <p className="mt-0.5 font-display text-xl font-bold tabular-nums text-slate-900">
              {metrics.scheduledInquiries}
            </p>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-slate-200 flex flex-wrap items-center gap-2 bg-white">
          {(
            [
              { id: 'events', label: 'Manage Events' },
              { id: 'inquiries', label: `Inquiries (${inquiries.length})` },
              { id: 'gallery', label: 'Add Gallery Photo' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setFeedback(null);
              }}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#141D42] text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {feedback && (
          <div className="mx-6 mt-4 px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-900">
            {feedback}
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <form
                onSubmit={handleCreateEvent}
                className="lg:col-span-5 space-y-3.5 p-5 rounded-xl border border-slate-200 bg-slate-50/70"
              >
                <h3 className="font-display text-base font-bold text-slate-900">
                  Publish New Event
                </h3>

                <div>
                  <label
                    htmlFor="evt-title"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Event Title
                  </label>
                  <input
                    id="evt-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Dhaka Fintech Summit 2026"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                  {eventErrors.title && (
                    <p className="mt-1 text-xs text-red-600">{eventErrors.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="evt-category"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="evt-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EventCategory)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="evt-guests"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Guests
                    </label>
                    <input
                      id="evt-guests"
                      type="number"
                      min={10}
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="evt-date"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Date
                    </label>
                    <input
                      id="evt-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="evt-location"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Location
                    </label>
                    <input
                      id="evt-location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="evt-photo"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Stage Photo Preset
                  </label>
                  <select
                    id="evt-photo"
                    value={imageKey}
                    onChange={(e) => setImageKey(e.target.value as AssetKey)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                  >
                    {ASSET_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="evt-summary"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Production Summary
                  </label>
                  <textarea
                    id="evt-summary"
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Stage design, audio setup, and event scale..."
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                  {eventErrors.summary && (
                    <p className="mt-1 text-xs text-red-600">{eventErrors.summary}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={savingEvent}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#4B93FF] hover:bg-[#3582F6] rounded-lg inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {savingEvent ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>Publish Event</span>
                </button>
              </form>

              <div className="lg:col-span-7 space-y-3">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Existing Events ({events.length})
                </h3>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 bg-white flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900">
                          {ev.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                          {ev.category} · {ev.date} · {ev.location} ·{' '}
                          {formatGuestCount(ev.guests)} Guests
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Delete ${ev.title}`}
                        onClick={() => handleDeleteEvent(ev.id, ev.title)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div>
              {loadingInquiries ? (
                <div className="py-12 flex items-center justify-center text-sm text-slate-500 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading inquiries...</span>
                </div>
              ) : inquiries.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500">
                  No inquiries received yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono font-semibold text-slate-900">
                            {inq.ticketCode}
                          </span>
                          <span>·</span>
                          <span>{inq.name}</span>
                          <span>·</span>
                          <span>{inq.phone}</span>
                        </div>
                        <p className="mt-1.5 text-sm text-slate-800">{inq.message}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {(['New', 'Reviewed', 'Scheduled'] as InquiryStatus[]).map(
                          (st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleInquiryStatus(inq.id, st)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                                inq.status === st
                                  ? 'bg-[#141D42] text-white'
                                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {st}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <form
              onSubmit={handleCreateGallery}
              className="max-w-lg space-y-4 p-5 rounded-xl border border-slate-200 bg-slate-50/70"
            >
              <h3 className="font-display text-base font-bold text-slate-900">
                Add New Gallery Showcase
              </h3>
              <div>
                <label
                  htmlFor="gal-title"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Photo Caption
                </label>
                <input
                  id="gal-title"
                  type="text"
                  value={galTitle}
                  onChange={(e) => setGalTitle(e.target.value)}
                  placeholder="e.g. Mainstage Laser Finale"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="gal-venue"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Venue & City
                </label>
                <input
                  id="gal-venue"
                  type="text"
                  value={galVenue}
                  onChange={(e) => setGalVenue(e.target.value)}
                  placeholder="e.g. ICCB Hall 4, Dhaka"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="gal-category"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="gal-category"
                    value={galCategory}
                    onChange={(e) => setGalCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="gal-asset"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Image Asset
                  </label>
                  <select
                    id="gal-asset"
                    value={galImageKey}
                    onChange={(e) => setGalImageKey(e.target.value as AssetKey)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                  >
                    {ASSET_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={savingGallery}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#4B93FF] hover:bg-[#3582F6] rounded-lg cursor-pointer"
              >
                {savingGallery ? 'Adding...' : 'Add to Gallery'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
