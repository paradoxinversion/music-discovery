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
import { musicPlatformLinks, MusicPlatformLinks } from "@common/json-data";

interface TrackFormValues {
  title: string;
  genre: string;
  isrc?: string;
  trackArt?: File | string;
  links?: {
    [key in MusicPlatformLinks]: string;
  };
}

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
    links: Object.keys(data.data.links).reduce((acc: any, key: string) => {
      const re = /\/([^\/?#]+)\/?(\?[^#]*)?(?:#.*)?$/;
      const match = data.data.links[key].match(re);
      if (match === null) return acc;
      acc[key] = match[0].slice(1);
      return acc;
    }, {}) as {
      [key in MusicPlatformLinks]: string;
    },
  };

  return (
    <div className="w-full p-4">
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
            links: Object.keys(values.links).reduce(
              (acc: any, key: string) => {
                if (values.links && values.links[key as MusicPlatformLinks]) {
                  acc[key] = musicPlatformLinks[
                    key as MusicPlatformLinks
                  ].replace("{url}", values.links[key as MusicPlatformLinks]);
                }
                return acc;
              },
              {} as { [key in MusicPlatformLinks]: string },
            ),
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
          <form className="flex flex-col" onSubmit={handleSubmit}>
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
            {Object.keys(musicPlatformLinks)
              .filter((link) => link !== "Bandcamp")
              .map((link) => (
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
            <div className="flex gap-4">
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
              <button
                type="button"
                className="bg-blue-500 text-white p-2 mt-4 rounded"
                onClick={() => router.push(`/artist/dashboard/${artistId}`)}
              >
                Cancel
              </button>
            </div>
            {confirmDelete && (
              <div className="mt-4">
                <p>Are you sure you want to delete this track?</p>
                <div className="flex gap-4">
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
                  <button
                    type="button"
                    className="bg-blue-500 text-white p-2 mt-2 rounded"
                    onClick={async () => {
                      setConfirmDelete(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </Formik>
    </div>
  );
}
