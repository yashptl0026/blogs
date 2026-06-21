const mysql = require('mysql2/promise');

async function testQuery() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog_db',
    port: 3306
  });

  try {
    const query = `
      SELECT 
        p.*,
        JSON_OBJECT('id', u.id, 'name', u.name, 'image', u.image) as author,
        IF(s.id IS NOT NULL, JSON_OBJECT('id', s.id, 'nameEn', s.nameEn), NULL) as state,
        IF(d.id IS NOT NULL, JSON_OBJECT('id', d.id, 'nameEn', d.nameEn), NULL) as district,
        IF(t.id IS NOT NULL, JSON_OBJECT('id', t.id, 'nameEn', t.nameEn), NULL) as taluka,
        IF(v.id IS NOT NULL, JSON_OBJECT('id', v.id, 'nameEn', v.nameEn), NULL) as village,
        (SELECT IFNULL(JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'nameEn', c.nameEn, 'slug', c.slug)), JSON_ARRAY()) FROM _CategoryToPost cp JOIN Category c ON c.id = cp.A WHERE cp.B = p.id) as categories,
        (SELECT IFNULL(JSON_ARRAYAGG(JSON_OBJECT('id', tag.id, 'name', tag.name, 'slug', tag.slug)), JSON_ARRAY()) FROM _PostToTag pt JOIN Tag tag ON tag.id = pt.A WHERE pt.B = p.id) as tags,
        (SELECT IFNULL(JSON_ARRAYAGG(JSON_OBJECT('userId', l.userId)), JSON_ARRAY()) FROM \`Like\` l WHERE l.postId = p.id) as likes,
        (SELECT IFNULL(JSON_ARRAYAGG(JSON_OBJECT('userId', sp.userId)), JSON_ARRAY()) FROM SavedPost sp WHERE sp.postId = p.id) as savedPosts
      FROM Post p
      LEFT JOIN User u ON p.authorId = u.id
      LEFT JOIN State s ON p.stateId = s.id
      LEFT JOIN District d ON p.districtId = d.id
      LEFT JOIN Taluka t ON p.talukaId = t.id
      LEFT JOIN Village v ON p.villageId = v.id
      WHERE p.published = 1
      ORDER BY p.createdAt DESC
    `;

    console.log("Running Posts query...");
    const [rows] = await pool.execute(query);
    console.log("Success! Found", rows.length, "posts.");
    console.log("Sample:", rows[0]);
  } catch (error) {
    console.error("SQL Error:", error.message);
  } finally {
    await pool.end();
  }
}

testQuery();
