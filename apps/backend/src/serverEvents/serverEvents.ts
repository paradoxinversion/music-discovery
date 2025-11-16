type ServerEventTypes =
  | "ARTIST_PROFILE_CREATED"
  | "ARTIST_PROFILE_DELETED"
  | "ARTIST_PROFILE_UPDATED"
  | "TRACK_PROFILE_CREATED"
  | "TRACK_PROFILE_DELETED"
  | "TRACK_PROFILE_UPDATED"
  | "IMAGE_UPLOADED";

interface BaseEventPayload {
  eventType: ServerEventTypes;
}

export interface ArtistProfileCreatedEventPayload extends BaseEventPayload {
  eventType: "ARTIST_PROFILE_CREATED";
  artistId: string;
  artistName: string;
  createdBy: string;
  createdAt: string;
}

export interface ArtistProfileDeletedEventPayload extends BaseEventPayload {
  eventType: "ARTIST_PROFILE_DELETED";
  artistId: string;
  deletedBy: string;
  deletedAt: string;
}

export interface ArtistProfileUpdatedEventPayload extends BaseEventPayload {
  eventType: "ARTIST_PROFILE_UPDATED";
  artistId: string;
  updatedBy: string;
  updatedAt: string;
}

export interface TrackProfileCreatedEventPayload extends BaseEventPayload {
  eventType: "TRACK_PROFILE_CREATED";
  trackId: string;
  trackTitle: string;
  createdBy: string;
  createdAt: string;
}

export interface TrackProfileDeletedEventPayload extends BaseEventPayload {
  eventType: "TRACK_PROFILE_DELETED";
  trackId: string;
  deletedBy: string;
  deletedAt: string;
}

export interface TrackProfileUpdatedEventPayload extends BaseEventPayload {
  eventType: "TRACK_PROFILE_UPDATED";
  trackId: string;
  updatedBy: string;
  updatedAt: string;
}

export interface ImageUploadedEventPayload extends BaseEventPayload {
  eventType: "IMAGE_UPLOADED";
  imageId: string;
  uploadedAt: string;
  uploadedBy: string;
}

export type ServerEventPayload =
  | ArtistProfileCreatedEventPayload
  | ArtistProfileDeletedEventPayload
  | ArtistProfileUpdatedEventPayload
  | TrackProfileCreatedEventPayload
  | TrackProfileDeletedEventPayload
  | TrackProfileUpdatedEventPayload
  | ImageUploadedEventPayload;

export const createArtistProfileCreatedEvent = (
  artistId: string,
  artistName: string,
  createdBy: string,
): ArtistProfileCreatedEventPayload => {
  return {
    eventType: "ARTIST_PROFILE_CREATED",
    artistId,
    artistName,
    createdBy,
    createdAt: new Date().toISOString(),
  };
};

export const createArtistProfileDeletedEvent = (
  artistId: string,
  deletedBy: string,
): ArtistProfileDeletedEventPayload => {
  return {
    eventType: "ARTIST_PROFILE_DELETED",
    artistId,
    deletedBy,
    deletedAt: new Date().toISOString(),
  };
};

export const createArtistProfileUpdatedEvent = (
  artistId: string,
  updatedBy: string,
): ArtistProfileUpdatedEventPayload => {
  return {
    eventType: "ARTIST_PROFILE_UPDATED",
    artistId,
    updatedBy,
    updatedAt: new Date().toISOString(),
  };
};

export const createImageUploadedEvent = (
  imageId: string,
  uploadedBy: string,
): ImageUploadedEventPayload => {
  return {
    eventType: "IMAGE_UPLOADED",
    imageId,
    uploadedBy,
    uploadedAt: new Date().toISOString(),
  };
};

export const createTrackProfileCreatedEvent = (
  trackId: string,
  trackTitle: string,
  createdBy: string,
): TrackProfileCreatedEventPayload => {
  return {
    eventType: "TRACK_PROFILE_CREATED",
    trackId,
    trackTitle,
    createdBy,
    createdAt: new Date().toISOString(),
  };
};

export const createTrackProfileDeletedEvent = (
  trackId: string,
  deletedBy: string,
): TrackProfileDeletedEventPayload => {
  return {
    eventType: "TRACK_PROFILE_DELETED",
    trackId,
    deletedBy,
    deletedAt: new Date().toISOString(),
  };
};

export const createTrackProfileUpdatedEvent = (
  trackId: string,
  updatedBy: string,
): TrackProfileUpdatedEventPayload => {
  return {
    eventType: "TRACK_PROFILE_UPDATED",
    trackId,
    updatedBy,
    updatedAt: new Date().toISOString(),
  };
};

export const logServerEvent = (event: ServerEventPayload) => {
  console.info(event);
};
