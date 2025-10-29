"use client";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import checkAuthentication from "../../../../../../actions/checkAuthentication";
import submitEditTrack from "../../../../../../actions/submitEditTrack";
import getTrackById from "../../../../../../actions/getTrackById";
import { Formik, Field } from "formik";
import { ErrorText } from "@mda/components";

interface TrackFormValues {
  title: string;
  genre: string;
  isrc?: string;
  trackArt?: File | string;
}

const linkTypes = ["spotify", "appleMusic", "youtube", "soundcloud"];

export default function EditTrackPage({
  params,
}: {
  params: Promise<{ artistId: string; trackId: string }>;
}) {
  const trackId = use(params).trackId;
  const artistId = use(params).artistId;
  // TODO: Populate initial form values with existing track data without useState
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [links, setLinks] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const initialValues: TrackFormValues = {
    title: "",
    genre: "",
    isrc: "",
    trackArt: undefined,
  };

  useEffect(() => {
    checkAuthentication().then((user) => {
      if (!user) {
        router.push("/login");
      }
    });
    getTrackById(trackId).then((data) => {
      setTitle(data.title);
      setGenre(data.genre);
      setLinks(data.links || {});
    });
  }, []);

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          const editData = {
            title: values.title,
            genre: values.genre,
            isrc: values.isrc,
            artistId: artistId,
            trackArt:
              values.trackArt instanceof File ? values.trackArt : undefined,
          };
          const response = await submitEditTrack(trackId, editData);
          if (response.status === 200) {
            console.log("Track edited successfully");
            router.push(`/artist/dashboard/${artistId}`);
          } else {
            console.log("Error editing track");
          }
        }}
      >
        {({ handleSubmit, setFieldValue, errors, touched }) => (
          <form className="flex flex-col p-4" onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" />
            {errors.title && touched.title ? (
              <ErrorText message={errors.title} />
            ) : null}
            <label>Genre</label>
            <Field id="genre" type="text" name="genre" />
            {errors.genre && touched.genre ? (
              <ErrorText message={errors.genre} />
            ) : null}
            <label>ISRC</label>
            <Field id="isrc" type="text" name="isrc" />
            <p>Links</p>
            {linkTypes.map((link) => (
              <div key={link} className="flex flex-col">
                <label htmlFor={link}>{link}</label>
                <Field id={link} type="text" name={`links.${link}`} />
              </div>
            ))}
            <label htmlFor="trackArt">Track Art</label>
            <input
              id="trackArt"
              type="file"
              name="trackArt"
              onChange={(event) =>
                setFieldValue("trackArt", event.currentTarget.files[0])
              }
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 mt-4 rounded"
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}
