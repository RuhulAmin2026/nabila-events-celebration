import banquetBallroomImg from '../assets/images/banquet-hall.jpg';
import concertLaserImg from '../assets/images/stage-lasers.jpg';
import conferenceKeynoteImg from '../assets/images/conference-hall.jpg';
import planningTabletImg from '../assets/images/planning-desk.jpg';
import goldenFestivalImg from '../assets/images/sunset-festival.jpg';
import networkingGuestsImg from '../assets/images/networking-mixer.jpg';
import outdoorGalaImg from '../assets/images/garden-gala.jpg';
import pavilionEveningImg from '../assets/images/waterfront-pavilion.jpg';
import pinkStageImg from '../assets/images/live-band.jpg';
import type { AssetKey } from '../shared/types';

export const EVENT_ASSET_MAP: Record<AssetKey, string> = {
  concert_laser_crowd: concertLaserImg,
  pink_stage_performers: pinkStageImg,
  outdoor_gala_lights: outdoorGalaImg,
  conference_keynote_audience: conferenceKeynoteImg,
  networking_cocktail_guests: networkingGuestsImg,
  banquet_wedding_ballroom: banquetBallroomImg,
  event_planning_tablet: planningTabletImg,
  pavilion_evening_lights: pavilionEveningImg,
  golden_festival_stage: goldenFestivalImg,
};

export const ASSET_OPTIONS: { key: AssetKey; label: string }[] = [
  { key: 'concert_laser_crowd', label: 'Concert Laser Arena' },
  { key: 'pink_stage_performers', label: 'Mainstage Live Performers' },
  { key: 'outdoor_gala_lights', label: 'Outdoor Garden Gala' },
  { key: 'conference_keynote_audience', label: 'Keynote Conference Hall' },
  { key: 'networking_cocktail_guests', label: 'Executive Networking Mixer' },
  { key: 'banquet_wedding_ballroom', label: 'Grand Banquet Ballroom' },
  { key: 'pavilion_evening_lights', label: 'Waterfront Glass Pavilion' },
  { key: 'golden_festival_stage', label: 'Golden Sunset Festival' },
  { key: 'event_planning_tablet', label: 'Production Schedule Tablet' },
];

export function resolveEventImage(
  imageKey: AssetKey,
  customImageUrl?: string,
): string {
  if (customImageUrl && customImageUrl.trim().length > 0) {
    return customImageUrl.trim();
  }
  return EVENT_ASSET_MAP[imageKey] ?? concertLaserImg;
}
