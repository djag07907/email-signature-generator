import React from "react";

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({
  children,
  htmlFor,
}) => {
  return (
    <label
      className="block text-sm font-medium text-gray-300"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};
export default Label;
