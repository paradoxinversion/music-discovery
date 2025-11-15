type ServerEventTypes =
  | "ARTIST_PROFILE_CREATED"
  | "ARTIST_PROFILE_DELETED"
  | "IMAGE_UPLOADED";

interface BaseEventPayload {
  eventType: ServerEventTypes;
}

export interface ArtistProfileCreatedEventPayload extends BaseEventPayload {
  eventType: "ARTIST_PROFILE_CREATED";
  artistId: string;
  artistName: string;
  createdAt: string;
}

export interface ArtistProfileDeletedEventPayload extends BaseEventPayload {
  eventType: "ARTIST_PROFILE_DELETED";
  artistId: string;
  artistName: string;
  deletedAt: string;
}

export interface ImageUploadedEventPayload extends BaseEventPayload {
  eventType: "IMAGE_UPLOADED";
  imageId: string;
  uploadedAt: string;
}

export type ServerEventPayload =
  | ArtistProfileCreatedEventPayload
  | ArtistProfileDeletedEventPayload
  | ImageUploadedEventPayload;

export const createArtistProfileCreatedEvent = (
  artistId: string,
  artistName: string,
): ArtistProfileCreatedEventPayload => {
  return {
    eventType: "ARTIST_PROFILE_CREATED",
    artistId,
    artistName,
    createdAt: new Date().toISOString(),
  };
};

export const createArtistProfileDeletedEvent = (
  artistId: string,
  artistName: string,
): ArtistProfileDeletedEventPayload => {
  return {
    eventType: "ARTIST_PROFILE_DELETED",
    artistId,
    artistName,
    deletedAt: new Date().toISOString(),
  };
};

export const createImageUploadedEvent = (
  imageId: string,
): ImageUploadedEventPayload => {
  return {
    eventType: "IMAGE_UPLOADED",
    imageId,
    uploadedAt: new Date().toISOString(),
  };
};

export const logServerEvent = (event: ServerEventPayload) => {
  console.info(event);
};
