import React from "react";

interface ToggleGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactElement<ToggleGroupItemProps>[];
}
export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  value,
  onValueChange,
  children,
}) => {
  return (
    <div className="flex space-x-2">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isSelected: child.props.value === value,
            onValueChange,
          });
        }
        return null;
      })}
    </div>
  );
};
interface ToggleGroupItemProps {
  value: string;
  isSelected: boolean;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}
export const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({
  value,
  isSelected,
  onValueChange,
  children,
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-md ${
        isSelected ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
      }`}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
};
