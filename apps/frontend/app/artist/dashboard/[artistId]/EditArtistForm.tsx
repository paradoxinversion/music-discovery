"use client";
import { EditableArtist } from "@common/types/src/types";
import React, { useState } from "react";
import editArtistData from "../../../../actions/editArtistData";
import { Button } from "@mda/components";

const socialPlatforms = [
  "facebook",
  "twitterX",
  "instagram",
  "tiktok",
  "bluesky",
];
export default function EditArtistForm({
  artistData,
  artistId,
  setArtistDataAction,
  setEditArtistDataAction,
}: {
  artistData?: EditableArtist;
  artistId: string;
  setArtistDataAction: React.Dispatch<
    React.SetStateAction<EditableArtist | undefined>
  >;
  setEditArtistDataAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [name, setName] = useState(artistData?.name || "");
  const [genre, setGenre] = useState(artistData?.genre || "");
  const [bio, setBio] = useState(artistData?.biography || "");
  const [links, setLinks] = useState(artistData?.links || {});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (socialPlatforms.includes(name)) {
      setLinks((prevLinks) => ({ ...prevLinks, [name]: value }));
    } else {
      switch (name) {
        case "artistName":
          setName(value);
          break;
        case "genre":
          setGenre(value);
          break;
        case "bio":
          setBio(value);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updateData = await editArtistData(artistId, {
      name,
      genre,
      biography: bio,
      links,
    });
    setArtistDataAction(updateData);
  };

  return (
    <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
      <label>Artist Name</label>
      <input
        type="text"
        name="artistName"
        value={name}
        onChange={handleInputChange}
      />
      <label>Genre</label>
      <input
        type="text"
        name="genre"
        value={genre}
        onChange={handleInputChange}
      />
      <label>Bio</label>
      <textarea name="bio" value={bio} onChange={handleInputChange}></textarea>
      {socialPlatforms.map((platform) => (
        <div key={platform} className="flex flex-col">
          <label>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
          <input
            type="text"
            name={platform}
            value={links[platform] || ""}
            placeholder={`Enter your ${platform} link`}
            onChange={handleInputChange}
          />
        </div>
      ))}
      <Button label="Save Changes" type="submit" />
      <Button label="Cancel" onClick={() => setEditArtistDataAction?.(false)} />
    </form>
  );
}
