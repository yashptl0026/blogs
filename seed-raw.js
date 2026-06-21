const mysql = require('mysql2/promise');
const crypto = require('crypto');

async function seed() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog_db',
    port: 3306
  });

  try {
    console.log("Connecting to MySQL...");
    
    // Check if tables exist
    const [tables] = await pool.execute(`SHOW TABLES LIKE 'Post'`);
    if (tables.length === 0) {
      console.error("❌ The 'Post' table does not exist. Did you import the schema.sql file into phpMyAdmin?");
      process.exit(1);
    }

    // Check if user exists
    const [users] = await pool.execute(`SELECT id FROM User WHERE email = 'admin@travel.com'`);
    let userId;
    
    if (users.length === 0) {
      userId = crypto.randomUUID();
      await pool.execute(
        `INSERT INTO User (id, name, email, role) VALUES (?, ?, ?, ?)`,
        [userId, "Aesthete Editorial", "admin@travel.com", "ADMIN"]
      );
      console.log("✅ Created Admin User");
    } else {
      userId = users[0].id;
    }

    // Check if category exists
    const [categories] = await pool.execute(`SELECT id FROM Category WHERE slug = 'travel'`);
    let categoryId;
    
    if (categories.length === 0) {
      categoryId = crypto.randomUUID();
      await pool.execute(
        `INSERT INTO Category (id, nameEn, slug, isTravel) VALUES (?, ?, ?, ?)`,
        [categoryId, "Travel", "travel", 1]
      );
      console.log("✅ Created Category");
    } else {
      categoryId = categories[0].id;
    }

    // Create a dummy post
    const postId = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO Post (id, titleEn, slug, excerptEn, contentEn, coverImage, readingTime, published, authorId) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        postId, 
        "The Magic of Raw MySQL", 
        "magic-of-raw-mysql-" + Date.now(), 
        "Welcome to your newly rewritten, blazing fast raw MySQL backend!", 
        "<p>This post confirms that your raw MySQL database is working perfectly without Prisma.</p>",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=100&w=1600&auto=format&fit=crop",
        "2 min read",
        1,
        userId
      ]
    );

    // Link category
    await pool.execute(
      `INSERT INTO _CategoryToPost (A, B) VALUES (?, ?)`,
      [categoryId, postId]
    );

    console.log("✅ Successfully created a test post! Open http://localhost:3000 to see it.");

  } catch (error) {
    console.error("❌ Database Error:", error);
  } finally {
    await pool.end();
  }
}

seed();
