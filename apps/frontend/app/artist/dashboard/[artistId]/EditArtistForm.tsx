"use client";
import { EditableArtist } from "@common/types/src/types";
import React from "react";
import editArtistData from "../../../../actions/editArtistData";
import { Button, ErrorText } from "@mda/components";
import { Formik, Field } from "formik";
import * as Yup from "yup";

interface EditArtistFormValues {
  artistArt: File | string;
  artistName: string;
  genre: string;
  bio: string;
  facebook?: string;
  twitterX?: string;
  instagram?: string;
  tiktok?: string;
  bluesky?: string;
}

const socialPlatforms = [
  "facebook",
  "twitterX",
  "instagram",
  "tiktok",
  "bluesky",
];

const editArtistSchema = Yup.object().shape({
  artistName: Yup.string()
    .min(2, "Artist name must be at least 2 characters")
    .max(100, "Artist name must be at most 100 characters")
    .required("Artist name is required"),
  genre: Yup.string()
    .max(50, "Genre must be at most 50 characters")
    .required("Genre is required"),
  bio: Yup.string().max(1500, "Bio must be at most 1500 characters"),
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
    ...artistData?.links,
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={editArtistSchema}
      onSubmit={async (values) => {
        const updateData = await editArtistData(artistId, {
          name: values.artistName,
          genre: values.genre,
          biography: values.bio,
          artistArt:
            values.artistArt instanceof File ? values.artistArt : undefined,
          links: socialPlatforms.reduce(
            (acc, platform) => {
              if (values[platform]) {
                acc[platform] = values[platform];
              }
              return acc;
            },
            {} as { [key: string]: string },
          ),
        });
        setArtistDataAction(updateData);
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
          <label>Artist Name</label>
          <Field type="text" name="artistName" />
          {errors.artistName && touched.artistName ? (
            <ErrorText message={errors.artistName} />
          ) : null}

          <label>Photo</label>
          <input
            type="file"
            name="photo"
            onChange={(event) =>
              setFieldValue("artistArt", event.currentTarget.files[0])
            }
          />

          <label>Genre</label>
          <Field type="text" name="genre" />
          {errors.genre && touched.genre ? (
            <ErrorText message={errors.genre} />
          ) : null}

          <label>Bio</label>
          <Field as="textarea" name="bio" />
          {errors.bio && touched.bio ? (
            <ErrorText message={errors.bio} />
          ) : null}

          {socialPlatforms.map((platform) => (
            <div key={platform} className="flex flex-col">
              <label>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </label>
              <Field
                type="text"
                name={platform}
                placeholder={`Enter your ${platform} link`}
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
