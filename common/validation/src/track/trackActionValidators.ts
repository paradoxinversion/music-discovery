import * as yup from "yup";

export const setFavoriteTrackSchema = yup.object({
  trackId: yup.string().required("trackId is required"),
  remove: yup.boolean().default(false),
});
