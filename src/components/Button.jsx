import React from 'react';

const Button = ({
  primary = false,
  size = 'medium',
  label,
  onClick,
}) => {
  const baseStyles = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizeStyles = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };
  
  const colorStyles = primary
    ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
    : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 focus:ring-blue-500";
  
  return (
    <button
      type="button"
      className={`${baseStyles} ${sizeStyles[size]} ${colorStyles}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;