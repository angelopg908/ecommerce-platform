require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const updates = [
  {
    name: 'Webcam 1080p',
    image_url: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600',
  },
  {
    name: 'Mouse Pad XL',
    image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
  },
];

async function run() {
  for (const { name, image_url } of updates) {
    const { rowCount } = await pool.query(
      'UPDATE products SET image_url = $1 WHERE name = $2',
      [image_url, name]
    );
    console.log(`${name}: ${rowCount > 0 ? 'updated' : 'not found'}`);
  }
  await pool.end();
}

run();
