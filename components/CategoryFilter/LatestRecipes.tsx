import Image from "next/image";
import Link from "next/link";
import { Clock, Activity, ArrowRight } from "lucide-react";

interface RecipeCard {
  id: string;
  title: string;
  prepTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  image: string;
  slug: string;
}

const MOCK_RECIPES: RecipeCard[] = [
  {
    id: "recipe-1",
    title: "Slow Fermented Cardamom Buns",
    prepTime: "2 hrs 30 mins",
    difficulty: "Hard",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop",
    slug: "spices-kerala-culinary-expedition",
  },
  {
    id: "recipe-2",
    title: "Heirloom Tomato & Smoked Sea Salt Focaccia",
    prepTime: "1 hr 15 mins",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600&auto=format&fit=crop",
    slug: "slow-living-rural-sweden",
  },
  {
    id: "recipe-3",
    title: "Cold Brewed Travertine Matcha Latte",
    prepTime: "10 mins",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop",
    slug: "evolution-epaper-cognitive-calm",
  },
];

export default function LatestRecipes() {
  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="flex justify-between items-end border-b border-editorial-border pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-widest text-editorial-text">
            Cooking Focus
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-editorial-text font-black tracking-tight">
            Latest Recipes
          </h2>
        </div>
        <Link
          href="/recipes"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-editorial-muted hover:text-editorial-text transition-colors duration-300"
        >
          <span>All Recipes</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" />
        </Link>
      </div>

      {/* Grid of Smaller Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_RECIPES.map((recipe) => (
          <article
            key={recipe.id}
            className="flex flex-col space-y-4 border border-editorial-border bg-white p-4 group hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out"
          >
            {/* Aspect ratio 16/10 Image */}
            <div className="relative w-full aspect-[16/10] overflow-hidden border border-editorial-border bg-editorial-card">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              />
            </div>

            {/* Recipe Metadata Indicators */}
            <div className="flex items-center gap-4 text-[9px] font-bold tracking-widest text-editorial-muted bg-editorial-card p-2 border border-editorial-border rounded-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {recipe.prepTime}
              </span>
              <span className="w-1.5 h-1.5 bg-editorial-border rounded-full"></span>
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                {recipe.difficulty}
              </span>
            </div>

            {/* Title & Link */}
            <div className="space-y-2">
              <h3 className="font-display text-lg font-black tracking-tight text-editorial-text group-hover:text-editorial-muted transition-colors duration-300 leading-snug">
                <Link href={`/blog/${recipe.slug}`}>
                  {recipe.title}
                </Link>
              </h3>
              <Link
                href={`/blog/${recipe.slug}`}
                className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-editorial-text hover:text-editorial-muted transition-colors duration-300"
              >
                <span>Cook Now</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
