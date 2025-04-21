
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarUpload } from "./AvatarUpload";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Edit } from "lucide-react";

interface ProfileFormProps {
  name: string;
  birthdate: string;
  avatarUrl: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBirthdateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  name,
  birthdate,
  avatarUrl,
  onNameChange,
  onBirthdateChange,
  onAvatarChange,
  onSubmit,
  onCancel,
  isSaving = false,
}) => {
  return (
    <Card className="w-full max-w-md glass-morphism">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit /> プロフィール編集
        </CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <AvatarUpload
              avatarUrl={avatarUrl}
              onAvatarChange={onAvatarChange}
              size="md"
            />
          </div>
          <div>
            <label className="block mb-1 text-muted-foreground">名前</label>
            <Input
              name="name"
              value={name}
              onChange={onNameChange}
              placeholder="マスターの名前"
              required
            />
          </div>
          <div>
            <label htmlFor="birthdate" className="block mb-1 text-muted-foreground">誕生日</label>
            <Input
              id="birthdate"
              name="birthdate"
              type="date"
              value={birthdate}
              onChange={onBirthdateChange}
              max={new Date().toISOString().slice(0, 10)}
              min="1900-01-01"
              placeholder="誕生日を選択"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit" className="bg-bokumono-primary" disabled={isSaving}>
            {isSaving ? "保存中..." : "保存"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
