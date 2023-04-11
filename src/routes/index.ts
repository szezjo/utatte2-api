import { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { getDirNameByID, getSongByID, initDatabase, insertSong, listSongs, removeSongByID } from '../utils/databaseOperations.js';
import { TSongMetadata } from 'models/songs.js';
import { generateDirname } from '../utils/generateDirname.js';
import fs from 'fs-extra';

const router = Router();
const jsonParser = bodyParser.json();

// const db = new sqlite3.Database('database.db', (err) => {
//   if (err) console.error(err.message);
// });

let db : Database<sqlite3.Database, sqlite3.Statement> | null = null;

(async () => {
  db = await open({
    filename: 'database.db',
    driver: sqlite3.Database
  })
})();


/* GET home page. */

router.get('/', (req: Request, res: Response) => {
  res.json({ ok: true });
});

router.get('/checkConnection', (req: Request, res: Response) => {
  res.json({ connected: true });
});

router.get('/testdb', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error("Database file not defined");
    await initDatabase(db);
    res.json({ ok: true });
  }
  catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.post('/addSong', jsonParser, async (req: Request, res: Response) => {
  try {
    const song : TSongMetadata = req.body;
    if (!db) throw new Error("Database file not defined");
    const queryResult = await insertSong(db, song, generateDirname(song.latinName || song.name, song.latinArtist || song.artist));
    const newRowID = queryResult.lastID;
    res.json({ ok: true, id: newRowID });
  }
  catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.get('/listSongs', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error("Database file not defined");
    const queryResult = await listSongs(db);
    res.json(queryResult);
  }
  catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
})

router.get('/getSong/:id', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error("Database file not defined");
    const idNumeric = parseInt(req.params.id);
    const queryResult = await getSongByID(db, idNumeric);
    res.json(queryResult);
  }
  catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
})

router.delete('/removeSong/:id', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error("Database file not defined");
    const idNumeric = parseInt(req.params.id);
    const queryResult = await removeSongByID(db, idNumeric);
    res.json(queryResult);
  }
  catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
})

router.get('/getTrack/:id', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error("Database file not defined");
    const idNumeric = parseInt(req.params.id);
    const dirName = await getDirNameByID(db, idNumeric);
    const filePath = `./songs/${dirName}/song.ogg`;
    if (!fs.existsSync(filePath)) throw new Error("File not found");
    res.download(filePath, "track.ogg");
  }
  catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
})

router.get('/getKaraokeTrack/:id', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error("Database file not defined");
    const idNumeric = parseInt(req.params.id);
    const dirName = await getDirNameByID(db, idNumeric);
    const filePath = `./songs/${dirName}/karaoke.ogg`;
    if (!fs.existsSync(filePath)) throw new Error("File not found");
    res.download(filePath, "track.ogg");
  }
  catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
})

router.get('/getCoverImage/:id', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error("Database file not defined");
    const idNumeric = parseInt(req.params.id);
    const dirName = await getDirNameByID(db, idNumeric);
    const filePath = `./songs/${dirName}/cover.jpg`;
    if (!fs.existsSync(filePath)) throw new Error("File not found");
    res.download(filePath, "cover.jpg");
  }
  catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
})

export default router;
