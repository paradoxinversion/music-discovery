export interface IconButtonProps {
  /**
   * An svg icon to be displayed inside the button.
   */
  icon: React.ReactNode;
  onClick: () => void;
}

/**
 * A reusable IconButton component that displays an SVG icon and handles click events.
 */
export const IconButton = ({ icon, onClick }: IconButtonProps) => {
  return (
    <button className="hover:bg-gray-200 p-2 rounded-full" onClick={onClick}>
      {icon}
    </button>
  );
};
