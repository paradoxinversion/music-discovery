interface ImgContainerProps {
  src?: string;
  alt?: string;
  className?: string;
}

const ImgContainer = ({ src, alt, className }: ImgContainerProps) => {
  const style =
    className || "border my-4 w-64 h-64 object-cover rounded-lg bg-gray-800";

  return src ? (
    <img src={src} alt={alt} className={style} />
  ) : (
    <div className="my-4 h-64 w-64 object-cover rounded-lg text-center flex items-center justify-center bg-gray-800">
      <span>No image available</span>
    </div>
  );
};

export default ImgContainer;

export type { ImgContainerProps };
