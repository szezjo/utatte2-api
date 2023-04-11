type TSongMetadata = {
  name: string;
  latinName: string;
  artist: string;
  latinArtist: string;
  album: string;
  latinAlbum: string;
  genre: string;
  lang: string;
  albumYear: number;
  duration: number;
  previewStart: number;
  previewEnd: number;
  scoreModeIncluded: boolean;
  instrumentalIncluded: boolean;
};

export { TSongMetadata };
