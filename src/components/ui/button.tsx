import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary";
}
const Button: React.FC<ButtonProps> = ({
  variant = "default",
  children,
  ...props
}) => {
  const baseStyles = "px-4 py-2 rounded focus:outline-none focus:ring";
  const variantStyles = {
    default: "bg-gray-700 text-white hover:bg-gray-600",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-green-500 text-white hover:bg-green-600",
  };
  return (
    <button className={`${baseStyles} ${variantStyles[variant]}`} {...props}>
      {children}
    </button>
  );
};
export default Button;
