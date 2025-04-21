
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useMasterProfile } from "@/hooks/useMasterProfile";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import Layout from "@/components/Layout";

const PLACEHOLDER_AVATAR = "/placeholder.svg";

const MasterProfilePage: React.FC = () => {
  const { profile, loading, error } = useMasterProfile();

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  const formattedBirthdate = profile?.birthdate
    ? new Date(profile.birthdate).toISOString().slice(0, 10).replace(/-/g, "/")
    : "未設定";

  return (
    <Layout>
      <div className="flex flex-col items-center pt-8">
        <Card className="w-full max-w-md glass-morphism">
          <CardHeader className="flex flex-col items-center">
            <AvatarUpload
              avatarUrl={profile?.avatar_url || PLACEHOLDER_AVATAR}
              onAvatarChange={() => {}}
              isEditable={false}
            />
            <CardTitle className="flex items-center space-x-2">
              <User />
              <span>{profile?.name || "No name"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-bokumono-text space-y-1">
              <p><span className="font-semibold">名前:</span> {profile?.name || "未設定"}</p>
              <p><span className="font-semibold">誕生日:</span> {formattedBirthdate}</p>
            </div>
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
    </Layout>
  );
};

export default MasterProfilePage;
