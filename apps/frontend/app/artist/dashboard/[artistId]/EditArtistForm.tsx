"use client";
import { EditableArtist } from "@common/types/src/types";
import React from "react";
import editArtistData from "../../../../actions/editArtistData";
import { Button, ErrorText, ImgContainer } from "@mda/components";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { socialPlatformLinks } from "@common/json-data";
import type { SocialPlatformLinks } from "@common/json-data";
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
interface EditArtistFormValues {
  artistArt: File | string;
  artistName: string;
  genre: string;
  bio: string;
  links?: {
    [key in SocialPlatformLinks]: string;
  };
}

const editArtistSchema = Yup.object().shape({
  artistName: Yup.string()
    .min(2, "Artist name must be at least 2 characters")
    .max(100, "Artist name must be at most 100 characters")
    .required("Artist name is required"),
  genre: Yup.string()
    .max(50, "Genre must be at most 50 characters")
    .required("Genre is required"),
  bio: Yup.string().max(1500, "Bio must be at most 1500 characters"),
  artistArt: Yup.mixed()
    .test(
      "fileSize",
      "File size is too large. Maximum size is 2MB.",
      (value) => {
        if (value && value instanceof File) {
          return value.size <= MAX_FILE_SIZE_BYTES;
        }
        return true; // If no file is provided, skip this test
      },
    )
    .nullable(),
  // Additional validations for social links can be added here
});

export default function EditArtistForm({
  artistData,
  artistId,
  setArtistDataAction,
  setEditArtistDataAction,
}: {
  artistData?: EditableArtist;
  artistId: string;
  setArtistDataAction: React.Dispatch<
    React.SetStateAction<EditableArtist | undefined>
  >;
  setEditArtistDataAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const initialValues: EditArtistFormValues = {
    artistArt: "",
    artistName: artistData?.name || "",
    genre: artistData?.genre || "",
    bio: artistData?.biography || "",
    links: Object.values(socialPlatformLinks).reduce(
      (acc, platform) => {
        if (artistData?.links && artistData.links[platform.name]) {
          acc[platform.name] = artistData.links[platform.name];
        } else {
          acc[platform.name] = "";
        }
        return acc;
      },
      {} as { [key in SocialPlatformLinks]: string },
    ),
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={editArtistSchema}
      onSubmit={async (values) => {
        try {
          const updateData = await editArtistData(artistId, {
            name: values.artistName,
            genre: values.genre,
            biography: values.bio,
            artistArt:
              values.artistArt instanceof File ? values.artistArt : undefined,
            links: Object.values(socialPlatformLinks).reduce(
              (acc, platform) => {
                if (values.links[platform.name]) {
                  acc[platform.name] = platform.urlPattern.replace(
                    "{url}",
                    values.links[platform.name],
                  );
                }
                return acc;
              },
              {} as { [key in SocialPlatformLinks]: string },
            ),
          });
          toast.success("Artist updated successfully");
          setArtistDataAction(updateData);
          setEditArtistDataAction?.(false);
        } catch (error) {
          console.error("Error updating artist:", error);
          toast.error("Error updating artist");
          return;
        }
      }}
    >
      {({ handleSubmit, setFieldValue, errors, touched }) => (
        <form
          className="flex flex-col gap-4 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          encType="multipart/form-data"
        >
          <label htmlFor="artistName">Artist Name</label>
          <Field type="text" name="artistName" id="artistName" />
          {errors.artistName && touched.artistName ? (
            <ErrorText message={errors.artistName} />
          ) : null}

          <label htmlFor="artistArt">Artwork</label>
          <ImgContainer
            src={
              artistData.artistArt
                ? `data:image/jpeg;base64,${artistData.artistArt}`
                : undefined
            }
          />
          <input
            type="file"
            name="artistArt"
            id="artistArt"
            accept="image/*"
            onChange={(event) =>
              setFieldValue("artistArt", event.currentTarget.files[0])
            }
          />

          <label htmlFor="genre">Genre</label>
          <Field type="text" name="genre" id="genre" />
          {errors.genre && touched.genre ? (
            <ErrorText message={errors.genre} />
          ) : null}

          <label htmlFor="bio">Bio</label>
          <Field as="textarea" name="bio" id="bio" />
          {errors.bio && touched.bio ? (
            <ErrorText message={errors.bio} />
          ) : null}

          {Object.values(socialPlatformLinks).map((platform) => (
            <div key={platform.name} className="flex flex-col">
              <label htmlFor={`links.${platform.name}`}>{platform.name}</label>
              <Field
                type="text"
                name={`links.${platform.name}`}
                id={`links.${platform.name}`}
                placeholder={`Enter your ${platform.name} link`}
              />
            </div>
          ))}

          <Button label="Save Changes" type="submit" />
          <Button
            label="Cancel"
            onClick={() => setEditArtistDataAction?.(false)}
          />
        </form>
      )}
    </Formik>
  );
}
