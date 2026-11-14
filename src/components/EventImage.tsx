import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { resolveEventImage } from '../data/eventAssets';
import type { AssetKey } from '../shared/types';

interface EventImageProps {
  imageKey: AssetKey;
  customImageUrl?: string;
  alt: string;
  className?: string;
}

export function EventImage({
  imageKey,
  customImageUrl,
  alt,
  className = '',
}: EventImageProps) {
  const [failed, setFailed] = useState(false);
  const src = resolveEventImage(imageKey, customImageUrl);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0B1938] text-slate-300 p-4 text-center ${className}`}
      >
        <Calendar className="w-6 h-6 mb-2 text-[#4B93FF]" aria-hidden="true" />
        <span className="text-xs font-medium line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
