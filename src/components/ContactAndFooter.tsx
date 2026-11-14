import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { submitInquiry } from '../lib/api';
import { validateInquiryInput } from '../shared/eventLogic';
import type { InquiryItem } from '../shared/types';

interface ContactAndFooterProps {
  prefillMessage?: string;
  onInquiryCreated: (inquiry: InquiryItem) => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  isAuthenticated: boolean;
}

export function ContactAndFooter({
  prefillMessage,
  onInquiryCreated,
  onOpenAuth,
  onOpenDashboard,
  isAuthenticated,
}: ContactAndFooterProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<InquiryItem | null>(null);

  useEffect(() => {
    if (prefillMessage) {
      setMessage(prefillMessage);
    }
  }, [prefillMessage]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    const validation = validateInquiryInput({ name, phone, message });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const { inquiry } = await submitInquiry({ name, phone, message });
      setSubmittedTicket(inquiry);
      onInquiryCreated(inquiry);
      setName('');
      setPhone('');
      setMessage('');
    } catch (err) {
      const typed = err as Error & { errors?: Record<string, string> };
      if (typed.errors) {
        setErrors(typed.errors);
      } else {
        setServerError(typed.message || 'Unable to submit your inquiry right now.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="contact" className="relative bg-white pt-10">
      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-[0_22px_60px_rgba(15,23,42,0.14)] border border-slate-100 p-6 sm:p-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Contact Us
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            We&apos;ll respond to your query within one business day.
          </p>

          {submittedTicket && (
            <div
              role="status"
              className="mt-5 p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3"
            >
              <CheckCircle2
                className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="text-xs sm:text-sm text-emerald-950">
                <p className="font-semibold">
                  Inquiry received — Reference {submittedTicket.ticketCode}
                </p>
                <p className="mt-0.5 text-emerald-800">
                  Saved to backend queue. Our production desk will contact{' '}
                  <span className="font-medium">{submittedTicket.phone}</span> shortly.
                </p>
              </div>
            </div>
          )}

          {serverError && (
            <div
              role="alert"
              className="mt-5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold text-slate-900 mb-1.5"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 bg-[#080B12] border border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B93FF]"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="block text-xs font-semibold text-slate-900 mb-1.5"
                >
                  Phone
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 bg-[#080B12] border border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B93FF]"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-semibold text-slate-900 mb-1.5"
              >
                How can we help?
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your event date, guest count, and production goals"
                className="w-full px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 bg-[#080B12] border border-slate-800 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-[#4B93FF]"
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-600">{errors.message}</p>
              )}
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-10 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#080B12] hover:bg-slate-800 disabled:opacity-60 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B93FF]"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                <span>{submitting ? 'Sending...' : 'Send to us!'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="bg-black text-white -mt-36 pt-48 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <a
              href="#top"
              aria-label="Nabila Events Celebration"
              className="inline-flex items-center bg-white rounded-xl px-3.5 py-2 shadow-sm"
            >
              <img
                src="/assets/aistudio/Nabila_Events_Celebration_Logo_e40d021a.png"
                alt="Nabila Events Celebration"
                className="h-11 sm:h-12 w-auto object-contain"
              />
            </a>
            <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs">
              Nabila Events Celebration is a full-service live production studio delivering
              concerts, corporate summits, and hospitality galas worldwide.
            </p>
            <p className="mt-6 text-xs text-slate-500">
              © 2026 Nabila Events Celebration. All rights reserved.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs sm:text-sm">
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2.5 text-slate-400">
                <li>
                  <a href="#experiences" className="hover:text-white transition-colors">
                    Corporate Summits
                  </a>
                </li>
                <li>
                  <a href="#experiences" className="hover:text-white transition-colors">
                    Live Concerts
                  </a>
                </li>
                <li>
                  <a href="#experiences" className="hover:text-white transition-colors">
                    Luxury Galas
                  </a>
                </li>
                <li>
                  <a href="#resources" className="hover:text-white transition-colors">
                    AV Engineering
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Explore</h3>
              <ul className="space-y-2.5 text-slate-400">
                <li>
                  <a href="#gallery" className="hover:text-white transition-colors">
                    Event Gallery
                  </a>
                </li>
                <li>
                  <a href="#past-events" className="hover:text-white transition-colors">
                    Past Events
                  </a>
                </li>
                <li>
                  <a href="#why-us" className="hover:text-white transition-colors">
                    Why Choose Us
                  </a>
                </li>
                <li>
                  <a href="#resources" className="hover:text-white transition-colors">
                    Production Guides
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Organizer Portal</h3>
              <ul className="space-y-2.5 text-slate-400">
                <li>
                  <button
                    type="button"
                    onClick={isAuthenticated ? onOpenDashboard : onOpenAuth}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {isAuthenticated ? 'Open Admin Panel' : 'Organizer Sign In'}
                  </button>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Book Consultation
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
