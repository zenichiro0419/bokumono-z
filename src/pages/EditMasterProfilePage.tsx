
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Edit } from "lucide-react";
import { useMasterProfile } from "@/hooks/useMasterProfile";

// サンプルアバター画像
const PLACEHOLDER_AVATAR = "/placeholder.svg";

const EditMasterProfilePage: React.FC = () => {
  const { profile, loading, error, saveProfile, setProfile } = useMasterProfile();
  const [avatarPreview, setAvatarPreview] = useState<string>(profile?.avatar_url || PLACEHOLDER_AVATAR);
  const [saving, setSaving] = useState(false);
  const [birthdate, setBirthdate] = useState<string>(profile?.birthdate || "");

  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setAvatarPreview(profile.avatar_url || PLACEHOLDER_AVATAR);
      setBirthdate(profile.birthdate || "");
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center pt-8">
        <div className="text-gray-400">ロード中...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center pt-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile!,
      [e.target.name]: e.target.value,
    });
  };

  // 誕生日変更（日付input対応）
  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBirthdate(value);
    setProfile({
      ...profile!,
      birthdate: value || null,
    });
  };

  // 画像アップロード（local previewのみ）
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      setProfile({
        ...profile!,
        avatar_url: objectUrl,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (profile) {
      const ok = await saveProfile({
        id: profile.id,
        name: profile.name || "No name",
        avatar_url: profile.avatar_url || PLACEHOLDER_AVATAR,
        birthdate: profile.birthdate || null,
      });
      if (ok) {
        navigate("/master");
      }
    }
    setSaving(false);
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
                value={profile?.name || ""}
                onChange={handleChange}
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
                onChange={handleBirthdateChange}
                max={new Date().toISOString().slice(0, 10)}
                min="1900-01-01"
                placeholder="誕生日を選択"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/master")}>
              キャンセル
            </Button>
            <Button type="submit" className="bg-bokumono-primary" disabled={saving}>
              {saving ? "保存中..." : "保存"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditMasterProfilePage;
