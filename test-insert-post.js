const mysql = require('mysql2/promise');

async function test() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'blog_db',
    password: ''
  });

  try {
    const id = "test-id-123";
    const actualAuthorId = "test-author"; // we might get foreign key error if this user doesn't exist
    // let's fetch a real author
    const [users] = await connection.execute('SELECT id FROM User LIMIT 1');
    const authorId = users.length > 0 ? users[0].id : 'no-user';

    await connection.execute(
      `INSERT INTO Post (id, titleEn, titleHi, titleGu, slug, excerptEn, excerptHi, excerptGu, contentEn, contentHi, contentGu, coverImage, bannerImage, readingTime, lat, lng, authorId, stateId, districtId, talukaId, villageId, published, isFeatured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, "Test Post", null, null, "test-post", "Excerpt", null, null,
        "Content", null, null, "image.jpg", null, "1 min",
        null, null, authorId,
        null, null, null, null,
        1, 0
      ]
    );
    console.log("Success");
    await connection.execute(`DELETE FROM Post WHERE id = ?`, [id]);
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await connection.end();
  }
}

test();
