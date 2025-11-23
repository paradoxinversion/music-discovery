import Marquee from "../Marquee/Marquee";
import useWindowDimensions from "../hooks/useWindowDimensions";
type ResourceTileProps = {
  mainText: string;
  subText: string;
  imageUrl?: string;
  onClick: () => void;
};

const ResourceTile = ({
  mainText,
  subText,
  imageUrl,
  onClick,
}: ResourceTileProps) => {
  const { width } = useWindowDimensions();
  return (
    <div
      className="border-b cursor-pointer w-full flex md:hover:bg-gray-900 md:border-0 md:border-gray-300 md:rounded md:w-44 md:hover:scale-105 md:transition-transform md:duration-200 md:p-4 md:flex-col md:items-center"
      onClick={onClick}
    >
      <div className="hidden bg-gray-700 w-16 h-16 md:h-32 md:w-32 md:mb-4 md:flex md:items-center md:justify-center">
        {imageUrl ? (
          <img
            src={`data:image/jpeg;base64,${imageUrl}`}
            alt={`Album ${mainText}`}
            className="h-full w-full object-cover rounded-sm"
          />
        ) : (
          <p>No image</p>
        )}
      </div>
      <div className="w-full h-full ml-4 md:ml-0">
        <h2 className="font-bold md:text-center md:mb-1 w-full overflow-hidden">
          {width > 768 && mainText.length > 20 ? (
            <Marquee text={mainText} />
          ) : (
            mainText
          )}
        </h2>
        <p className="text-sm md:text-center w-full text-gray-400 overflow-hidden">
          {width > 768 && subText.length > 20 ? (
            <Marquee text={subText} />
          ) : (
            subText
          )}
        </p>
      </div>
    </div>
  );
};

export default ResourceTile;
