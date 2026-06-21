import fs from 'fs/promises';
import path from 'path';
import pool from '../lib/mysql';

async function migrate() {
  console.log('Starting migration from MySQL to MDX...');

  const contentDir = path.join(process.cwd(), 'content');
  const blogsDir = path.join(contentDir, 'blogs');
  const dataDir = path.join(contentDir, 'data');

  // Create directories
  await fs.mkdir(blogsDir, { recursive: true });
  await fs.mkdir(dataDir, { recursive: true });

  // 1. Fetch Categories
  const [categories] = await pool.query(`SELECT * FROM Category`);
  await fs.writeFile(
    path.join(dataDir, 'categories.json'),
    JSON.stringify(categories, null, 2)
  );
  console.log(`Exported ${Array.isArray(categories) ? categories.length : 0} categories.`);

  // 2. Fetch Tags
  const [tags] = await pool.query(`SELECT * FROM Tag`);
  await fs.writeFile(
    path.join(dataDir, 'tags.json'),
    JSON.stringify(tags, null, 2)
  );
  console.log(`Exported ${Array.isArray(tags) ? tags.length : 0} tags.`);

  // 3. Fetch Users (Authors)
  const [users] = await pool.query(`SELECT id, name, image FROM User`);
  await fs.writeFile(
    path.join(dataDir, 'authors.json'),
    JSON.stringify(users, null, 2)
  );
  console.log(`Exported ${Array.isArray(users) ? users.length : 0} authors.`);

  // Fetch Locations
  const [states] = await pool.query(`SELECT * FROM State`);
  const [districts] = await pool.query(`SELECT * FROM District`);
  const [talukas] = await pool.query(`SELECT * FROM Taluka`);
  const [villages] = await pool.query(`SELECT * FROM Village`);

  // 4. Fetch Posts
  const [posts] = await pool.query(`SELECT * FROM Post`);
  
  // 5. Fetch Relations
  const [categoryToPost] = await pool.query(`SELECT * FROM _CategoryToPost`);
  const [postToTag] = await pool.query(`SELECT * FROM _PostToTag`);

  let count = 0;
  for (const post of posts as any[]) {
    // Get related categories and tags for this post
    const postCategories = (categoryToPost as any[])
      .filter((rel: any) => rel.B === post.id)
      .map((rel: any) => {
        const cat = (categories as any[]).find((c: any) => c.id === rel.A);
        return cat ? { id: cat.id, nameEn: cat.nameEn, slug: cat.slug } : null;
      })
      .filter(Boolean);

    const postTags = (postToTag as any[])
      .filter((rel: any) => rel.A === post.id)
      .map((rel: any) => {
        const tag = (tags as any[]).find((t: any) => t.id === rel.B);
        return tag ? tag.slug : null;
      })
      .filter(Boolean);
      
    const author = (users as any[]).find((u: any) => u.id === post.authorId);
    const state = (states as any[]).find((s: any) => s.id === post.stateId);
    const district = (districts as any[]).find((d: any) => d.id === post.districtId);
    const taluka = (talukas as any[]).find((t: any) => t.id === post.talukaId);
    const village = (villages as any[]).find((v: any) => v.id === post.villageId);

    const frontmatter = {
      id: post.id,
      titleEn: post.titleEn,
      titleHi: post.titleHi,
      titleGu: post.titleGu,
      slug: post.slug,
      excerptEn: post.excerptEn,
      excerptHi: post.excerptHi,
      excerptGu: post.excerptGu,
      coverImage: post.coverImage,
      bannerImage: post.bannerImage,
      published: post.published === 1 || post.published === true,
      isFeatured: post.isFeatured === 1 || post.isFeatured === true,
      isTrending: post.isTrending === 1 || post.isTrending === true,
      isEditorPick: post.isEditorPick === 1 || post.isEditorPick === true,
      galleryImages: post.galleryImages,
      readingTime: post.readingTime,
      lat: post.lat,
      lng: post.lng,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      authorId: post.authorId,
      author: author ? { id: author.id, name: author.name, image: author.image } : null,
      state: state ? { id: state.id, nameEn: state.nameEn } : null,
      district: district ? { id: district.id, nameEn: district.nameEn } : null,
      taluka: taluka ? { id: taluka.id, nameEn: taluka.nameEn } : null,
      village: village ? { id: village.id, nameEn: village.nameEn } : null,
      categories: postCategories,
      tags: postTags,
      comments: [] // Comments are dropped for static MDX or can be migrated later if needed
    };

    // Serialize frontmatter
    let mdxContent = '---\n';
    mdxContent += JSON.stringify(frontmatter, null, 2) + '\n';
    mdxContent += '---\n\n';

    // Append content
    // We store all language content in the MDX file. Next.js can parse this and show the correct language.
    if (post.contentEn) mdxContent += `## Content (English)\n\n${post.contentEn}\n\n`;
    if (post.contentHi) mdxContent += `## Content (Hindi)\n\n${post.contentHi}\n\n`;
    if (post.contentGu) mdxContent += `## Content (Gujarati)\n\n${post.contentGu}\n\n`;

    await fs.writeFile(
      path.join(blogsDir, `${post.slug}.mdx`),
      mdxContent
    );
    count++;
  }

  console.log(`Exported ${count} blog posts to MDX.`);
  
  // Create a settings file
  await fs.writeFile(
    path.join(dataDir, 'settings.json'),
    JSON.stringify({ siteName: "Editorial Blog", description: "A multi-lingual blog" }, null, 2)
  );
  console.log('Exported settings.json');

  console.log('Migration to static files completed successfully.');
  process.exit(0);
}

migrate().catch(console.error);
