import { Storage } from "@google-cloud/storage";
let storage: Storage;

if (process.env.NODE_ENV === "production") {
  storage = new Storage();
} else {
  storage = new Storage({ apiEndpoint: "https://0.0.0.0:4443" });
}

const imgBucketName = "mda-img-store";

async function getImageContents(filePath: string) {
  try {
    const file = storage.bucket(imgBucketName).file(filePath);
    const [contents] = await file.download();
    return contents;
  } catch (error) {
    console.error("Error getting image contents from storage:", error);
    throw error;
  }
}

async function upload(destFileName: string, contents: Express.Multer.File) {
  try {
    const { buffer, mimetype } = contents;
    await storage
      .bucket(imgBucketName)
      .file(destFileName)
      .save(buffer, { contentType: mimetype });

    console.log(`${destFileName} uploaded to ${imgBucketName}.`);
    return destFileName;
  } catch (error) {
    console.error("Error uploading file to storage:", error);
    throw error;
  }
}
export { upload, getImageContents };
export default storage;
