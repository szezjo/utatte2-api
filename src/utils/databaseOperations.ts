import sqlite from 'sqlite';
import { TSongMetadata } from '../models/songs';

export const initDatabase = async (db: sqlite.Database) => {
  db.run(
    'CREATE TABLE IF NOT EXISTS Songs (\
          id                   INTEGER PRIMARY KEY AUTOINCREMENT,\
          name                 TEXT    NOT NULL,\
          latinName            TEXT    NOT NULL,\
          artist               TEXT    NOT NULL,\
          latinArtist          TEXT    NOT NULL,\
          album                TEXT    NOT NULL,\
          latinAlbum           TEXT    NOT NULL,\
          genre                TEXT    NOT NULL,\
          lang                 TEXT    NOT NULL,\
          albumYear            INTEGER NOT NULL,\
          directoryName        TEXT    NOT NULL,\
          duration             INTEGER NOT NULL,\
          previewStart         NUMERIC NOT NULL,\
          previewEnd           NUMERIC,\
          scoreModeIncluded    INTEGER NOT NULL,\
          instrumentalIncluded INTEGER NOT NULL\
      );\
      ',
  );
  db.run(
    'CREATE TABLE IF NOT EXISTS Rooms (\
      id   INTEGER PRIMARY KEY AUTOINCREMENT,\
      name TEXT    NOT NULL);',
  );
  db.run(
    'CREATE TABLE IF NOT EXISTS Users (\
    id             INTEGER PRIMARY KEY AUTOINCREMENT,\
    name           TEXT    NOT NULL,\
    profilePicture TEXT);\
  ',
  );
  await db.run('DROP TABLE IF EXISTS QueueEntries');
  db.run(
    'CREATE TABLE QueueEntries (\
    id     INTEGER PRIMARY KEY AUTOINCREMENT,\
    songId INTEGER REFERENCES Songs (id),\
    userId INTEGER REFERENCES Users (id),\
    roomId INTEGER REFERENCES Rooms (id) \
    );\
  ',
  );
};

export const insertSong = async (db: sqlite.Database, song: TSongMetadata, dirName: string) => {
  return db.run(
    'INSERT INTO Songs (\
        name, latinName, artist, latinArtist, album, latinAlbum, genre, lang, \
        albumYear, directoryName, duration, previewStart, previewEnd, scoreModeIncluded, instrumentalIncluded\
        ) VALUES (\
            $name, $latinName, $artist, $latinArtist, $album, $latinAlbum, $genre, $lang,\
            $albumYear, $directoryName, $duration, $previewStart, $previewEnd, $scoreModeIncluded, $instrumentalIncluded\
        )',
    {
      $name: song.name,
      $latinName: song.latinName || song.name,
      $artist: song.artist,
      $latinArtist: song.latinArtist || song.artist,
      $album: song.album,
      $latinAlbum: song.latinAlbum || song.album,
      $genre: song.genre,
      $lang: song.lang,
      $albumYear: song.albumYear,
      $directoryName: dirName,
      $duration: song.duration,
      $previewStart: song.previewStart,
      $previewEnd: song.previewEnd || null,
      $scoreModeIncluded: song.scoreModeIncluded ? 1 : 0,
      $instrumentalIncluded: song.instrumentalIncluded ? 1 : 0,
    },
  );
};

export const listSongs = async (db: sqlite.Database) => {
  return db.all('SELECT * FROM Songs');
};

export const listSongsAZ = async (db: sqlite.Database) => {
  return db.all('SELECT * FROM Songs ORDER BY LOWER(name) ASC');
};

export const listSongsZA = async (db: sqlite.Database) => {
  return db.all('SELECT * FROM Songs ORDER BY LOWER(name) DESC');
};

export const listSongsAZL = async (db: sqlite.Database) => {
  return db.all('SELECT * FROM Songs ORDER BY LOWER(latinName) ASC');
};

export const listSongsZAL = async (db: sqlite.Database) => {
  return db.all('SELECT * FROM Songs ORDER BY LOWER(latinName) DESC');
};

export const getSongByID = async (db: sqlite.Database, id: number) => {
  return db.get('SELECT * FROM Songs WHERE id=$id', [id]);
};

export const removeSongByID = async (db: sqlite.Database, id: number) => {
  return db.run('DELETE FROM Songs WHERE id=$id', [id]);
};

export const getDirNameByID = async (db: sqlite.Database, id: number) => {
  const data = await db.get('SELECT * FROM Songs WHERE id=$id', [id]);
  return data.directoryName;
};

export const addRoom = async (db: sqlite.Database, name: string) => {
  return db.run('INSERT INTO Rooms(name) VALUES ($name)', { $name: name });
};

export const listRooms = async (db: sqlite.Database) => {
  return db.all('SELECT * FROM Rooms');
};

export const addUser = async (db: sqlite.Database, name: string, filename: string) => {
  return db.run('INSERT INTO Users(name, profilePicture) VALUES ($name, $profilePicture)', {
    $name: name,
    $profilePicture: filename,
  });
};

export const listUsers = async (db: sqlite.Database) => {
  return db.all('SELECT * FROM Users');
};

export const getUsersProfilePicture = async (db: sqlite.Database, id: number) => {
  return db.get('SELECT profilePicture FROM Users WHERE id=$id', { $id: id });
};

export const addQueueEntry = async (db: sqlite.Database, songId: number, userId: number, roomId: number) => {
  return db.run('INSERT INTO QueueEntries(songId,userId,roomId) VALUES ($songId, $userId, $roomId)', {
    $songId: songId,
    $userId: userId,
    $roomId: roomId,
  });
};

export const listQueueEntriesByRoom = async (db: sqlite.Database, id: number) => {
  return db.all('SELECT * FROM QueueEntries WHERE roomId=$id', { $id: id });
};
