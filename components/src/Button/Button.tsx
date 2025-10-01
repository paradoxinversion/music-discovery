"use client";
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button
      className="hover:bg-blue-700 bg-blue-500 text-white px-4 py-2 rounded"
      onClick={onClick}
    >
      {label}
    </button>
  );
};
