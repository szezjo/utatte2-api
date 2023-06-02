import express, { Request, Response, Router, query } from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import {
  addQueueEntry,
  addRoom,
  addUser,
  getDirNameByID,
  getSongByID,
  getUsersProfilePicture,
  initDatabase,
  insertSong,
  listQueueEntriesByRoom,
  listRooms,
  listSongs,
  listSongsAZ,
  listUsers,
  removeSongByID,
} from '../utils/databaseOperations.js';
import { TSongMetadata } from 'models/songs.js';
import { generateDirname } from '../utils/generateDirname.js';
import fs from 'fs-extra';
import multerHelper from '../utils/multerHelper.js';

const router = Router();
const jsonParser = bodyParser.json();

router.use(express.json());

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

(async () => {
  db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database,
  });

  await initDatabase(db);
})();

/* GET home page. */

router.get('/', (req: Request, res: Response) => {
  res.json({ ok: true });
});

router.get('/checkConnection', (req: Request, res: Response) => {
  res.json({ connected: true });
});

// router.get('/testdb', async (req: Request, res: Response) => {
//   try {
//     if (!db) throw new Error('Database file not defined');
//     await initDatabase(db);
//     res.json({ ok: true });
//   } catch (error) {
//     console.error(error);
//     res.json({ ok: false });
//   }
// });

router.post('/addSong', jsonParser, async (req: Request, res: Response) => {
  try {
    const song: TSongMetadata = req.body;
    if (!db) throw new Error('Database file not defined');
    const queryResult = await insertSong(
      db,
      song,
      generateDirname(song.latinName || song.name, song.latinArtist || song.artist),
    );
    const newRowID = queryResult.lastID;
    res.json({ ok: true, id: newRowID });
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.get('/listSongs', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const queryResult = await listSongs(db);
    res.json(queryResult);
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.get('/listSongsAZ', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const queryResult = await listSongsAZ(db);
    res.json(queryResult);
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

// router.get('/listSongsZA', async (req: Request, res: Response) => {
//   try {
//     if (!db) throw new Error('Database file not defined');
//     const queryResult = await listSongsZA(db);
//     res.json(queryResult);
//   } catch (error) {
//     console.error(error);
//     res.json({ ok: false });
//   }
// });


// router.get('/listSongsAZL', async (req: Request, res: Response) => {
//   try {
//     if (!db) throw new Error('Database file not defined');
//     const queryResult = await listSongsAZL(db);
//     res.json(queryResult);
//   } catch (error) {
//     console.error(error);
//     res.json({ ok: false });
//   }
// });


// router.get('/listSongsZAL', async (req: Request, res: Response) => {
//   try {
//     if (!db) throw new Error('Database file not defined');
//     const queryResult = await listSongsZAL(db);
//     res.json(queryResult);
//   } catch (error) {
//     console.error(error);
//     res.json({ ok: false });
//   }
// });


router.get('/getSong/:id', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const idNumeric = parseInt(req.params.id);
    const queryResult = await getSongByID(db, idNumeric);
    res.json(queryResult);
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.delete('/removeSong/:id', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const idNumeric = parseInt(req.params.id);
    const queryResult = await removeSongByID(db, idNumeric);
    res.json(queryResult);
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.get('/getTrack/:id', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const idNumeric = parseInt(req.params.id);
    const dirName = await getDirNameByID(db, idNumeric);
    const filePath = `./songs/${dirName}/song.ogg`;
    if (!fs.existsSync(filePath)) throw new Error('File not found');
    res.download(filePath, 'track.ogg');
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.get('/getKaraokeTrack/:id', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const idNumeric = parseInt(req.params.id);
    const dirName = await getDirNameByID(db, idNumeric);
    const filePath = `./songs/${dirName}/karaoke.ogg`;
    if (!fs.existsSync(filePath)) throw new Error('File not found');
    res.download(filePath, 'track.ogg');
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.get('/getCoverImage/:id', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const idNumeric = parseInt(req.params.id);
    const dirName = await getDirNameByID(db, idNumeric);
    const filePath = `./songs/${dirName}/cover.jpg`;
    if (!fs.existsSync(filePath)) throw new Error('File not found');
    res.download(filePath, 'cover.jpg');
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.post('/addRoom', jsonParser, async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const { name } = req.body;
    const queryResult = await addRoom(db, name);
    const newRoomID = queryResult.lastID;
    res.json({ ok: true, id: newRoomID });
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.get('/listRooms', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const queryResult = await listRooms(db);
    res.json(queryResult);
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.post('/addUser', multerHelper, async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    if (!req.file) throw new Error('File not uploaded');
    const { name } = req.body;
    const { filename } = req.file;
    const queryResult = await addUser(db, name, filename);
    const newUserID = queryResult.lastID;
    res.json({ ok: true, id: newUserID });
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.get('/listUsers', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const queryResult = await listUsers(db);
    res.json(queryResult);
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.get('/getUsersProfilePicture/:id', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const idNumeric = parseInt(req.params.id);
    const filename = (await getUsersProfilePicture(db, idNumeric)).profilePicture;
    const filePath = `./uploads/images/${filename}`;
    if (!fs.existsSync(filePath)) throw new Error('File not found');
    res.download(filePath, 'profilePicture.jpg');
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.post('/addQueueEntry', jsonParser, async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const songId = parseInt(req.body.songId);
    const roomId = parseInt(req.body.roomId);
    const userId = parseInt(req.body.userId);

    const queryResult = await addQueueEntry(db, songId, userId, roomId);
    const newEntryID = queryResult.lastID;
    res.json({ ok: true, id: newEntryID });
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

router.get('/listQueueEntries/:id', async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('Database file not defined');
    const idNumeric = parseInt(req.params.id);
    const queryResult = await listQueueEntriesByRoom(db, idNumeric);
    res.json(queryResult);
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
});

export default router;
