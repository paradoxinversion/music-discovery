"use client";
import { Button } from "@mda/components";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    // <div className="flex flex-col items-center min-h-screen py-2">
    <div className="flex flex-col items-center py-2">
      <p className="mt-4">Discover new music tailored to your taste.</p>
      <div className="mt-4 space-x-2">
        <img
          src="https://picsum.photos/1024/512?random=1"
          alt="Music Cover"
          className="object-cover rounded-lg mb-8"
        />
      </div>
      <Button label="Get Started" onClick={() => router.push(`/discover`)} />
      {/* <footer className="mt-auto py-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Jedai Saboteur. All rights reserved.
        </p>
      </footer> */}
    </div>
  );
}
