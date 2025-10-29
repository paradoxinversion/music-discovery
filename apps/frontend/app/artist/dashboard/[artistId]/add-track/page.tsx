"use client";
import { use, useEffect } from "react";
import submitTrack from "../../../../../actions/submitTrack";
import checkAuthentication from "../../../../../actions/checkAuthentication";
import { useRouter } from "next/navigation";
import { Button, ErrorText } from "@mda/components";
import { Formik, Field } from "formik";
import * as Yup from "yup";

interface TrackFormValues {
  title: string;
  genre: string;
  isrc?: string;
  trackArt?: File | string;
}

const trackSchema = Yup.object().shape({
  title: Yup.string().required("Track title is required"),
  genre: Yup.string().required("Genre is required"),
  isrc: Yup.string(),
});

export default function AddTrackPage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const artistId = use(params).artistId;
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
  }, []);

  return (
    <div className="w-full p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={trackSchema}
        onSubmit={async (values) => {
          try {
            const trackSubmissionData = {
              title: values.title,
              genre: values.genre,
              isrc: values.isrc,
              artistId: artistId,
              trackArt:
                values.trackArt instanceof File ? values.trackArt : undefined,
            };
            const response = await submitTrack(trackSubmissionData);
            if (response.status === 201) {
              router.push(`/artist/dashboard/${artistId}`);
            }
          } catch (error) {
            console.error("Error submitting track:", error);
          }
        }}
      >
        {({ handleSubmit, setFieldValue, errors, touched }) => (
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <h1>Add New Track</h1>
            <label htmlFor="title">Track Title</label>
            <Field id="title" type="text" name="title" />
            {errors.title && touched.title ? (
              <ErrorText message={errors.title} />
            ) : null}
            <label htmlFor="genre">Genre</label>
            <Field id="genre" type="text" name="genre" />
            {errors.genre && touched.genre ? (
              <ErrorText message={errors.genre} />
            ) : null}
            <label htmlFor="isrc">ISRC</label>
            <Field id="isrc" type="text" name="isrc" />
            {errors.isrc && touched.isrc ? (
              <ErrorText message={errors.isrc} />
            ) : null}
            <label htmlFor="trackArt">Track Art</label>
            <input
              id="trackArt"
              type="file"
              name="trackArt"
              onChange={(event) =>
                setFieldValue("trackArt", event.currentTarget.files[0])
              }
            />
            <Button label="Add Track" type="submit" />
          </form>
        )}
      </Formik>
    </div>
  );
}
