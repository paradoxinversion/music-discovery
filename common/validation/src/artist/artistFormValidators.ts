import * as yup from "yup";
import { MAX_IMAGE_FILE_SIZE_BYTES } from "../validationUtils/constants";
import createLinkShapeValidators from "../validationUtils/createLinkShapeValidators";
import { socialPlatformLinks } from "@common/json-data";

export const artistSignupSchema = yup.object({
  artistName: yup
    .string()
    .min(2, "Artist name must be at least 2 characters")
    .max(100, "Artist name must be at most 100 characters")
    .required("Artist name is required"),
  genre: yup
    .string()
    .max(50, "Genre must be at most 50 characters")
    .required("Genre is required"),
  biography: yup
    .string()
    .max(1500, "Biography must be at most 1500 characters")
    .optional(),
  links: yup
    .object()
    .shape(createLinkShapeValidators(socialPlatformLinks))
    .exact("Unknown link keys are not allowed")
    .optional(),
  artistArt: yup
    .mixed()
    .test(
      "fileSize",
      "File size is too large. Maximum size is 2MB.",
      (value) => {
        if (value && value instanceof File) {
          return value.size <= MAX_IMAGE_FILE_SIZE_BYTES;
        }
        return true; // If no file is provided, skip this test
      },
    )
    .nullable(),
});

export type IArtistSignup = yup.InferType<typeof artistSignupSchema>;

export const editArtistSchema = yup.object({
  artistName: yup
    .string()
    .min(2, "Artist name must be at least 2 characters")
    .max(100, "Artist name must be at most 100 characters")
    .required("Artist name is required"),
  genre: yup
    .string()
    .max(50, "Genre must be at most 50 characters")
    .required("Genre is required"),
  biography: yup
    .string()
    .max(1500, "Biography must be at most 1500 characters"),
  links: yup
    .object()
    .shape(createLinkShapeValidators(socialPlatformLinks))
    .exact("Unknown link keys are not allowed")
    .optional(),
  artistArt: yup
    .mixed()
    .test(
      "fileSize",
      "File size is too large. Maximum size is 2MB.",
      (value) => {
        if (value && value instanceof File) {
          return value.size <= MAX_IMAGE_FILE_SIZE_BYTES;
        }
        return true;
      },
    )
    .nullable(),
});

export type IArtistEdit = yup.InferType<typeof editArtistSchema>;
