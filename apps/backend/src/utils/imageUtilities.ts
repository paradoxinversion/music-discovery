import { IUser } from "@common/types/src/types";

export type pathTypes = "artistArt" | "albumArt" | "trackArt";

/**
 * Creates an object storage path for an image
 * @param user - The user that owns the image
 * @param image - The image that to create a path for
 * @param pathType - The type of image to create a path for
 * @param resourceName - The artist, track, or album name the image is associated with
 * @returns - The formatted image path (ie, "testUser/artistArt/super-cool-underground-artist")
 */
const createImagePath = (
  user: IUser,
  image: Express.Multer.File,
  resourceName: string,
) => {
  return `${user.username.toLowerCase()}/${image.fieldname}/${resourceName.toLowerCase().replaceAll(" ", "-")}`;
};

export { createImagePath };
