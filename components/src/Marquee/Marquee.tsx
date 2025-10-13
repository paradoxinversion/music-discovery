type MarqueeProps = {
  text: string;
};
const Marquee = ({ text }: MarqueeProps) => {
  return (
    <div className="marquee-container">
      <div className="marquee-content">{text}</div>
    </div>
  );
};

export default Marquee;
