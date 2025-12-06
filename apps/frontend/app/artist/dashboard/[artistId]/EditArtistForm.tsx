"use client";
import React from "react";
import editArtistData from "../../../../actions/editArtistData";
import { Button, ErrorText, ImgContainer } from "@mda/components";
import { Formik, Field } from "formik";
import toast from "react-hot-toast";
import { socialPlatformLinks } from "@common/json-data";
import type { SocialPlatformLinks } from "@common/json-data";
import { artistFormValidators } from "@common/validation";
import { ClientEditableArtist } from "@common/types/src/types";
interface EditArtistFormValues {
  artistArt: File | string;
  artistName: string;
  genre: string;
  biography: string;
  links?: {
    [key in SocialPlatformLinks]: string;
  };
}

export default function EditArtistForm({
  artistData,
  artistId,
  setArtistDataAction,
  setEditArtistDataAction,
}: {
  artistData?: ClientEditableArtist;
  artistId: string;
  setArtistDataAction: React.Dispatch<
    React.SetStateAction<ClientEditableArtist | undefined>
  >;
  setEditArtistDataAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const initialValues: EditArtistFormValues = {
    artistArt: "",
    artistName: artistData?.name || "",
    genre: artistData?.genre || "",
    biography: artistData?.biography || "",
    links: Object.keys(socialPlatformLinks).reduce(
      (acc, platform) => {
        if (artistData?.links && artistData.links[platform]) {
          acc[platform] = artistData.links[platform];
        }
        return acc;
      },
      {} as { [key in SocialPlatformLinks]: string },
    ),
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={artistFormValidators.editArtistSchema}
      onSubmit={async (values) => {
        try {
          console.log("Submitting values:", values);
          const updateData = await editArtistData(artistId, {
            name: values.artistName,
            genre: values.genre,
            biography: values.biography,
            artistArt:
              values.artistArt instanceof File ? values.artistArt : undefined,
            links: values.links,
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

          <label htmlFor="biography">Biography</label>
          <Field as="textarea" name="biography" id="biography" />
          {errors.biography && touched.biography ? (
            <ErrorText message={errors.biography} />
          ) : null}

          {Object.keys(socialPlatformLinks)
            .filter((platform) => platform !== "Bandcamp")
            .map((platform) => (
              <div key={platform} className="flex flex-col">
                <label htmlFor={`links.${platform}`}>{platform}</label>
                <Field
                  type="text"
                  name={`links.${platform}`}
                  id={`links.${platform}`}
                  placeholder={`Enter your ${platform} link`}
                />
                {errors.links && touched.links && errors.links[platform] ? (
                  <ErrorText message={errors.links[platform]} />
                ) : null}
              </div>
            ))}
          <div className="flex gap-4">
            <Button label="Save Changes" type="submit" />
            <Button
              label="Cancel"
              category="secondary"
              onClick={() => setEditArtistDataAction?.(false)}
            />
          </div>
        </form>
      )}
    </Formik>
  );
}
