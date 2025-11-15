export interface SidebarButtonProps {
  label: string;
  onClick?: () => void;
}

const SidebarButton = ({ label, onClick }: SidebarButtonProps) => {
  return (
    <button
      className="hover:bg-white hover:text-black text-shadow-md text-white transition-colors p-2 w-full"
      onClick={() => onClick && onClick()}
    >
      {label}
    </button>
  );
};

export default SidebarButton;
