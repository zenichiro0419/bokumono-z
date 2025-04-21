
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Edit } from "lucide-react";

// 仮データ
const initialProfile = {
  name: "マスター太郎",
  bio: "このアプリの管理人です。ペット達の管理はお任せください。",
  avatarUrl: "/placeholder.svg",
};

const EditMasterProfilePage: React.FC = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatarUrl);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      setProfile({ ...profile, avatarUrl: objectUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 本来はここで保存ロジック
    navigate("/master");
  };

  return (
    <div className="flex flex-col items-center pt-8">
      <Card className="w-full max-w-md glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit /> プロフィール編集
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-3">
              <img
                src={avatarPreview}
                alt="avatar"
                className="object-cover w-full h-full"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer text-xs font-medium text-white transition-opacity"
              >
                画像変更
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-muted-foreground">名前</label>
            <Input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="マスターの名前"
            />
          </div>
          <div>
            <label className="block mb-1 text-muted-foreground">自己紹介 / メモ</label>
            <Textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="自己紹介やメモ"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/master")}>
            キャンセル
          </Button>
          <Button type="submit" className="bg-bokumono-primary">
            保存
          </Button>
        </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditMasterProfilePage;
