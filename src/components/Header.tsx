
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, signOut } from "@/hooks/useAuth";

const Header: React.FC = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="bg-bokumono-card shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="text-bokumono-text text-xl font-bold">
          bokumono Z
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        {/* 未ログイン */}
        {!session && !loading && (
          <div className="flex space-x-2">
            <Link to="/auth">
              <Button variant="ghost" className="text-bokumono-primary flex items-center font-semibold">
                <LogIn className="h-5 w-5 mr-1" />
                サインイン
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="outline" className="border-bokumono-primary text-bokumono-primary flex items-center font-semibold">
                サインアップ
              </Button>
            </Link>
          </div>
        )}
        {/* ログイン時 */}
        {session && !loading && (
          <nav className="flex items-center space-x-8">
            <Link to="/">
              <Button variant="ghost" className="text-bokumono-text font-medium text-lg">
                フレンド
              </Button>
            </Link>
            <Link to="/calendar">
              <Button variant="ghost" className="text-bokumono-text font-medium text-lg">
                カレンダー
              </Button>
            </Link>
            <Link to="/master">
              <Button variant="ghost" className="text-bokumono-text font-medium text-lg flex items-center">
                <User className="h-5 w-5 mr-1" />
                マイページ
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-bokumono-text font-medium text-lg flex items-center"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-1" />
              ログアウト
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
