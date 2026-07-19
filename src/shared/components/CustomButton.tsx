"use client";

type ButtonProps = {
  text: string;
  onClick: () => void;
  variant?: "light" | "dark";
};

export default function CustomButton({
  text,
  onClick,
  variant = "light",
}: ButtonProps) {
  const variants = {
    light: "bg-white text-black hover:bg-gray-100",
    dark: "bg-black text-white hover:bg-gray-900",
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-medium transition ${variants[variant]}`}
    >
      {text}
    </button>
  );
}
