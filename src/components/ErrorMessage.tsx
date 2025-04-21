
import React from "react";

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center pt-8">
      <div className="text-red-500">{message}</div>
    </div>
  );
};
