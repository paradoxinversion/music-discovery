import { getImageContents } from "../../cloud/storage";

export const getImageAtPath = async (imagePath: string) => {
  try {
    const image = await getImageContents(imagePath);
    return image;
  } catch (error) {
    console.error("Error getting image at path:", error);
  }
};
