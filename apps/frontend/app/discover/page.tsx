"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mda/components";

export default function Page() {
  const router = useRouter();

  const [tracks, setTracks] = useState([]);
  const fetchRandomTracks = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/tracks/random`,
    );
    setTracks(response.data.data);
  };
  useEffect(() => {
    fetchRandomTracks();
  }, []);

  return (
    <div className="flex h-full flex-grow">
      <div className="flex-grow px-4 py-2">
        <header>
          <h1 className="text-3xl font-bold mb-2">
            Discover something you'll love
          </h1>
        </header>
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
                <p className="text-sm text-gray-400">{item.artistName}</p>
              </div>
            ))}
          </div>
          <div className="flex mt-4 justify-center">
            <Button
              label="Refresh"
              onClick={() => {
                fetchRandomTracks();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
