"use client";
import AccessUnauthorized from "../../../../commonComponents/AccessUnauthorized";
import useAuth from "../../../../swrHooks/useAuth";
import ArtistSignup from "../ArtistSignup";

export default function CreateArtistPage() {
  const { error, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <AccessUnauthorized />;
  }
  return (
    <div className="p-4 overflow-y-auto">
      <ArtistSignup />
    </div>
  );
}
