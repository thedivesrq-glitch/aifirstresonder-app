/**
 * Social Media Platform Guidelines (2025–2026)
 * Kept current with each platform's latest published specs.
 */

export type PlatformId =
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'facebook'
  | 'tiktok'
  | 'threads'
  | 'youtube_shorts';

export type ContentTone =
  | 'professional'
  | 'casual'
  | 'humorous'
  | 'inspirational'
  | 'educational'
  | 'promotional';

export interface MediaSpec {
  maxImages: number;
  maxVideos: number;
  maxVideoLengthSec: number;
  maxFileSizeMB: number;
  recommendedImageAspect: string;
  supportedFormats: string[];
}

export interface PlatformGuideline {
  id: PlatformId;
  name: string;
  color: string;       // Tailwind bg class
  textColor: string;   // Tailwind text class
  icon: string;        // emoji stand-in
  charLimit: number;
  charLimitPremium?: number;
  hashtagLimit: number;
  recommendedHashtags: number;
  linkAllowed: boolean
  linkInBioOnly?: boolean;  // Instagram-style
  media: MediaSpec;
  bestPostTimes: string[];  // e.g. ["Mon 9am", "Wed 12pm"]
  audienceNotes: string;
  contentTips: string[];
  banned: string[];         // Prohibited content categories
}

export const PLATFORMS: Record<PlatformId, PlatformGuideline> = {
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    color: 'bg-black',
    textColor: 'text-white',
    icon: '𝕏',
    charLimit: 280,
    charLimitPremium: 25000,
    hashtagLimit: 30,
    recommendedHashtags: 2,
    linkAllowed: true,
    media: {
      maxImages: 4,
      maxVideos: 1,
      maxVideoLengthSec: 140,
      maxFileSizeMB: 512,
      recommendedImageAspect: '16:9',
      supportedFormats: ['jpg', 'png', 'gif', 'webp', 'mp4', 'mov'],
    },
    bestPostTimes: ['Mon–Fri 8–10 AM', 'Mon–Fri 6–9 PM'],
    audienceNotes: 'News-hungry, tech-savvy, real-time conversation lovers.',
    contentTips: [
      'Lead with the hook in the first 10 words.',
      'Use threads for longer narratives (hook → story → CTA).',
      'Reply to trending topics within the first hour for maximum reach.',
      'Use 1–2 focused hashtags — more hurts impressions.',
      'Alt-text every image for accessibility and SEO.',
      'Videos under 60 s get the highest completion rates.',
    ],
    banned: ['Coordinated inauthentic behavior', 'Synthetic media without disclosure', 'Platform manipulation'],
  },

  instagram: {
    id: 'instagram',
    name: 'Instagram',
    color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
    textColor: 'text-white',
    icon: '📸',
    charLimit: 2200,
    hashtagLimit: 30,
    recommendedHashtags: 8,
    linkAllowed: false,
    linkInBioOnly: true,
    media: {
      maxImages: 10,
      maxVideos: 1,
      maxVideoLengthSec: 90,
      maxFileSizeMB: 1024,
      recommendedImageAspect: '1:1 or 4:5',
      supportedFormats: ['jpg', 'png', 'mp4', 'mov'],
    },
    bestPostTimes: ['Tue–Fri 9 AM–11 AM', 'Mon 6–9 PM'],
    audienceNotes: 'Visual-first, aspirational, lifestyle-driven demographics.',
    contentTips: [
      'First 125 characters show before "more" — make them count.',
      'Use a mix of broad, niche, and branded hashtags.',
      'Reels get 3× more reach than static posts (2026 algorithm).',
      'Carousels boost save and share rates by 2–3×.',
      'Add a CTA in the caption ("Save this post", "Tag a friend").',
      'Stories every day maintain algorithmic visibility.',
      'Direct links only work in bio — use link-in-bio tools.',
    ],
    banned: ['Deceptive filters labeled as real', 'Counterfeit goods promotion', 'Non-consensual intimate imagery'],
  },

  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    color: 'bg-blue-700',
    textColor: 'text-white',
    icon: 'in',
    charLimit: 3000,
    hashtagLimit: 30,
    recommendedHashtags: 3,
    linkAllowed: true,
    media: {
      maxImages: 9,
      maxVideos: 1,
      maxVideoLengthSec: 600,
      maxFileSizeMB: 5120,
      recommendedImageAspect: '1200×627',
      supportedFormats: ['jpg', 'png', 'gif', 'mp4'],
    },
    bestPostTimes: ['Tue–Thu 7:30–8:30 AM', 'Tue–Thu 12 PM', 'Tue–Thu 5–6 PM'],
    audienceNotes: 'Professional growth, B2B, career development, thought leadership.',
    contentTips: [
      'Start with a bold statement or surprising statistic.',
      'Use line breaks generously — walls of text get skipped.',
      'Personal stories outperform pure business content by 40%.',
      'Native video plays autoplay in feed — preferred over YouTube links.',
      'Articles rank in Google; combine short posts with long-form articles.',
      'Tag people sparingly and only when genuinely relevant.',
      'End with an open question to drive comments.',
    ],
    banned: ['Political misinformation', 'Spam job postings', 'Fake credential claims'],
  },

  facebook: {
    id: 'facebook',
    name: 'Facebook',
    color: 'bg-blue-600',
    textColor: 'text-white',
    icon: 'f',
    charLimit: 63206,
    hashtagLimit: 30,
    recommendedHashtags: 3,
    linkAllowed: true,
    media: {
      maxImages: 10,
      maxVideos: 1,
      maxVideoLengthSec: 14400, // 4 hours
      maxFileSizeMB: 10240,
      recommendedImageAspect: '1200×630',
      supportedFormats: ['jpg', 'png', 'gif', 'mp4', 'mov'],
    },
    bestPostTimes: ['Wed–Fri 1–3 PM', 'Mon–Fri 9 AM'],
    audienceNotes: 'Broad 35+ demographic; community groups; local business discovery.',
    contentTips: [
      'Keep organic posts under 250 characters for better reach.',
      'Groups generate 10× more engagement than pages.',
      'Native video gets 4× more engagement than YouTube links.',
      'Use Facebook Events for time-sensitive announcements.',
      'Reels now surface to non-followers — use them for discovery.',
      'Avoid posting links in captions; put them in the first comment.',
    ],
    banned: ['Coordinated inauthentic behavior', 'Voter suppression content', 'Dangerous health misinformation'],
  },

  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    color: 'bg-black',
    textColor: 'text-white',
    icon: '♪',
    charLimit: 2200,
    hashtagLimit: 30,
    recommendedHashtags: 4,
    linkAllowed: false,
    media: {
      maxImages: 35,
      maxVideos: 1,
      maxVideoLengthSec: 600,
      maxFileSizeMB: 287,
      recommendedImageAspect: '9:16',
      supportedFormats: ['mp4', 'mov', 'jpg', 'png'],
    },
    bestPostTimes: ['Tue–Fri 9 AM', 'Tue–Thu 7–9 PM'],
    audienceNotes: 'Gen Z & Millennial, entertainment-first, niche communities.',
    contentTips: [
      'Hook in the first 1–3 seconds or viewers scroll away.',
      'Vertical 9:16 full-screen video performs best.',
      'Trending sounds increase discoverability 2–5×.',
      'Captions with keywords index in TikTok Search.',
      'Duets and Stitches amplify reach through community.',
      'Posting 1–3× daily is the algorithm sweet spot.',
      'Show "behind-the-scenes" — authenticity outperforms polish.',
    ],
    banned: ['Dangerous challenges', 'Minor sexualization', 'Unverified health/diet claims'],
  },

  threads: {
    id: 'threads',
    name: 'Threads',
    color: 'bg-gray-900',
    textColor: 'text-white',
    icon: '@',
    charLimit: 500,
    hashtagLimit: 0,  // Threads does not support hashtags as of 2026
    recommendedHashtags: 0,
    linkAllowed: true,
    media: {
      maxImages: 10,
      maxVideos: 1,
      maxVideoLengthSec: 300,
      maxFileSizeMB: 512,
      recommendedImageAspect: '1:1',
      supportedFormats: ['jpg', 'png', 'gif', 'mp4'],
    },
    bestPostTimes: ['Mon–Fri 9 AM–12 PM'],
    audienceNotes: 'Instagram users seeking text-forward, community conversation.',
    contentTips: [
      'No hashtags — discoverability comes from keywords in the text.',
      'Conversational, low-edit tone performs best.',
      'Reply threads drive organic distribution.',
      'Cross-post Instagram audiences drive Threads growth.',
      'Timely hot-takes and questions outperform polished content.',
    ],
    banned: ['Hate speech', 'Violent content', 'Platform manipulation'],
  },

  youtube_shorts: {
    id: 'youtube_shorts',
    name: 'YouTube Shorts',
    color: 'bg-red-600',
    textColor: 'text-white',
    icon: '▶',
    charLimit: 100,   // Title character limit
    hashtagLimit: 15,
    recommendedHashtags: 3,
    linkAllowed: true,
    media: {
      maxImages: 0,
      maxVideos: 1,
      maxVideoLengthSec: 180,
      maxFileSizeMB: 256,
      recommendedImageAspect: '9:16',
      supportedFormats: ['mp4', 'mov'],
    },
    bestPostTimes: ['Fri–Sat 3–5 PM', 'Mon–Wed 12–3 PM'],
    audienceNotes: 'YouTube subscribers + new discovery via Shorts shelf; all ages.',
    contentTips: [
      'Add #Shorts in title or description for Shorts shelf placement.',
      'Title is the only text shown — make it an irresistible hook.',
      'Loop seamlessly — viewers who rewatch boost ranking.',
      'Subscribe CTAs at the 20–30 s mark outperform end-card CTAs.',
      'Shorts drive long-form video subscribers by 50%+ when linked.',
      'First 24 hours of velocity determine Shorts shelf rotation.',
    ],
    banned: ['Adult content without age gate', 'Spam/misleading metadata', 'Copyright violations'],
  },
};

export const ALL_PLATFORMS = Object.values(PLATFORMS);

export function getPlatform(id: PlatformId): PlatformGuideline {
  return PLATFORMS[id];
}

export function getCharLimit(id: PlatformId): number {
  return PLATFORMS[id].charLimit;
}

export function countChars(text: string): number {
  // Twitter URL shortening: every URL counts as 23 chars
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = text.match(urlRegex) || [];
  let count = text.length;
  urls.forEach((url) => {
    count -= url.length;
    count += 23;
  });
  return count;
}

export function getCharWarning(id: PlatformId, text: string): 'ok' | 'warning' | 'over' {
  const limit = getCharLimit(id);
  const count = id === 'twitter' ? countChars(text) : text.length;
  if (count > limit) return 'over';
  if (count > limit * 0.9) return 'warning';
  return 'ok';
}
