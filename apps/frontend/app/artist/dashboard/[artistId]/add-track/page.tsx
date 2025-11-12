"use client";
import { use } from "react";
import submitTrack from "../../../../../actions/submitTrack";
import { useRouter } from "next/navigation";
import { Button, ErrorText } from "@mda/components";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import useSWR from "swr";
import axiosInstance from "../../../../../util/axiosInstance";
import { CommonLinkKeyMusic } from "@common/types/src/types";
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);
interface TrackFormValues {
  title: string;
  genre: string;
  isrc?: string;
  trackArt?: File | string;
  links?: {
    [key in CommonLinkKeyMusic]?: string;
  };
}
const socialPlatforms = ["spotify", "appleMusic", "youtube", "soundcloud"];
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
  const { data: genreData, error, isLoading } = useSWR(`genre`, fetcher);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading genre data.</div>;
  }

  const initialValues: TrackFormValues = {
    title: "",
    genre: "",
    isrc: undefined,
    trackArt: undefined,
    links: socialPlatforms.reduce(
      (acc, platform) => ({
        ...acc,
        [platform]: "",
      }),
      {} as { [key in CommonLinkKeyMusic]?: string },
    ),
  };

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
              links: socialPlatforms.reduce(
                (acc, platform) => {
                  if (values[platform]) {
                    acc[platform] = values[platform];
                  }
                  return acc;
                },
                {} as { [key: string]: string },
              ),
            };
            console.log(values);
            console.log(trackSubmissionData);
            const response = await submitTrack(trackSubmissionData);
            if (response.status === 201) {
              toast.success("Track added successfully");
              router.push(`/artist/dashboard/${artistId}`);
            }
          } catch (error) {
            console.error("Error submitting track:", error);
            toast.error("Error submitting track");
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
            <Field
              id="genre"
              as="select"
              name="genre"
              className="bg-gray-500 rounded py-2 px-3"
            >
              <option value="">Select a genre</option>
              {genreData?.genres.map((genre: string) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </Field>
            {errors.genre && touched.genre ? (
              <ErrorText message={errors.genre} />
            ) : null}
            <label htmlFor="isrc">ISRC</label>
            <Field id="isrc" type="text" name="isrc" />
            {errors.isrc && touched.isrc ? (
              <ErrorText message={errors.isrc} />
            ) : null}
            <p>Links</p>
            {socialPlatforms.map((platform) => (
              <div key={platform} className="flex flex-col">
                <label htmlFor={platform}>
                  {platform
                    .split(/(?=[A-Z])/)
                    .join(" ")
                    .toLowerCase()}
                </label>
                <Field id={platform} type="text" name={`${platform}`} />
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
            <Button label="Add Track" type="submit" />
          </form>
        )}
      </Formik>
    </div>
  );
}
