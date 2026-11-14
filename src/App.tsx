import { useEffect, useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { ContactAndFooter } from './components/ContactAndFooter';
import { GallerySection } from './components/GallerySection';
import { HeroSection } from './components/HeroSection';
import { InfoExplorerModal, type ExplorerTab } from './components/InfoExplorerModal';
import { Navbar } from './components/Navbar';
import { OrganizerDashboardModal } from './components/OrganizerDashboardModal';
import { PartnersAndExperiences } from './components/PartnersAndExperiences';
import { PastEventsSection } from './components/PastEventsSection';
import { ResourcesAndWorkflow } from './components/ResourcesAndWorkflow';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { fetchCurrentUser, fetchSiteData } from './lib/api';
import type {
  AssetKey,
  AuthUser,
  EventItem,
  ExperienceItem,
  GalleryItem,
  ResourceItem,
} from './shared/types';

export default function App() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [explorerTab, setExplorerTab] = useState<ExplorerTab | null>(null);
  const [heroPreview, setHeroPreview] = useState<{
    imageKey: AssetKey;
    title: string;
  } | null>(null);
  const [prefillMessage, setPrefillMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [siteRes, authRes] = await Promise.all([
          fetchSiteData(),
          fetchCurrentUser().catch(() => ({ user: null })),
        ]);
        if (!active) return;
        setEvents(siteRes.events);
        setGallery(siteRes.gallery);
        setExperiences(siteRes.experiences);
        setResources(siteRes.resources);
        setUser(authRes.user);
      } catch (err) {
        if (!active) return;
        setLoadError((err as Error).message || 'Failed to load site data.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  function scrollToContactWithMessage(topic: string) {
    setPrefillMessage(`Interested in planning an event similar to "${topic}". Please share availability and production pricing.`);
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setDashboardOpen(true)}
      />

      <main className="flex-1">
        {loadError && (
          <div
            role="alert"
            className="bg-red-50 border-b border-red-200 px-4 py-3 text-center text-sm text-red-800"
          >
            {loadError}
          </div>
        )}

        <HeroSection
          onKnowMore={() => setExplorerTab('experiences')}
          onSelectHeroPhoto={(imageKey, title) => setHeroPreview({ imageKey, title })}
        />

        <PartnersAndExperiences
          onExploreExperiences={() => setExplorerTab('experiences')}
        />

        <ResourcesAndWorkflow
          onExploreResources={() => setExplorerTab('resources')}
          onExploreWorkflow={() => setExplorerTab('workflow')}
        />

        {loading && gallery.length === 0 ? (
          <section className="bg-white py-20 text-center text-sm text-slate-500">
            Loading gallery &amp; past events...
          </section>
        ) : (
          <>
            <GallerySection
              items={gallery}
              externalPreview={heroPreview}
              onCloseExternalPreview={() => setHeroPreview(null)}
            />

            <WhyChooseUsSection />

            <PastEventsSection
              events={events}
              onRequestSimilarEvent={scrollToContactWithMessage}
            />
          </>
        )}
      </main>

      <ContactAndFooter
        prefillMessage={prefillMessage}
        onInquiryCreated={() => {}}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setDashboardOpen(true)}
        isAuthenticated={Boolean(user)}
      />

      <InfoExplorerModal
        activeTab={explorerTab}
        experiences={experiences}
        resources={resources}
        onClose={() => setExplorerTab(null)}
        onSelectTab={setExplorerTab}
        onBookPackage={scrollToContactWithMessage}
      />

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={(loggedInUser) => {
          setUser(loggedInUser);
          setDashboardOpen(true);
        }}
      />

      <OrganizerDashboardModal
        open={dashboardOpen}
        user={user}
        events={events}
        onClose={() => setDashboardOpen(false)}
        onEventCreated={(newEvent) => setEvents((prev) => [newEvent, ...prev])}
        onEventDeleted={(id) =>
          setEvents((prev) => prev.filter((item) => item.id !== id))
        }
        onGalleryCreated={(newItem) => setGallery((prev) => [newItem, ...prev])}
        onSignedOut={() => setUser(null)}
      />
    </div>
  );
}
