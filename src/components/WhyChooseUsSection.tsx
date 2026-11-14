import { EventImage } from './EventImage';

export function WhyChooseUsSection() {
  return (
    <section id="why-us" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
        <div className="relative min-h-[340px] lg:min-h-[440px] bg-slate-900 overflow-hidden">
          <EventImage
            imageKey="outdoor_gala_lights"
            alt="Guests celebrating beneath twilight garden canopy lights"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-black text-white flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 py-16 lg:py-20 text-center">
          <div className="max-w-md">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Why Choose us?
            </h2>
            <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed">
              Every stage cue, acoustic check, and hospitality touchpoint is managed by one
              dedicated production crew. We combine redundant AV engineering with calm
              on-site execution so your team can focus completely on your guests.
            </p>

            <div className="mt-8 pt-7 border-t border-white/15 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-display text-2xl font-bold tabular-nums text-white">
                  250+
                </p>
                <p className="mt-1 text-xs text-slate-400">Events Produced</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold tabular-nums text-white">
                  99.4%
                </p>
                <p className="mt-1 text-xs text-slate-400">On-Cue Precision</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold tabular-nums text-white">
                  24/7
                </p>
                <p className="mt-1 text-xs text-slate-400">Production Desk</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
