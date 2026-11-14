import { ArrowRight } from 'lucide-react';
import { EventImage } from './EventImage';

interface PartnersAndExperiencesProps {
  onExploreExperiences: () => void;
}

const PARTNERS = [
  { name: 'MERIDIAN', subtitle: 'GLOBAL' },
  { name: 'DaVita', subtitle: 'LIVE' },
  { name: 'P&G', subtitle: 'EVENTS' },
  { name: 'RedWave', subtitle: 'AUDIO' },
  { name: 'Modis', subtitle: 'SUMMITS' },
  { name: 'ADP', subtitle: 'FORUM' },
];

export function PartnersAndExperiences({
  onExploreExperiences,
}: PartnersAndExperiencesProps) {
  return (
    <>
      <section className="bg-white py-12 sm:py-16 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Our Partners
          </h2>
          <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center">
            {PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex flex-col items-center justify-center py-2 text-slate-700 hover:text-[#1E40AF] transition-colors"
              >
                <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight leading-none">
                  {partner.name}
                </span>
                <span className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-slate-400">
                  {partner.subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="experiences"
        className="relative overflow-hidden bg-white py-16 sm:py-24"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 260 400"
          className="pointer-events-none hidden md:block absolute left-0 bottom-0 w-44 h-64 text-slate-200/80"
          fill="none"
        >
          {[40, 70, 100, 130, 160, 190, 220].map((r) => (
            <circle
              key={r}
              cx="0"
              cy="280"
              r={r}
              stroke="currentColor"
              strokeWidth="1.2"
            />
          ))}
        </svg>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Experiences
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed max-w-md">
              Interactive stage production, spatial audio engineering, hybrid live-streaming,
              and curated guest hospitality built to turn every gathering into a lasting
              moment.
            </p>
            <button
              type="button"
              onClick={onExploreExperiences}
              className="mt-7 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#4B93FF] hover:bg-[#3582F6] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]"
            >
              <span>Know More</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-lg ring-1 ring-slate-200">
              <EventImage
                imageKey="networking_cocktail_guests"
                alt="Guests networking at an upscale corporate cocktail experience"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
