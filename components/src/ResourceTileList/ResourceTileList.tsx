import { JSX } from "react";

export type ResourceTileProps = {
  resourceTiles: JSX.Element[];
};

const ResourceTileList = ({ resourceTiles }: ResourceTileProps) => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {resourceTiles.map((tile, index) => (
        <div key={index}>{tile}</div>
      ))}
    </div>
  );
};

export default ResourceTileList;
