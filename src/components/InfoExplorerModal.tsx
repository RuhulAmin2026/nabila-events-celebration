import { useState } from 'react';
import { CheckSquare, Square, X } from 'lucide-react';
import type { ExperienceItem, ResourceItem } from '../shared/types';

export type ExplorerTab = 'experiences' | 'resources' | 'workflow';

interface InfoExplorerModalProps {
  activeTab: ExplorerTab | null;
  experiences: ExperienceItem[];
  resources: ResourceItem[];
  onClose: () => void;
  onSelectTab: (tab: ExplorerTab) => void;
  onBookPackage: (packageName: string) => void;
}

const WORKFLOW_STEPS = [
  {
    step: '01. Discovery & Site Survey',
    detail:
      'We inspect venue acoustics, rigging points, power tie-ins, and guest flow within 48 hours of booking.',
  },
  {
    step: '02. Stage CAD & AV Engineering',
    detail:
      'Receive 3D lighting plots, LED wall aspect specs, and redundant audio signal routing diagrams for sign-off.',
  },
  {
    step: '03. Crew Dispatch & Rehearsal',
    detail:
      'Certified lighting directors, FOH audio engineers, and stage managers execute load-in and T-1 full-dress cue runs.',
  },
  {
    step: '04. Live Show & Post-Event Wrap',
    detail:
      'Real-time show calling from doors open through strike, followed by broadcast archive delivery.',
  },
];

export function InfoExplorerModal({
  activeTab,
  experiences,
  resources,
  onClose,
  onSelectTab,
  onBookPackage,
}: InfoExplorerModalProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!activeTab) return null;

  function toggleChecklist(id: string) {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nabila Events Celebration Production Explorer"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[88vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(
              [
                { id: 'experiences', label: 'Experiences' },
                { id: 'resources', label: 'Resources' },
                { id: 'workflow', label: 'What to do' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Close production explorer"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'experiences' && (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs font-medium text-[#4B93FF]">
                      {exp.turnaround}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold text-slate-900">
                      {exp.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{exp.subtitle}</p>
                    <ul className="mt-3 space-y-1.5">
                      {exp.deliverables.map((d) => (
                        <li key={d} className="text-xs sm:text-sm text-slate-700">
                          · {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBookPackage(exp.title);
                    }}
                    className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#4B93FF] hover:bg-[#3582F6] rounded-lg whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
                  >
                    Request Package
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-5">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/70"
                >
                  <p className="text-xs text-slate-500">{res.format}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-slate-900">
                    {res.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600">{res.description}</p>
                  <div className="mt-4 space-y-2">
                    {res.checklist.map((item, idx) => {
                      const key = `${res.id}-${idx}`;
                      const checked = Boolean(checkedItems[key]);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleChecklist(key)}
                          className="w-full text-left flex items-start gap-2.5 text-sm text-slate-800 hover:text-slate-950 cursor-pointer"
                        >
                          {checked ? (
                            <CheckSquare className="w-4 h-4 text-[#4B93FF] shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <span className={checked ? 'line-through text-slate-400' : ''}>
                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-4">
              {WORKFLOW_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="p-5 rounded-xl border border-slate-200 bg-white"
                >
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {item.step}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBookPackage('Full-Service Event Production');
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#141D42] hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Start Your Event Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
