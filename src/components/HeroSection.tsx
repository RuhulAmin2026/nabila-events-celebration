import type { AssetKey } from '../shared/types';
import { EventImage } from './EventImage';

interface HeroSectionProps {
  onKnowMore: () => void;
  onSelectHeroPhoto: (imageKey: AssetKey, title: string) => void;
}

const HERO_CARDS: {
  imageKey: AssetKey;
  title: string;
  heightClass: string;
}[] = [
  {
    imageKey: 'concert_laser_crowd',
    title: 'Volumetric Arena Laser Matrix',
    heightClass: 'h-32 sm:h-40 lg:h-44',
  },
  {
    imageKey: 'pink_stage_performers',
    title: 'Headliner Mainstage Rig',
    heightClass: 'h-48 sm:h-60 lg:h-64',
  },
  {
    imageKey: 'outdoor_gala_lights',
    title: 'Twilight Garden Canopy Gala',
    heightClass: 'h-36 sm:h-44 lg:h-48',
  },
  {
    imageKey: 'golden_festival_stage',
    title: 'Golden Hour Festival Stage',
    heightClass: 'h-44 sm:h-52 lg:h-56',
  },
  {
    imageKey: 'conference_keynote_audience',
    title: 'Executive Keynote Auditorium',
    heightClass: 'h-36 sm:h-44 lg:h-48',
  },
  {
    imageKey: 'pavilion_evening_lights',
    title: 'Waterfront Glass Pavilion Illumination',
    heightClass: 'h-52 sm:h-64 lg:h-72',
  },
];

export function HeroSection({ onKnowMore, onSelectHeroPhoto }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#050816] text-white pt-14 sm:pt-20 pb-0"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(62% 55% at 18% 85%, rgba(128, 22, 68, 0.52) 0%, transparent 70%), radial-gradient(65% 60% at 86% 45%, rgba(19, 64, 148, 0.56) 0%, transparent 72%), linear-gradient(180deg, #040714 0%, #091330 65%, #070B1D 100%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1
          className="font-display font-bold tracking-tight text-white mx-auto max-w-3xl leading-[1.12]"
          style={{
            fontSize: 'clamp(2.1rem, 4.2vw, 3.6rem)',
            textWrap: 'balance',
          }}
        >
          Bringing People Together, One Event at a Time
        </h1>

        <p className="mt-4 sm:mt-5 max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
          From flagship corporate summits and live concerts to private galas, we orchestrate
          end-to-end production, stage design, and guest hospitality.
        </p>

        <div className="mt-7 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onKnowMore}
            className="px-6 py-2.5 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
          >
            Know More
          </button>
          <a
            href="#contact"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
          >
            Learn More
          </a>
        </div>

        <div className="mt-10 sm:mt-14 pb-8 sm:pb-10 grid grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-4 items-end">
          {HERO_CARDS.map((card) => (
            <button
              key={card.imageKey}
              type="button"
              onClick={() => onSelectHeroPhoto(card.imageKey, card.title)}
              aria-label={`Preview ${card.title}`}
              className={`group relative w-full ${card.heightClass} rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/15 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]`}
            >
              <EventImage
                imageKey={card.imageKey}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2.5 text-left">
                <span className="text-[11px] font-medium text-white leading-tight line-clamp-2">
                  {card.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 h-6 bg-black w-full" />
    </section>
  );
}
