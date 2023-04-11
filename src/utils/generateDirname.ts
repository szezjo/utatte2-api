import fs from 'fs-extra';

const checkDuplicates = (dirname: string, lv: number): number => {
  let path = `./songs/${dirname}`;
  if (lv > 0) path = path.concat(`_${lv}`);

  if (!fs.existsSync(path)) return lv;
  return checkDuplicates(dirname, lv + 1);
};

export const generateDirname = (name: string, artist: string) => {
  const modName = name
    .trim()
    .toLowerCase()
    .replace(/[^A-Za-z0-9]+/g, '_');
  const modArtist = artist
    .trim()
    .toLowerCase()
    .replace(/[^A-Za-z0-9]+/g, '_');
  const dirname = `${modArtist}_${modName}`.replace(/^_+/, '').replace(/_+$/, '');

  const duplicates = checkDuplicates(dirname, 0);
  const finalDirname = duplicates > 0 ? dirname + `_${duplicates}` : dirname;
  fs.mkdirSync(`./songs/${finalDirname}`);
  return finalDirname;
};
