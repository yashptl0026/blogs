import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOGS_DIR = path.join(CONTENT_DIR, 'blogs');
const DATA_DIR = path.join(CONTENT_DIR, 'data');

export function getLocationMap() {
  const map: Record<string, { id: string, nameEn: string }> = {};
  try {
    const locPath = path.join(DATA_DIR, 'locations.json');
    if (fs.existsSync(locPath)) {
      const locations = JSON.parse(fs.readFileSync(locPath, 'utf8'));
      const traverse = (list: any[]) => {
        if (!list) return;
        for (const item of list) {
          map[item.id] = { id: item.id, nameEn: item.nameEn };
          if (item.districts) traverse(item.districts);
          if (item.talukas) traverse(item.talukas);
          if (item.villages) traverse(item.villages);
        }
      };
      traverse(locations);
    }
  } catch (err) {
    console.error("Error reading locations map:", err);
  }
  return map;
}

export function getPostBySlug(slug: string) {
  try {
    const filePath = path.join(BLOGS_DIR, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse JSON frontmatter block between ---
    const match = fileContent.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
    if (!match) return null;

    const data = JSON.parse(match[1]);
    const content = match[2];
    
    return {
      id: data.id,
      titleEn: data.titleEn,
      titleHi: data.titleHi,
      titleGu: data.titleGu,
      slug: data.slug,
      excerptEn: data.excerptEn,
      excerptHi: data.excerptHi,
      excerptGu: data.excerptGu,
      coverImage: data.coverImage,
      bannerImage: data.bannerImage,
      published: data.published,
      isFeatured: data.isFeatured,
      isTrending: data.isTrending,
      isEditorPick: data.isEditorPick,
      galleryImages: data.galleryImages,
      readingTime: data.readingTime,
      lat: data.lat,
      lng: data.lng,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      authorId: data.authorId,
      author: data.author,
      state: data.state || (data.stateId ? getLocationMap()[data.stateId] : null),
      district: data.district || (data.districtId ? getLocationMap()[data.districtId] : null),
      taluka: data.taluka || (data.talukaId ? getLocationMap()[data.talukaId] : null),
      village: data.village || (data.villageId ? getLocationMap()[data.villageId] : null),
      categories: data.categories || [],
      tags: data.tags || [],
      comments: data.comments || [],
      content
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts() {
  try {
    if (!fs.existsSync(BLOGS_DIR)) return [];
    
    const files = fs.readdirSync(BLOGS_DIR);
    const posts = files
      .filter(file => file.endsWith('.mdx'))
      .map(file => {
        const slug = file.replace(/\.mdx$/, '');
        return getPostBySlug(slug);
      })
      .filter(Boolean);
      
    // Sort by createdAt descending
    return posts.sort((a, b) => {
      if (!a || !b) return 0;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  } catch (error) {
    console.error('Error reading all posts:', error);
    return [];
  }
}

export function getAllCategories() {
  try {
    const filePath = path.join(DATA_DIR, 'categories.json');
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}

export function getCategoryBySlug(slug: string) {
  const categories = getAllCategories();
  return categories.find((c: any) => c.slug === slug) || null;
}

export function getAllTags() {
  try {
    const filePath = path.join(DATA_DIR, 'tags.json');
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading tags:', error);
    return [];
  }
}

export function getTagBySlug(slug: string) {
  const tags = getAllTags();
  return tags.find((t: any) => t.slug === slug) || null;
}

export function getPostsByCategory(categorySlug: string) {
  const posts = getAllPosts();
  return posts.filter(post => post?.categories.includes(categorySlug));
}

export function getPostsByTag(tagSlug: string) {
  const posts = getAllPosts();
  return posts.filter(post => post?.tags.includes(tagSlug));
}

export function getAuthors() {
  try {
    const filePath = path.join(DATA_DIR, 'authors.json');
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading authors:', error);
    return [];
  }
}
