
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useMasterProfile } from "@/hooks/useMasterProfile";

// サンプルアバター画像
const PLACEHOLDER_AVATAR = "/placeholder.svg";

const MasterProfilePage: React.FC = () => {
  const { profile, loading, error } = useMasterProfile();

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

  return (
    <div className="flex flex-col items-center pt-8">
      <Card className="w-full max-w-md glass-morphism">
        <CardHeader className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-3 bg-gray-700">
            <img
              src={profile?.avatar_url || PLACEHOLDER_AVATAR}
              alt="Master avatar"
              className="object-cover w-full h-full"
            />
          </div>
          <CardTitle className="flex items-center space-x-2">
            <User />
            <span>{profile?.name || "No name"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-300">{profile?.bio || "自己紹介がありません。"}</p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link to="/master/edit">
            <Button variant="outline" className="border-primary text-primary">
              プロフィール編集
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MasterProfilePage;
