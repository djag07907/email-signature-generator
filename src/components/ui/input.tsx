import React from "react";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return (
    <input
      className="border border-gray-400 bg-gray-200 text-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-800"
      placeholder={props.placeholder}
      {...props}
    />
  );
};
export default Input;
