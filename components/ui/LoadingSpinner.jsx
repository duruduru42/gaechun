import React from "react";

export default function LoadingSpinner({
  size = "6", // Default size
  color = "orange-500", // Default color
  text = "Loading...", // Default text
}) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-t-4 border-${color} border-opacity-70 border-b-4 border-gray-200`}
      ></div>
      {text && <p className={`ml-2 text-${color} font-semibold`}>{text}</p>}
    </div>
  );
}
