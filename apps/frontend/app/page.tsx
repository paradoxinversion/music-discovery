"use client";
import { Button } from "@mda/components";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex flex-col flex-grow items-center py-2">
      <p className="mt-4 text-6xl font-bold">Discover new music</p>
      <p className="mt-4 text-3xl font-bold">tailored to your taste</p>
      <div className="mt-4 space-x-2">
        <img
          src="https://picsum.photos/1024/512?random=1"
          alt="Music Cover"
          className="object-cover rounded-lg mb-8"
        />
      </div>
      <Button label="Get Started" onClick={() => router.push(`/discover`)} />
    </div>
  );
}
