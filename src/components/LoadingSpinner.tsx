
import React from "react";

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "ロード中..." }) => {
  return (
    <div className="flex flex-col items-center pt-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bokumono-primary mb-4"></div>
      <div className="text-bokumono-text">{message}</div>
    </div>
  );
};
