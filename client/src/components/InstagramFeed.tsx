/*
 * Instagram Feed Component — 4B Design
 * Displays a curated grid of recent WSC Instagram posts using oEmbed iframes
 * Falls back to a visual grid linking to the Instagram profile
 */
import { useState } from "react";
import { Instagram, ExternalLink, Heart, MessageCircle } from "lucide-react";

interface InstaPost {
  id: string;
  url: string;
  caption: string;
  type: "image" | "reel";
  thumbnail: string;
  likes?: string;
  date: string;
}

const POSTS: InstaPost[] = [
  {
    id: "1",
    url: "https://www.instagram.com/reel/DMdnKqVhvlp/",
    caption: "This club has it all. Welcome to Woodinville Sports Club — 67 acres of tennis, golf, fitness, and pickleball.",
    type: "reel",
    thumbnail: "/images/wsc/campus-dome.webp",
    likes: "142",
    date: "Mar 2026",
  },
  {
    id: "2",
    url: "https://www.instagram.com/p/DVUAJfyErsA/",
    caption: "The range is open to the public daily, with covered bays, free Toptracer, grass tees, and a 2.5-acre short-game practice area.",
    type: "image",
    thumbnail: "/images/wsc/golf-practice-area.webp",
    likes: "87",
    date: "Feb 2026",
  },
  {
    id: "3",
    url: "https://www.instagram.com/p/DUwoAj-jmb3/",
    caption: "Our first Tier 1 Women's Golf Clinic is in the books! Great turnout and even better swings.",
    type: "image",
    thumbnail: "/images/wsc/golf-practice-area.webp",
    likes: "33",
    date: "Feb 2026",
  },
  {
    id: "4",
    url: "https://www.instagram.com/p/DU4OMwDkl_E/",
    caption: "Welcome Stella Kim to the WSC golf family! Stella is a certified LPGA Teaching Professional with nearly a decade of experience.",
    type: "image",
    thumbnail: "/images/wsc/golf-range-aerial.webp",
    likes: "56",
    date: "Feb 2026",
  },
  {
    id: "5",
    url: "https://www.instagram.com/p/DS3g2B2Fu1p/",
    caption: "Four state-of-the-art indoor golf simulators are arriving at WSC — just in time for the launch of our Tier 1 Junior Golf Academy.",
    type: "image",
    thumbnail: "/images/wsc/swing-lab-simulators.webp",
    likes: "94",
    date: "Jan 2026",
  },
  {
    id: "6",
    url: "https://www.instagram.com/p/DPm-xfbElqx/",
    caption: "WSC's Tier 1 Coach Filipp traveled with Daniel Malacek to the ITF J200 Corpus Christi Tournament.",
    type: "image",
    thumbnail: "/images/wsc/tennis-player.webp",
    likes: "71",
    date: "Jan 2026",
  },
  {
    id: "7",
    url: "https://www.instagram.com/p/DVPyb55Dclm/",
    caption: "All-Access memberships include gym and fitness access, court and range privileges, class registration access, sauna, and locker rooms.",
    type: "image",
    thumbnail: "/images/wsc/apl-training.webp",
    likes: "45",
    date: "Feb 2026",
  },
  {
    id: "8",
    url: "https://www.instagram.com/p/DVOo-q-EgdB/",
    caption: "Summer 2026 registration is open for Tennis, Golf, and Adventure Club programs across the 9-week summer session.",
    type: "image",
    thumbnail: "/images/wsc/summer-camp.webp",
    likes: "62",
    date: "Feb 2026",
  },
];

export default function InstagramFeed() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[3px]">
      {POSTS.map((post) => (
        <a
          key={post.id}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group aspect-square overflow-hidden bg-parchment-mid block no-underline"
          onMouseEnter={() => setHoveredId(post.id)}
          onMouseLeave={() => setHoveredId(null)}
          aria-label={`Instagram post: ${post.caption.substring(0, 80)}${post.caption.length > 80 ? '...' : ''}`}
        >
          {/* Thumbnail */}
          <img
            src={post.thumbnail}
            alt={post.caption}
            width={1800}
            height={1200}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ filter: "saturate(0.85) brightness(0.95)" }}
            loading="lazy"
          />

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-dark-bg/70 flex flex-col items-center justify-center p-4 transition-opacity duration-300 ${
              hoveredId === post.id ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Stats */}
            <div className="flex items-center gap-5 mb-4">
              {post.likes && (
                <div className="flex items-center gap-1.5">
                  <Heart size={14} className="text-parchment" fill="currentColor" />
                  <span className="text-parchment text-[13px] font-light">{post.likes}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <MessageCircle size={14} className="text-parchment" />
                <span className="text-parchment text-[13px] font-light">View</span>
              </div>
            </div>

            {/* Caption preview */}
            <p className="text-parchment/75 text-[11px] leading-[1.6] text-center line-clamp-3 max-w-[200px]">
              {post.caption}
            </p>

            {/* Type badge */}
            {post.type === "reel" && (
              <div className="absolute top-3 right-3 bg-volt-bright text-dark-bg text-[9px] tracking-[0.12em] uppercase px-2 py-0.5">
                Reel
              </div>
            )}

            {/* Instagram icon */}
            <div className="absolute bottom-3 right-3">
              <Instagram size={14} className="text-parchment/75" />
            </div>
          </div>

          {/* Date badge (always visible) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-bg/50 to-transparent px-3 py-2 group-hover:opacity-0 transition-opacity duration-300">
            <p className="text-parchment/70 text-[10px] tracking-[0.1em] uppercase">{post.date}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
