"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import submitEditTrack from "../../../../../../actions/submitEditTrack";
import { Formik, Field } from "formik";
import { ErrorText } from "@mda/components";
import axiosInstance from "../../../../../../util/axiosInstance";
import useSWR from "swr";
import deleteTrack from "../../../../../../actions/deleteTrack";
import toast from "react-hot-toast";

interface TrackFormValues {
  title: string;
  genre: string;
  isrc?: string;
  trackArt?: File | string;
  links?: {
    [key: string]: string;
  };
}

const linkTypes = ["spotify", "appleMusic", "youtube", "soundcloud"];
const fetcher = (url: string) =>
  axiosInstance.get(url, { withCredentials: true }).then((res) => res.data);
export default function EditTrackPage({
  params,
}: {
  params: Promise<{ artistId: string; trackId: string }>;
}) {
  const trackId = use(params).trackId;
  const artistId = use(params).artistId;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data, error, isLoading } = useSWR(
    `tracks/${trackId}?withLinks=true`,
    fetcher,
  );
  const router = useRouter();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading track data.</div>;
  }

  const initialValues: TrackFormValues = {
    title: data.data.title,
    genre: data.data.genre,
    isrc: data.data.isrc || undefined,
    trackArt: data.data.trackArt,
    links: data.data.links,
  };

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
            toast.success("Track edited successfully");
            router.push(`/artist/dashboard/${artistId}`);
          } else {
            toast.error("Error editing track");
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
            <button
              type="button"
              className="bg-red-500 text-white p-2 mt-4 rounded"
              onClick={() => setConfirmDelete(true)}
            >
              Delete Track
            </button>
            {confirmDelete && (
              <div className="mt-4">
                <p>Are you sure you want to delete this track?</p>
                <button
                  type="button"
                  className="bg-red-700 text-white p-2 mt-2 rounded"
                  onClick={async () => {
                    await deleteTrack(trackId);
                    setConfirmDelete(false);
                    toast.success("Track deleted successfully");
                    router.push(`/artist/dashboard/${artistId}`);
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            )}
          </form>
        )}
      </Formik>
    </div>
  );
}
