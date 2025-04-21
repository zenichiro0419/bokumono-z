
import React from "react";

interface AvatarUploadProps {
  avatarUrl: string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: "sm" | "md" | "lg";
  isEditable?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  avatarUrl,
  onAvatarChange,
  size = "md",
  isEditable = true,
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-700`}>
        <img
          src={avatarUrl}
          alt="Avatar"
          className="object-cover w-full h-full"
        />
      </div>
      {isEditable && (
        <label
          htmlFor="avatar-upload"
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer text-xs font-medium text-white transition-opacity rounded-full"
        >
          画像変更
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
          />
        </label>
      )}
    </div>
  );
};
