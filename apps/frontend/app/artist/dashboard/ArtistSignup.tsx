"use client";
import axios from "axios";
import { useState } from "react";

export default function ArtistSignup() {
  const [artistName, setArtistName] = useState("");
  const [genre, setGenre] = useState("");
  const [biography, setBiography] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    if (id === "artistName") {
      setArtistName(value);
    } else if (id === "genre") {
      setGenre(value);
    } else if (id === "biography") {
      setBiography(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/artists`,
        {
          name: artistName,
          genre,
          biography,
        },
        { withCredentials: true },
      );
    } catch (error) {
      console.error("Error saving artist profile:", error);
    }
  };

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">Artist Setup</h1>
      <form className="flex flex-col space-y-4 w-md mt-4">
        <label htmlFor="artistName">Artist Name*</label>
        <input
          type="text"
          id="artistName"
          className="border border-gray-300 rounded px-3 py-2"
          required
          value={artistName}
          onChange={handleInputChange}
        />
        <label htmlFor="genre">Genre*</label>
        <input
          type="text"
          id="genre"
          className="border border-gray-300 rounded px-3 py-2"
          required
          value={genre}
          onChange={handleInputChange}
        />
        <label htmlFor="biography">Biography*</label>
        <textarea
          id="biography"
          className="border border-gray-300 rounded px-3 py-2"
          required
          value={biography}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Save Artist Profile
        </button>
      </form>
    </div>
  );
}
