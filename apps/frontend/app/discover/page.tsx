"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tracks/random`,
      );
      console.log(response.data);
      setTracks(response.data.data);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-2">
        Discover something you'll love
      </h1>
      <p>Select a genre to explore new music:</p>
      <div className="mt-4 space-x-2">
        <select className="border border-gray-300 rounded px-2 py-1">
          <option>Pop</option>
          <option>Rock</option>
          <option>Jazz</option>
          <option>Classical</option>
          <option>Hip-Hop</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Explore
        </button>
      </div>

      <div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tracks.map((item) => (
            <div
              key={item._id}
              className="cursor-pointer hover:scale-105 transition-transform duration-200 border border-gray-300 rounded p-4 flex flex-col items-center"
              onClick={() => router.push(`/track/${item._id}`)}
            >
              <div className="bg-gray-200 h-32 w-32 mb-4 flex items-center justify-center">
                <img
                  src={`https://picsum.photos/512?random=${item._id}`}
                  alt={`Album ${item.title}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="font-bold">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.artistName}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          {/* next page button */}
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 float-left">
            Previous Page
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 float-right">
            Next Page
          </button>
        </div>
      </div>

      <footer className="mt-auto py-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Jedai Saboteur. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
