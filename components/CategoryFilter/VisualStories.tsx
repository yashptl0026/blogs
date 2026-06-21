import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface StoryCard {
  id: string;
  title: string;
  location: string;
  image: string;
  slug: string;
  ratio: "wide" | "tall";
}

const MOCK_STORIES: StoryCard[] = [
  {
    id: "story-1",
    title: "Geometry of Silence: Architecture of Kyoto Suburbs",
    location: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
    slug: "nomads-journal-kyoto-wooden-temples",
    ratio: "wide",
  },
  {
    id: "story-2",
    title: "Echoes of Ochre: Mid-Day Shadows in Rajasthan",
    location: "Jodhpur, India",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1200&auto=format&fit=crop",
    slug: "spices-kerala-culinary-expedition",
    ratio: "tall",
  },
];

export default function VisualStories() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-editorial-border pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-widest text-editorial-text">
            Photography Focus
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-editorial-text font-black tracking-tight">
            Visual Stories
          </h2>
        </div>
        <Link
          href="/photography"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-editorial-muted hover:text-editorial-text transition-colors duration-300"
        >
          <span>View Portfolio</span>
          <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </Link>
      </div>

      {/* Asymmetrical Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Story 1 (Wide card, spans 7 columns) */}
        <div className="md:col-span-7 space-y-4 border border-editorial-border p-4 bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-out">
          <Link
            href={`/blog/${MOCK_STORIES[0].slug}`}
            className="block relative w-full h-[35vh] md:h-[45vh] border border-editorial-border overflow-hidden group"
          >
            <Image
              src={MOCK_STORIES[0].image}
              alt={MOCK_STORIES[0].title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-editorial-text/5 group-hover:bg-editorial-text/0 transition-colors duration-500" />
          </Link>
          <div className="space-y-2 text-left pt-2">
            <span className="text-[9px] font-bold tracking-widest text-editorial-muted">
              {MOCK_STORIES[0].location}
            </span>
            <h3 className="font-display text-xl md:text-2xl font-black tracking-tight text-editorial-text">
              <Link href={`/blog/${MOCK_STORIES[0].slug}`} className="hover:text-editorial-muted transition-colors duration-300">
                {MOCK_STORIES[0].title}
              </Link>
            </h3>
          </div>
        </div>

        {/* Story 2 (Tall card, spans 5 columns offset) */}
        <div className="md:col-span-5 md:mt-16 space-y-4 border border-editorial-border p-4 bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-out">
          <Link
            href={`/blog/${MOCK_STORIES[1].slug}`}
            className="block relative w-full h-[40vh] md:h-[50vh] border border-editorial-border overflow-hidden group"
          >
            <Image
              src={MOCK_STORIES[1].image}
              alt={MOCK_STORIES[1].title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-editorial-text/5 group-hover:bg-editorial-text/0 transition-colors duration-500" />
          </Link>
          <div className="space-y-2 text-left pt-2">
            <span className="text-[9px] font-bold tracking-widest text-editorial-muted">
              {MOCK_STORIES[1].location}
            </span>
            <h3 className="font-display text-xl md:text-2xl font-black tracking-tight text-editorial-text">
              <Link href={`/blog/${MOCK_STORIES[1].slug}`} className="hover:text-editorial-muted transition-colors duration-300">
                {MOCK_STORIES[1].title}
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
