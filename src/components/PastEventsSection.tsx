import { useState } from 'react';
import { ArrowRight, Calendar, MapPin, Search, Users, X } from 'lucide-react';
import { filterEvents, formatGuestCount } from '../shared/eventLogic';
import type { EventCategory, EventItem } from '../shared/types';
import { EventImage } from './EventImage';

interface PastEventsSectionProps {
  events: EventItem[];
  onRequestSimilarEvent: (eventTitle: string) => void;
}

const ARCHIVE_CATEGORIES: (EventCategory | 'All')[] = [
  'All',
  'Concert',
  'Corporate',
  'Gala',
  'Festival',
  'Conference',
];

export function PastEventsSection({
  events,
  onRequestSimilarEvent,
}: PastEventsSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'All'>('All');

  const featuredEvent = events.find((e) => e.featured) ?? events[0];
  const secondaryCards = events.filter((e) => e.id !== featuredEvent?.id).slice(0, 3);
  const filteredArchive = filterEvents(events, searchQuery, categoryFilter);

  return (
    <section id="past-events" className="bg-white py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#141D42]">
            Past Events
          </h2>

          <button
            type="button"
            onClick={() => setArchiveOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#4B93FF] hover:bg-[#3582F6] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]"
          >
            <span>SEE ALL</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {featuredEvent && (
            <div className="relative rounded-xl overflow-hidden min-h-[340px] flex flex-col justify-end shadow-md group">
              <EventImage
                imageKey={featuredEvent.imageKey}
                customImageUrl={featuredEvent.customImageUrl}
                alt={featuredEvent.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/10"
              />
              <div className="relative z-10 p-5 text-center">
                <p className="text-xs font-medium text-slate-200">
                  {featuredEvent.category} · {featuredEvent.location}
                </p>
                <h3 className="mt-1 font-display text-base font-bold text-white leading-snug">
                  {featuredEvent.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(featuredEvent)}
                  className="mt-4 w-full py-2.5 px-4 text-xs font-semibold tracking-wide text-white bg-[#4B93FF] hover:bg-[#3582F6] rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  VIEW MORE
                </button>
              </div>
            </div>
          )}

          {secondaryCards.map((event) => (
            <article
              key={event.id}
              className="flex flex-col justify-between bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="h-48 w-full overflow-hidden bg-slate-100">
                  <EventImage
                    imageKey={event.imageKey}
                    customImageUrl={event.customImageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                    {event.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 tabular-nums">
                    {event.location} <span aria-hidden="true">·</span>{' '}
                    {formatGuestCount(event.guests)} Guests
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className="w-full py-2.5 px-4 text-xs font-semibold tracking-wide text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-400 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
                >
                  KNOW MORE
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedEvent.title}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close event details"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-64 w-full bg-slate-900">
              <EventImage
                imageKey={selectedEvent.imageKey}
                customImageUrl={selectedEvent.customImageUrl}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold text-[#4B93FF]">
                {selectedEvent.category} Case Study
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold text-slate-900">
                {selectedEvent.title}
              </h3>

              <div className="mt-4 flex flex-wrap gap-5 text-xs sm:text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  {selectedEvent.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  {selectedEvent.location}
                </span>
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <Users className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  {formatGuestCount(selectedEvent.guests)} Guests
                </span>
              </div>

              <p className="mt-5 text-sm sm:text-base text-slate-700 leading-relaxed">
                {selectedEvent.summary}
              </p>

              {selectedEvent.highlights.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Production Deliverables
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {selectedEvent.highlights.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-slate-800 flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4B93FF] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = selectedEvent.title;
                    setSelectedEvent(null);
                    onRequestSimilarEvent(title);
                  }}
                  className="px-5 py-2 text-sm font-medium text-white bg-[#4B93FF] hover:bg-[#3582F6] rounded-lg cursor-pointer"
                >
                  Plan a Similar Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {archiveOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="All Past Events Archive"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setArchiveOpen(false)}
        >
          <div
            className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[88vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  All Produced Events
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                  {filteredArchive.length} events matching your filter
                </p>
              </div>
              <button
                type="button"
                aria-label="Close events archive"
                onClick={() => setArchiveOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search event title or city..."
                  aria-label="Search past events"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B93FF]"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {ARCHIVE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                      categoryFilter === cat
                        ? 'bg-[#141D42] text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArchive.length === 0 ? (
                <div className="col-span-full py-12 text-center text-sm text-slate-500">
                  No events matched your search criteria.
                </div>
              ) : (
                filteredArchive.map((event) => (
                  <article
                    key={event.id}
                    className="border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between bg-white"
                  >
                    <div>
                      <div className="h-40 bg-slate-100">
                        <EventImage
                          imageKey={event.imageKey}
                          customImageUrl={event.customImageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-[#4B93FF] font-medium">
                          {event.category} · {event.date}
                        </p>
                        <h4 className="mt-1 font-display text-base font-semibold text-slate-900">
                          {event.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500">
                          {event.location} · {formatGuestCount(event.guests)} Guests
                        </p>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setArchiveOpen(false);
                          setSelectedEvent(event);
                        }}
                        className="w-full py-2 text-xs font-semibold text-slate-800 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer"
                      >
                        View Case Study
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
