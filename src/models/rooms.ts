export type TQueueEntryMetadata = {
  id: number;
  name: string;
  user: string;
};

export type TRoomMetadata = {
  name: string;
  queue: TQueueEntryMetadata[];
};
