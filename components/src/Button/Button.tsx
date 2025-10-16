"use client";
export interface ButtonProps {
  label: string;
  onClick?: () =>
    | void
    | ((e: React.FormEvent<HTMLFormElement>) => Promise<void>);
  type?: "button" | "submit" | "reset" | undefined;
}

export const Button = ({ label, onClick, type = "button" }: ButtonProps) => {
  return (
    <button
      className="hover:bg-blue-700 bg-blue-500 text-white px-4 py-2 rounded"
      onClick={onClick}
      type={type}
    >
      {label}
    </button>
  );
};
