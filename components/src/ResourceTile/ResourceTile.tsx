import Marquee from "../Marquee/Marquee";

type ResourceTileProps = {
  mainText: string;
  subText: string;
  onClick: () => void;
};

const ResourceTile = ({ mainText, subText, onClick }: ResourceTileProps) => {
  return (
    <div
      className="cursor-pointer w-48 hover:scale-105 transition-transform duration-200 border border-gray-300 rounded p-4 flex flex-col items-center"
      onClick={onClick}
    >
      <div className="bg-gray-200 h-32 w-32 mb-4 flex items-center justify-center">
        <img
          src={`https://picsum.photos/512?random`}
          alt={`Album ${mainText}`}
          className="h-full w-full object-cover"
        />
      </div>
      <h2 className="font-bold text-center mb-1 w-full overflow-hidden">
        {mainText.length > 20 ? <Marquee text={mainText} /> : mainText}
      </h2>
      <p className="text-sm text-center w-full text-gray-400 overflow-hidden">
        {subText.length > 20 ? <Marquee text={subText} /> : subText}
      </p>
    </div>
  );
};

export default ResourceTile;
