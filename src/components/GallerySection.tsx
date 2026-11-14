import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { filterGalleryItems } from '../shared/eventLogic';
import type { EventCategory, GalleryItem } from '../shared/types';
import { EventImage } from './EventImage';

interface GallerySectionProps {
  items: GalleryItem[];
  externalPreview?: { title: string; imageKey: GalleryItem['imageKey'] } | null;
  onCloseExternalPreview?: () => void;
}

const CATEGORIES: (EventCategory | 'All')[] = [
  'All',
  'Concert',
  'Corporate',
  'Gala',
  'Festival',
  'Conference',
];

export function GallerySection({
  items,
  externalPreview,
  onCloseExternalPreview,
}: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'All'>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered = filterGalleryItems(items, activeCategory);
  const useMasonrySignature = activeCategory === 'All' && filtered.length >= 8;

  const activeItem = selectedIndex !== null ? filtered[selectedIndex] : null;

  return (
    <section id="gallery" className="bg-white py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Gallery
          </h2>

          <div
            role="tablist"
            aria-label="Filter gallery by event category"
            className="mt-6 inline-flex flex-wrap items-center justify-center gap-1 p-1 bg-slate-100 rounded-lg"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                role="tab"
                type="button"
                aria-selected={activeCategory === category}
                onClick={() => {
                  setActiveCategory(category);
                  setSelectedIndex(null);
                }}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF] ${
                  activeCategory === category
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 py-16 text-center border border-slate-200 rounded-2xl bg-slate-50">
            <p className="text-sm text-slate-600">
              No gallery moments recorded in this category yet.
            </p>
          </div>
        ) : useMasonrySignature ? (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 items-stretch">
            <button
              type="button"
              onClick={() => setSelectedIndex(0)}
              aria-label={`Open ${filtered[0].title}`}
              className="group relative col-span-2 md:col-span-1 h-72 md:h-[460px] rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
            >
              <EventImage
                imageKey={filtered[0].imageKey}
                customImageUrl={filtered[0].customImageUrl}
                alt={filtered[0].title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <GalleryHoverCaption item={filtered[0]} />
            </button>

            <div className="flex flex-col gap-3 sm:gap-4 h-72 md:h-[460px]">
              {[filtered[1], filtered[2]].map((item, offset) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIndex(1 + offset)}
                  aria-label={`Open ${item.title}`}
                  className="group relative flex-1 rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
                >
                  <EventImage
                    imageKey={item.imageKey}
                    customImageUrl={item.customImageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <GalleryHoverCaption item={item} />
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 h-72 md:h-[460px]">
              <button
                type="button"
                onClick={() => setSelectedIndex(7)}
                aria-label={`Open ${filtered[7].title}`}
                className="group relative h-[34%] rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
              >
                <EventImage
                  imageKey={filtered[7].imageKey}
                  customImageUrl={filtered[7].customImageUrl}
                  alt={filtered[7].title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <GalleryHoverCaption item={filtered[7]} />
              </button>
              <button
                type="button"
                onClick={() => setSelectedIndex(3)}
                aria-label={`Open ${filtered[3].title}`}
                className="group relative flex-1 rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
              >
                <EventImage
                  imageKey={filtered[3].imageKey}
                  customImageUrl={filtered[3].customImageUrl}
                  alt={filtered[3].title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <GalleryHoverCaption item={filtered[3]} />
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 h-72 md:h-[460px]">
              <button
                type="button"
                onClick={() => setSelectedIndex(4)}
                aria-label={`Open ${filtered[4].title}`}
                className="group relative flex-1 rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
              >
                <EventImage
                  imageKey={filtered[4].imageKey}
                  customImageUrl={filtered[4].customImageUrl}
                  alt={filtered[4].title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <GalleryHoverCaption item={filtered[4]} />
              </button>
              <button
                type="button"
                onClick={() => setSelectedIndex(6)}
                aria-label={`Open ${filtered[6].title}`}
                className="group relative h-[32%] rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
              >
                <EventImage
                  imageKey={filtered[6].imageKey}
                  customImageUrl={filtered[6].customImageUrl}
                  alt={filtered[6].title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <GalleryHoverCaption item={filtered[6]} />
              </button>
            </div>

            <div className="col-span-2 md:col-span-1 grid grid-cols-2 md:flex md:flex-col gap-3 sm:gap-4 h-44 md:h-[460px]">
              <button
                type="button"
                onClick={() => setSelectedIndex(0)}
                aria-label={`Open ${filtered[0].title} stage lighting`}
                className="group relative md:h-[42%] rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
              >
                <EventImage
                  imageKey="concert_laser_crowd"
                  alt="Laser stage haze"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
              <button
                type="button"
                onClick={() => setSelectedIndex(5)}
                aria-label={`Open ${filtered[5].title}`}
                className="group relative md:flex-1 rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
              >
                <EventImage
                  imageKey={filtered[5].imageKey}
                  customImageUrl={filtered[5].customImageUrl}
                  alt={filtered[5].title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <GalleryHoverCaption item={filtered[5]} />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Open ${item.title}`}
                className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
              >
                <EventImage
                  imageKey={item.imageKey}
                  customImageUrl={item.customImageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <GalleryHoverCaption item={item} />
              </button>
            ))}
          </div>
        )}
      </div>

      {activeItem && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#090D1D] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close gallery lightbox"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-[55vh] sm:h-[65vh] bg-black">
              <EventImage
                imageKey={activeItem.imageKey}
                customImageUrl={activeItem.customImageUrl}
                alt={activeItem.title}
                className="w-full h-full object-contain"
              />

              {filtered.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() =>
                      setSelectedIndex((selectedIndex - 1 + filtered.length) % filtered.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/65 text-white hover:bg-black cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => setSelectedIndex((selectedIndex + 1) % filtered.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/65 text-white hover:bg-black cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
              <div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {activeItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {activeItem.category} <span aria-hidden="true">·</span> {activeItem.venue}
                </p>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-400">
                {selectedIndex + 1} / {filtered.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {externalPreview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={externalPreview.title}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onCloseExternalPreview}
        >
          <div
            className="relative max-w-3xl w-full bg-[#090D1D] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close photo preview"
              onClick={onCloseExternalPreview}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-[60vh] bg-black">
              <EventImage
                imageKey={externalPreview.imageKey}
                alt={externalPreview.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="px-6 py-4 border-t border-white/10">
              <h3 className="font-display text-lg font-semibold text-white">
                {externalPreview.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Nabila Events Celebration Live Production Highlight
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function GalleryHoverCaption({ item }: { item: GalleryItem }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4 text-left">
      <p className="text-sm font-semibold text-white leading-snug">{item.title}</p>
      <p className="text-xs text-slate-300 mt-0.5">
        {item.category} · {item.venue}
      </p>
    </div>
  );
}
