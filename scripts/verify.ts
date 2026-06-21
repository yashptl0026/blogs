import fs from 'fs';
import path from 'path';
import pool from '../lib/mysql';
import { getAllPosts, getAllCategories, getAllTags } from '../lib/mdx';

async function verify() {
  console.log('Starting verification...');

  // Verify Categories
  const [catRows] = await pool.query(`SELECT COUNT(*) as count FROM Category`);
  const mdxCategories = getAllCategories();
  const dbCatCount = (catRows as any[])[0].count;
  if (mdxCategories.length !== dbCatCount) {
    console.error(`❌ Category count mismatch: MDX=${mdxCategories.length}, DB=${dbCatCount}`);
  } else {
    console.log(`✅ Category count matches: ${dbCatCount}`);
  }

  // Verify Tags
  const [tagRows] = await pool.query(`SELECT COUNT(*) as count FROM Tag`);
  const mdxTags = getAllTags();
  const dbTagCount = (tagRows as any[])[0].count;
  if (mdxTags.length !== dbTagCount) {
    console.error(`❌ Tag count mismatch: MDX=${mdxTags.length}, DB=${dbTagCount}`);
  } else {
    console.log(`✅ Tag count matches: ${dbTagCount}`);
  }

  // Verify Posts
  const [postRows] = await pool.query(`SELECT COUNT(*) as count FROM Post`);
  const mdxPosts = getAllPosts();
  const dbPostCount = (postRows as any[])[0].count;
  if (mdxPosts.length !== dbPostCount) {
    console.error(`❌ Post count mismatch: MDX=${mdxPosts.length}, DB=${dbPostCount}`);
  } else {
    console.log(`✅ Post count matches: ${dbPostCount}`);
  }

  // Sample check
  if (mdxPosts.length > 0) {
    const samplePost = mdxPosts[0];
    const [sampleDbRow] = await pool.query(`SELECT * FROM Post WHERE id = ?`, [samplePost?.id]);
    const dbPost = (sampleDbRow as any[])[0];

    if (dbPost) {
      const match = 
        dbPost.slug === samplePost?.slug &&
        dbPost.titleEn === samplePost?.titleEn &&
        dbPost.published === (samplePost?.published ? 1 : 0);
        
      if (match) {
        console.log(`✅ Sample post "${samplePost?.titleEn}" metadata matches exactly.`);
      } else {
        console.error(`❌ Sample post metadata mismatch!`);
      }
    }
  }

  console.log('Verification completed.');
  process.exit(0);
}

verify().catch(console.error);
