"use client";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { ErrorText } from "@mda/components";
import axiosInstance from "../../../util/axiosInstance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
interface ArtistSignupFormValues {
  artistName: string;
  genre: string;
  biography: string;
  artistArt?: File | string;
}

const artistSignupSchema = Yup.object().shape({
  artistName: Yup.string()
    .min(2, "Artist name must be at least 2 characters")
    .max(100, "Artist name must be at most 100 characters")
    .required("Artist name is required"),
  genre: Yup.string()
    .max(50, "Genre must be at most 50 characters")
    .required("Genre is required"),
  biography: Yup.string().max(
    1500,
    "Biography must be at most 1500 characters",
  ),
});

export default function ArtistSignup() {
  const router = useRouter();
  const initialValues: ArtistSignupFormValues = {
    artistName: "",
    genre: "",
    biography: "",
    artistArt: "",
  };

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">Artist Setup</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={artistSignupSchema}
        onSubmit={async (values) => {
          try {
            const artistSubmissionData = {
              name: values.artistName,
              genre: values.genre,
              biography: values.biography,
              artistArt:
                values.artistArt instanceof File ? values.artistArt : undefined,
            };

            await axiosInstance.post(`/artists`, artistSubmissionData, {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            toast.success("Artist profile created successfully");
            router.push("/artist/dashboard");
          } catch (error) {
            console.error("Error saving artist profile:", error);
            toast.error("Error saving artist profile");
          }
        }}
      >
        {({ handleSubmit, setFieldValue, errors, touched }) => (
          <form
            className="flex flex-col space-y-4 w-md mt-4"
            onSubmit={handleSubmit}
          >
            <label htmlFor="artistName">Artist Name*</label>
            <Field id="artistName" type="text" name="artistName" />
            {errors.artistName && touched.artistName ? (
              <ErrorText message={errors.artistName} />
            ) : null}

            <label htmlFor="genre">Genre*</label>
            <Field id="genre" type="text" name="genre" />
            {errors.genre && touched.genre ? (
              <ErrorText message={errors.genre} />
            ) : null}

            <label htmlFor="biography">Biography*</label>
            <Field as="textarea" name="biography" />
            {errors.biography && touched.biography ? (
              <ErrorText message={errors.biography} />
            ) : null}

            <label htmlFor="artistArt">Track Art</label>
            <input
              id="artistArt"
              type="file"
              name="artistArt"
              onChange={(event) =>
                setFieldValue("artistArt", event.currentTarget.files[0])
              }
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Artist Profile
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}
