export type BlogCategory = "Cooking" | "Photography" | "Travel" | "Tech" | "Places" | "Interiors";
export type BlogLocation = "India" | "Europe" | "Global";
export type BlogPostType = "Long-form" | "Recipe" | "Quick Read" | "Gallery";

export interface Author {
  name: string;
  avatar: string;
}

export interface Review {
  id: string;
  name: string;
  email: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: BlogCategory;
  location: BlogLocation;
  postType: BlogPostType;
  coverImage: string;
  author: Author;
  date: string;
  readingTime: string;
  
  // Recipe details
  prepTime?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  
  // Photography layout options
  aspectRatio?: "portrait" | "landscape" | "square";
  locationDetail?: string;
}
