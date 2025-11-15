"use client";
export interface ButtonProps {
  label: string;
  onClick?: () =>
    | void
    | ((e: React.FormEvent<HTMLFormElement>) => Promise<void>);
  type?: "button" | "submit" | "reset" | undefined;
  category?: "primary" | "secondary" | "warning" | "danger";
}

export const Button = ({
  label,
  onClick,
  type = "button",
  category = "primary",
}: ButtonProps) => {
  const categoryClasses = {
    primary:
      "hover:bg-blue-800 hover:text-white text-blue-500 border border-blue-500 transition-colors px-4 py-2 rounded",
    secondary:
      "hover:bg-gray-800 hover:text-white text-gray-300 border border-gray-700 transition-colors px-4 py-2 rounded",
    warning:
      "hover:bg-yellow-700 hover:text-white text-yellow-500 border border-yellow-500 transition-colors px-4 py-2 rounded",
    danger:
      "hover:bg-red-700 hover:text-white text-red-500 border border-red-500 transition-colors px-4 py-2 rounded",
  };

  return (
    <button className={categoryClasses[category]} onClick={onClick} type={type}>
      {label}
    </button>
  );
};
