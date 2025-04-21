
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Edit, Calendar as CalendarIcon } from "lucide-react";
import { useMasterProfile } from "@/hooks/useMasterProfile";
import { format } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// サンプルアバター画像
const PLACEHOLDER_AVATAR = "/placeholder.svg";

const EditMasterProfilePage: React.FC = () => {
  const { profile, loading, error, saveProfile, setProfile } = useMasterProfile();
  const [avatarPreview, setAvatarPreview] = useState<string>(profile?.avatar_url || PLACEHOLDER_AVATAR);
  const [saving, setSaving] = useState(false);
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    profile?.birthdate ? new Date(profile.birthdate) : undefined
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setAvatarPreview(profile.avatar_url || PLACEHOLDER_AVATAR);
      setBirthdate(profile.birthdate ? new Date(profile.birthdate) : undefined);
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

  // 入力changeハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile!,
      [e.target.name]: e.target.value,
    });
  };

  // 画像アップロード（local previewのみ）
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      setProfile && setProfile({
        ...profile!,
        avatar_url: objectUrl,
      });
    }
  };

  // 誕生日変更
  const handleBirthdateChange = (date: Date | undefined) => {
    setBirthdate(date);
    setProfile({
      ...profile!,
      birthdate: date ? format(date, "yyyy-MM-dd") : null,
    });
  };

  // 保存
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (profile) {
      const ok = await saveProfile({
        id: profile.id,
        name: profile.name || "No name",
        bio: profile.bio || "",
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
            <label className="block mb-1 text-muted-foreground">誕生日</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthdate && "text-muted-foreground"
                  )}
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50"/>
                  {birthdate ? format(birthdate, "yyyy/MM/dd") : <span>日付を選択</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthdate}
                  onSelect={handleBirthdateChange}
                  disabled={date =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block mb-1 text-muted-foreground">自己紹介 / メモ</label>
            <Textarea
              name="bio"
              value={profile?.bio || ""}
              onChange={handleChange}
              placeholder="自己紹介やメモ"
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
