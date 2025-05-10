import express from "express";
import path from "path";
import { MongoClient } from "mongodb";
import { fileURLToPath } from "url";
import { config } from 'dotenv';
import cors from 'cors';

config();

// MongoDB URI
const uri = process.env.Mongo_Url;
const client = new MongoClient(uri);

// These lines replace __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// ✅ Use CORS middleware (Allow all origins)
app.use(cors());

// Middleware to serve static MP3 files
app.use('/music', express.static(path.join(__dirname, 'MusicProjectData')));
// example: http://localhost:3000/music/Arijit%20Singh/Channa%20Mereya.mp3

// Root route
app.get('/', (req, res) => {
  res.send('🎧 Welcome to the Music API!');
});

// API route to fetch data from all collections from playlist Database
app.get('/api/playlist', async (req, res) => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();

    const db = client.db('playlist');
    console.log('📂 Connected to DB:', db.databaseName);

    const collections = await db.listCollections().toArray();
    console.log('📁 Collections found:', collections.map(col => col.name));

    const collectionData = {};

    for (const { name } of collections) {
      const documents = await db.collection(name).find().toArray();
      console.log(`📄 Found ${documents.length} documents in "${name}"`);
      collectionData[name] = documents;
    }

    console.log('🎵 Combined Collection Data:', collectionData);
    res.json(collectionData);

  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
    console.log('🔒 MongoDB connection closed');
  }
});

// API route to fetch data from all collections from Songlist Database
app.get('/api/playlist/Songlist', async (req, res) => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();

    const db = client.db('Songlist');
    console.log('📂 Connected to DB:', db.databaseName);

    const collections = await db.listCollections().toArray();
    console.log('📁 Collections found:', collections.map(col => col.name));

    const collectionData = {};

    for (const { name } of collections) {
      const documents = await db.collection(name).find().toArray();
      console.log(`📄 Found ${documents.length} documents in "${name}"`);
      collectionData[name] = documents;
    }

    console.log('🎵 Combined Collection Data:', collectionData);
    res.json(collectionData);

  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
    console.log('🔒 MongoDB connection closed');
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});
