import React from "react";

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {children}
    </div>
  );
};
export const CardContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="p-4">{children}</div>;
};
export default Card;
