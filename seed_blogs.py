import sqlite3
import uuid
import datetime

db_path = "prisma/dev.db"

# Data from previous step
districts = [
    {"District": "Ahmedabad", "Places": "Sabarmati Ashram, Kankaria Lake, Adalaj Stepwell, Science City, Riverfront"},
    {"District": "Surat", "Places": "Dumas Beach, Gopi Talav, Surat Castle, Dutch Garden, Sarthana Zoo"},
    {"District": "Vadodara", "Places": "Laxmi Vilas Palace, Sayaji Garden, EME Temple, Champaner, Kirti Mandir"},
    {"District": "Rajkot", "Places": "Kaba Gandhi No Delo, Rotary Dolls Museum, Lalpari Lake, Ishwariya Park, Watson Museum"},
    {"District": "Bhavnagar", "Places": "Velavadar National Park, Takhteshwar Temple, Victoria Park, Gaurishankar Lake, Nishkalank Mahadev"},
    {"District": "Junagadh", "Places": "Uparkot Fort, Girnar, Mahabat Maqbara, Ashokan Rock Edicts, Damodar Kund"},
    {"District": "Gir Somnath", "Places": "Somnath Temple, Triveni Sangam, Bhalka Tirth, Somnath Beach, Dehotsarg"},
    {"District": "Dwarka", "Places": "Dwarkadhish Temple, Bet Dwarka, Nageshwar Jyotirlinga, Gomti Ghat, Rukmini Temple"},
    {"District": "Kutch", "Places": "White Rann, Kala Dungar, Mandvi Beach, Vijay Vilas Palace, Narayan Sarovar"},
    {"District": "Jamnagar", "Places": "Marine National Park, Bala Hanuman Temple, Lakhota Lake, Khijadiya Bird Sanctuary, Lakhota Palace"},
    {"District": "Porbandar", "Places": "Kirti Mandir, Chowpatty Beach, Sudama Temple, Huzoor Palace, Bharat Mandir"},
    {"District": "Amreli", "Places": "Gir Forest Zone, Khodiyar Dam, Rajula Beach, Nagnath Temple, Jafrabad"},
    {"District": "Anand", "Places": "Amul Dairy, Sardar Patel Museum, Swaminarayan Mandir, Flo Art, Vadtal Temple"},
    {"District": "Kheda", "Places": "Dakor Temple, Galteshwar Mahadev, Santaram Mandir, Vatrak Riverfront, Utkantheshwar"},
    {"District": "Gandhinagar", "Places": "Akshardham, Indroda Park, Children's Park, Sarita Udyan, Dandi Kutir"},
    {"District": "Mehsana", "Places": "Modhera Sun Temple, Bahucharaji Temple, Shanku's Water Park, Vadnagar, Taranga Hills"},
    {"District": "Patan", "Places": "Rani Ki Vav, Sahastraling Talav, Patola House, Panchasara Jain Temple, Khan Sarovar"},
    {"District": "Banaskantha", "Places": "Ambaji Temple, Gabbar Hill, Balaram Palace, Jessore Sanctuary, Koteshwar"},
    {"District": "Sabarkantha", "Places": "Polo Forest, Shamlaji Temple, Tirupati Rushivan, Hathmati Dam, Idar Fort"},
    {"District": "Aravalli", "Places": "Sharneshwar Temple, Devni Mori, Modasa Fort Area, Ratanmahal Route, Jader"},
    {"District": "Mahisagar", "Places": "Kadana Dam, Wanakbori Area, Santarampur Hills, Kaleshwari Temple, Bakor"},
    {"District": "Panchmahal", "Places": "Pavagadh, Champaner, Jambughoda, Hathni Mata Waterfall, Kalika Mata Temple"},
    {"District": "Dahod", "Places": "Ratanmahal Sanctuary, Mangadh Hill, Devgadh Baria, Dudhiya Lake, Tribal Museum"},
    {"District": "Chhota Udepur", "Places": "Jambughoda Border Area, Suki Dam, Kawant, Tribal Art Villages, Pithora Paintings"},
    {"District": "Bharuch", "Places": "Golden Bridge, Kabirvad, Nilkantheshwar, Narmada Park, Bhrigu Rishi Temple"},
    {"District": "Narmada", "Places": "Statue of Unity, Valley of Flowers, Zarwani Waterfall, Shoolpaneshwar, Cactus Garden"},
    {"District": "Tapi", "Places": "Ukai Dam, Ukai Bird Sanctuary, Dosvada Dam, Songadh Fort, Hindla Forest"},
    {"District": "Navsari", "Places": "Dandi Beach, Unai Hot Springs, Ajmalgadh, Parsi Agiary Area, Vansda Park"},
    {"District": "Valsad", "Places": "Tithal Beach, Wilson Hills, Parnera Fort, Udvada, Tadkeshwar Temple"},
    {"District": "Morbi", "Places": "Mani Mandir, Hanging Bridge, Nyari Dam, Green Tower, Machhu Dam"},
    {"District": "Botad", "Places": "Salangpur Hanumanji, Gadhada Temple, Bhimnath Mahadev, Ningala, Khambhada"},
    {"District": "Devbhumi Dwarka", "Places": "Dwarkadhish Temple, Shivrajpur Beach, Bet Dwarka, Nageshwar, Rukmini Temple"}
]

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Get or create author
cur.execute("SELECT id FROM User LIMIT 1")
row = cur.fetchone()
if not row:
    author_id = str(uuid.uuid4())
    # Convert datetime format slightly
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # For SQLite, the DateTime type from Prisma wants a specific ISO format, or unix epoch. Prisma SQLite uses epoch timestamps?
    # Prisma actually stores DateTimes as milliseconds since epoch, or standard text. 
    # Let's see how they store dates: usually 1970-01-01 00:00:00 or ISO-8601 string.
    
    cur.execute(
        "INSERT INTO User (id, name, email, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
        (author_id, "Admin", "admin@example.com", "ADMIN", now, now)
    )
    conn.commit()
else:
    author_id = row[0]

added = 0
for item in districts:
    dist = item["District"]
    titleEn = f"Top 5 Tourist Places in {dist}"
    slug = f"top-5-tourist-places-in-{dist.lower().replace(' ', '-')}"
    excerptEn = f"Discover the top 5 tourist places to visit in {dist}, Gujarat."
    
    places_list = "".join([f"<li>{p.strip()}</li>" for p in item["Places"].split(',')])
    contentEn = f"<p>If you're visiting {dist}, here are the top 5 must-visit tourist destinations that you shouldn't miss:</p><ul>{places_list}</ul>"
    
    coverImage = "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=100&w=1600&auto=format&fit=crop"
    readingTime = "3 min"
    # ISO-8601 string or numeric? Prisma stores ISO8601 in SQLite typically or integer. Let's use milliseconds epoch just in case or a simple datetime string.
    # Actually Prisma uses integer epoch for SQLite in some versions, and ISO8601 string in others.
    # Using python's datetime isoformat
    now_iso = datetime.datetime.utcnow().isoformat()

    cur.execute("SELECT id FROM Post WHERE slug = ?", (slug,))
    if not cur.fetchone():
        post_id = str(uuid.uuid4())
        # We need to insert these fields into the Post table.
        cur.execute('''
            INSERT INTO Post (id, titleEn, slug, excerptEn, contentEn, coverImage, readingTime, published, authorId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (post_id, titleEn, slug, excerptEn, contentEn, coverImage, readingTime, 1, author_id, now_iso, now_iso))
        added += 1

conn.commit()
conn.close()
print(f"Successfully added {added} district posts via Python!")
