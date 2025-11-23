export interface SidebarButtonProps {
  label: string;
  textAlign?: "left" | "center" | "right";
  onClick?: () => void;
}

const SidebarButton = ({
  label,
  onClick,
  textAlign = "center",
}: SidebarButtonProps) => {
  return (
    <button
      className={`hover:bg-white hover:text-black text-shadow-md text-white transition-colors p-2 w-full text-${textAlign}`}
      onClick={() => onClick && onClick()}
    >
      {label}
    </button>
  );
};

export default SidebarButton;
