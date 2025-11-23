"use client";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { Button, ErrorText } from "@mda/components";
import axiosInstance from "../../../util/axiosInstance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useGenres from "../../../swrHooks/useGenres";
import { SocialPlatformLinks, socialPlatformLinks } from "@common/json-data";
interface ArtistSignupFormValues {
  artistName: string;
  genre: string;
  biography: string;
  artistArt?: File | string;
  links?: {
    [key in SocialPlatformLinks]?: string;
  };
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
  const { genres, genresLoading, genreLoadError } = useGenres();
  const router = useRouter();
  const initialValues: ArtistSignupFormValues = {
    artistName: "",
    genre: "",
    biography: "",
    artistArt: "",
    links: Object.keys(socialPlatformLinks).reduce(
      (acc, key) => {
        acc[key as SocialPlatformLinks] = "";
        return acc;
      },
      {} as { [key in SocialPlatformLinks]?: string },
    ),
  };
  if (genresLoading) {
    return <div>Loading...</div>;
  }
  if (genreLoadError) {
    return <div>Error loading genres</div>;
  }
  return (
    <div className="mt-4 overflow-y-auto">
      <h1 className="text-2xl font-bold">Artist Setup</h1>
      <p>By adding an artist, you assert that:</p>
      <ul className="list-disc list-inside">
        <li>
          You are the rightful owner or have the necessary rights to manage the
          artist profile.
        </li>
        <li>You have released music under the artist's name.</li>
        <li>You agree to our terms of service and privacy policy.</li>
        <li>You will provide accurate and truthful information.</li>
      </ul>
      <Formik
        initialValues={initialValues}
        validationSchema={artistSignupSchema}
        onSubmit={async (values) => {
          try {
            const artistSubmissionData = {
              name: values.artistName,
              genre: values.genre,
              biography: values.biography,
              links: Object.keys(socialPlatformLinks).reduce(
                (acc, key) => {
                  const v = values.links[key as SocialPlatformLinks];
                  if (v) {
                    acc[key as SocialPlatformLinks] = socialPlatformLinks[
                      key as SocialPlatformLinks
                    ].urlPattern.replace(
                      "{url}",
                      values.links[key as SocialPlatformLinks],
                    );
                  }
                  return acc;
                },
                {} as { [key in SocialPlatformLinks]?: string },
              ),
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
            <Field id="genre" as="select" name="genre">
              <option value="">Select a genre</option>
              {genres.genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </Field>
            {errors.genre && touched.genre ? (
              <ErrorText message={errors.genre} />
            ) : null}

            <label htmlFor="biography">Biography*</label>
            <Field as="textarea" name="biography" />
            {errors.biography && touched.biography ? (
              <ErrorText message={errors.biography} />
            ) : null}
            {Object.values(socialPlatformLinks)
              .filter((platform) => platform.name !== "Bandcamp")
              .map((platform) => (
                <div key={platform.name} className="flex flex-col">
                  <label htmlFor={`links.${platform.name}`}>
                    {platform.name}
                  </label>
                  <Field
                    type="text"
                    name={`links.${platform.name}`}
                    id={`links.${platform.name}`}
                    placeholder={`Enter your ${platform.name} link`}
                  />
                </div>
              ))}

            <label htmlFor="artistArt">Track Art</label>
            <input
              id="artistArt"
              type="file"
              name="artistArt"
              onChange={(event) =>
                setFieldValue("artistArt", event.currentTarget.files[0])
              }
            />
            <Button label="Save Artist Profile" type="submit" />
          </form>
        )}
      </Formik>
    </div>
  );
}
