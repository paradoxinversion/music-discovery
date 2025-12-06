import { mixed } from "yup";
import { MAX_IMAGE_FILE_SIZE_BYTES } from "./constants";

export default function createImageValidator() {
  return mixed()
    .test(
      "fileSize",
      `File size is too large. Maximum size is ${MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
      (value) => {
        if (value && value instanceof File) {
          return value.size <= MAX_IMAGE_FILE_SIZE_BYTES;
        }
        return true; // If no file is provided, skip this test
      },
    )
    .nullable();
}
