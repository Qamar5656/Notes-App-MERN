import React from "react";

const Button = ({ caption, className }) => {
  const baseClass =
    "cursor-pointer bg-gray-800 text-white py-3 px-5 rounded-lg font-semibold hover:scale-105 transform transition";
  // "cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-5 rounded-lg font-semibold hover:scale-105 transform transition";
  return (
    <>
      <button className={`${baseClass} + ${className}`}>{caption}</button>
    </>
  );
};

export default Button;
