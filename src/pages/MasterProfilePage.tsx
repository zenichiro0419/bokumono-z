
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

// 仮データ（本番は認証情報と紐づけ）
const masterProfile = {
  name: "マスター太郎",
  bio: "このアプリの管理人です。ペット達の管理はお任せください。",
  avatarUrl: "/placeholder.svg",
};

const MasterProfilePage: React.FC = () => (
  <div className="flex flex-col items-center pt-8">
    <Card className="w-full max-w-md glass-morphism">
      <CardHeader className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-3 bg-gray-700">
          <img
            src={masterProfile.avatarUrl}
            alt="Master avatar"
            className="object-cover w-full h-full"
          />
        </div>
        <CardTitle className="flex items-center space-x-2">
          <User />
          <span>{masterProfile.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-300">{masterProfile.bio}</p>
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

export default MasterProfilePage;
