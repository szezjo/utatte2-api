import sqlite3 from 'sqlite3';
import sqlite from 'sqlite';
import { TSongMetadata } from '../models/songs';

const initDatabase = async (db: sqlite.Database) => {
  return db.run(
    'CREATE TABLE IF NOT EXISTS Songs (\
          id                   INTEGER PRIMARY KEY,\
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
};

const insertSong = async (db: sqlite.Database, song: TSongMetadata, dirName: string) => {
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

const listSongs = async (db: sqlite.Database) => {
  return db.all('SELECT * FROM Songs');
};

const getSongByID = async (db: sqlite.Database, id: number) => {
  return db.get('SELECT * FROM Songs WHERE id=$id', [id]);
};

const removeSongByID = async (db: sqlite.Database, id: number) => {
  return db.run('DELETE FROM Songs WHERE id=$id', [id]);
};

const getDirNameByID = async (db: sqlite.Database, id: number) => {
  const data = await db.get('SELECT * FROM Songs WHERE id=$id', [id]);
  return data.directoryName;
};

export { initDatabase, insertSong, listSongs, getSongByID, removeSongByID, getDirNameByID };
