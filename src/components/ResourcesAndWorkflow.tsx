import { ArrowRight } from 'lucide-react';
import { EventImage } from './EventImage';

interface ResourcesAndWorkflowProps {
  onExploreResources: () => void;
  onExploreWorkflow: () => void;
}

export function ResourcesAndWorkflow({
  onExploreResources,
  onExploreWorkflow,
}: ResourcesAndWorkflowProps) {
  return (
    <section id="resources" className="bg-black text-white py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex justify-center md:justify-start">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden ring-1 ring-white/15 shadow-2xl">
              <EventImage
                imageKey="event_planning_tablet"
                alt="Event producer reviewing floorplan and schedule on tablet"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Resources
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
              Access venue blueprints, production timelines, AV technical riders, and live
              run-of-show playbooks so every vendor and stakeholder stays aligned from
              load-in to strike.
            </p>
            <button
              type="button"
              onClick={onExploreResources}
              className="mt-7 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#4B93FF] hover:bg-[#3582F6] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Know More</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          id="workflow"
          className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          <div className="order-2 md:order-1">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              What to do
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
              Select your event format, lock in certified lighting and sound crews, and track
              every milestone from site survey to showtime in one coordinated production
              workflow.
            </p>
            <button
              type="button"
              onClick={onExploreWorkflow}
              className="mt-7 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#4B93FF] hover:bg-[#3582F6] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Know More</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden ring-1 ring-white/15 shadow-2xl">
              <EventImage
                imageKey="conference_keynote_audience"
                alt="Packed auditorium watching keynote presentation on wide LED stage"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
