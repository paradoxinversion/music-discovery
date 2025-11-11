import { Storage } from "@google-cloud/storage";
let storage: Storage;
const imgBucketName = "mda-img-store";
if (process.env.NODE_ENV === "production") {
  storage = new Storage();
} else {
  storage = new Storage({
    apiEndpoint: "http://fake-gcs-server:8080",
    projectId: "offbeat-test",
  });
  storage.getBuckets().then((buckets) => {
    if (!buckets[0].find((bucket) => bucket.name === imgBucketName)) {
      storage.createBucket(imgBucketName).catch((err) => {
        console.error("Error creating bucket in local storage emulator:", err);
      });
    } else {
      console.log(
        `Bucket ${imgBucketName} already exists in local storage emulator.`,
      );
    }
  });
}

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
    console.log("Storage url", storage.baseUrl);
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
