"use client";
import { Formik, Field } from "formik";
import { Button, ErrorText } from "@mda/components";
import axiosInstance from "../../../util/axiosInstance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useGenres from "../../../swrHooks/useGenres";
import { SocialPlatformLinks, socialPlatformLinks } from "@common/json-data";
import { artistFormValidators } from "@common/validation";
interface ArtistSignupFormValues {
  artistName: string;
  genre: string;
  biography: string;
  artistArt?: File | string;
  links?: {
    [key in SocialPlatformLinks]?: string;
  };
}

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
        validationSchema={artistFormValidators.artistSignupSchema}
        onSubmit={async (values) => {
          try {
            const artistSubmissionData = {
              name: values.artistName,
              genre: values.genre,
              biography: values.biography,
              links: Object.keys(values.links || {}).reduce(
                (acc, key) => {
                  const value = values.links?.[key];
                  if (value && value !== "") {
                    acc[key] = value;
                  }
                  return acc;
                },
                {} as Record<string, string>,
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
