import { BlogPost } from "@/types/blog";

// In Next.js, hot reloads can reset global variables. We bind to globalThis to persist state.
let globalWithDb = global as typeof globalThis & {
  blogDb?: BlogPost[];
};

const INITIAL_POSTS: BlogPost[] = [
  {
    id: "featured-1",
    title: "The Silent Architecture of Minimalist Living Spaces",
    slug: "silent-architecture-minimalist-living",
    excerpt: "How spatial editing and raw materiality shape modern sensory sanctuaries.",
    category: "Interiors",
    location: "Global",
    postType: "Long-form",
    coverImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
    author: {
      name: "Evelyn Thorne",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    },
    date: "June 07, 2026",
    readingTime: "5 min read",
  },
  {
    id: "post-1",
    title: "Spices of Kerala: A Culinary Expedition",
    slug: "spices-kerala-culinary-expedition",
    excerpt: "Journey deep into the cardamoms and black peppers of Munnar's mountain terraces, exploring spice histories.",
    category: "Cooking",
    location: "India",
    postType: "Recipe",
    coverImage: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop",
    author: { name: "Aarav Nair", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" },
    date: "June 06, 2026",
    readingTime: "6 min read",
    prepTime: "45 mins",
    difficulty: "Medium",
  },
  {
    id: "post-2",
    title: "Chasing Shadows in the Streets of Paris",
    slug: "chasing-shadows-streets-paris",
    excerpt: "A monochrome study capturing early morning geometry, reflections along the Seine, and brutalist apartment lines.",
    category: "Photography",
    location: "Europe",
    postType: "Gallery",
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
    author: { name: "Evelyn Thorne", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" },
    date: "June 04, 2026",
    readingTime: "3 min read",
    aspectRatio: "portrait",
    locationDetail: "Paris, France",
  },
  {
    id: "post-3",
    title: "The Slow Living Movement in Rural Sweden",
    slug: "slow-living-rural-sweden",
    excerpt: "Inside a century-old summer house focusing on simple woodfired baking, spatial clarity, and silent nature walks.",
    category: "Places",
    location: "Europe",
    postType: "Long-form",
    coverImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600&auto=format&fit=crop",
    author: { name: "Lukas Ekdahl", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" },
    date: "May 30, 2026",
    readingTime: "8 min read",
  },
  {
    id: "post-4",
    title: "The Evolution of E-Paper and Cognitive Calm",
    slug: "evolution-epaper-cognitive-calm",
    excerpt: "Why retroreflective displays offer relief from visual fatigue and help establish healthier boundaries in visual workspaces.",
    category: "Tech",
    location: "Global",
    postType: "Quick Read",
    coverImage: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop",
    author: { name: "Hiroshi Sato", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" },
    date: "May 25, 2026",
    readingTime: "4 min read",
  },
  {
    id: "post-5",
    title: "The Architecture of Old Delhi's Havelis",
    slug: "architecture-old-delhi-havelis",
    excerpt: "Documenting the sandstone archways, detailed courtyards, and decay of Mughal mansions hidden in Chawri Bazar.",
    category: "Places",
    location: "India",
    postType: "Long-form",
    coverImage: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600&auto=format&fit=crop",
    author: { name: "Aarav Nair", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" },
    date: "May 18, 2026",
    readingTime: "7 min read",
  },
];

if (!globalWithDb.blogDb) {
  globalWithDb.blogDb = INITIAL_POSTS;
}

export const db = {
  getPosts: async (): Promise<BlogPost[]> => {
    return globalWithDb.blogDb || INITIAL_POSTS;
  },
  
  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    const posts = globalWithDb.blogDb || INITIAL_POSTS;
    return posts.find((p) => p.slug === slug) || null;
  },

  addPost: async (post: BlogPost): Promise<BlogPost> => {
    if (!globalWithDb.blogDb) {
      globalWithDb.blogDb = INITIAL_POSTS;
    }
    globalWithDb.blogDb = [post, ...globalWithDb.blogDb];
    return post;
  },

  deletePost: async (id: string): Promise<boolean> => {
    if (!globalWithDb.blogDb) {
      globalWithDb.blogDb = INITIAL_POSTS;
    }
    const originalLength = globalWithDb.blogDb.length;
    globalWithDb.blogDb = globalWithDb.blogDb.filter((p) => p.id !== id);
    return globalWithDb.blogDb.length < originalLength;
  }
};
