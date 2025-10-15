"use client";
import { use, useEffect, useState } from "react";
import submitTrack from "../../../../../actions/submitTrack";
import Joi from "joi";
import checkAuthentication from "../../../../../actions/checkAuthentication";
import { useRouter } from "next/navigation";
import { Button } from "@mda/components";

export default function Page({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const artistId = use(params).artistId;
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [isrc, setIsrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    checkAuthentication().then((user) => {
      if (!user) {
        router.push("/login");
      }
    });
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "genre") {
      setGenre(value);
    } else if (name === "isrc") {
      setIsrc(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionSchema = Joi.object({
      title: Joi.string().required(),
      genre: Joi.string().required(),
      isrc: Joi.string().optional(),
    });
    const { error } = submissionSchema.validate({ title, genre, isrc });
    if (error) {
      console.log(`Validation error: ${error.message}`);
      return;
    }
    const trackSubmissionData = {
      title,
      genre,
      isrc,
      artistId: artistId,
    };
    const response = await submitTrack(trackSubmissionData);
    if (response.status === 201) {
      router.push(`/artist/dashboard/${artistId}`);
    }
  };

  return (
    <div className="w-full p-4">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <h1>Add New Track</h1>
        <label>Track Title:</label>
        <input type="text" name="title" onChange={handleInputChange} required />
        <label>Genre:</label>
        <input type="text" name="genre" onChange={handleInputChange} required />
        <label>ISRC:</label>
        <input
          className="mb-4"
          type="text"
          name="isrc"
          onChange={handleInputChange}
        />
        <Button label="Add Track" type="submit" />
      </form>
    </div>
  );
}
