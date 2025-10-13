"use client";
import { useRouter } from "next/navigation";

import { use, useEffect, useState } from "react";
import checkAuthentication from "../../../../../../actions/checkAuthentication";
import Joi from "joi";
import submitEditTrack from "../../../../../../actions/submitEditTrack";
import getTrackById from "../../../../../../actions/getTrackById";
const linkTypes = ["spotify", "appleMusic", "youtube", "soundcloud"];
export default function Page({
  params,
}: {
  params: Promise<{ artistId: string; trackId: string }>;
}) {
  const trackId = use(params).trackId;
  const artistId = use(params).artistId;
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [links, setLinks] = useState<{ [key: string]: string }>({});
  const router = useRouter();
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "genre") {
      setGenre(value);
    } else if (name.startsWith("links.")) {
      const linkKey = name.split(".")[1];
      setLinks((prev) => ({ ...prev, [linkKey]: value }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitSchema = Joi.object({
      title: Joi.string().required(),
      genre: Joi.string().required(),
      links: Joi.object()
        .pattern(Joi.string().valid(...linkTypes), Joi.string().uri())
        .optional(),
    });
    const { error, value } = submitSchema.validate({ title, genre, links });
    if (error) {
      console.log(error.message);
      return;
    }
    console.log(value);
    const response = await submitEditTrack(trackId, value);
    if (response.status === 200) {
      console.log("Track edited successfully");
      router.push(`/artist/dashboard/${artistId}`);
    } else {
      console.log("Error editing track");
    }
  };
  return (
    <div>
      <form className="flex flex-col p-4">
        <label>Title</label>
        <input type="text" name="title" value={title} onChange={handleChange} />
        <label>Genre</label>
        <input type="text" name="genre" value={genre} onChange={handleChange} />
        <p>Links</p>
        {linkTypes.map((link) => (
          <div key={link} className="flex flex-col">
            <label>{link}</label>
            <input
              type="text"
              name={`links.${link}`}
              value={links[link] || ""}
              onChange={handleChange}
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 mt-4 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
