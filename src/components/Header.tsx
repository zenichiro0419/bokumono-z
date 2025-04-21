import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, Plus, User, LogOut, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth, signOut } from "@/hooks/useAuth";

const Header: React.FC = () => {
  const isMobile = useIsMobile();
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
      <div className="flex items-center space-x-2">
        {!session && !loading && (
          <div className="flex space-x-2">
            <Link to="/auth" className="flex">
              <Button variant="ghost" className="text-bokumono-primary flex items-center space-x-1 font-semibold">
                <LogIn className="h-5 w-5 mr-1" />
                ログイン
              </Button>
            </Link>
            <Link to="/auth?mode=signup" className="flex">
              <Button variant="outline" className="border-bokumono-primary text-bokumono-primary flex items-center space-x-1 font-semibold">
                <UserPlus className="h-5 w-5 mr-1" />
                サインアップ
              </Button>
            </Link>
          </div>
        )}
        {session && !loading && isMobile && (
          <nav className="flex space-x-1 items-center">
            <Link to="/master">
              <Button variant="ghost" size="icon" className="text-bokumono-text" aria-label="マイページ">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/calendar">
              <Button variant="ghost" size="icon" className="text-bokumono-text">
                <CalendarDays className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pet/new">
              <Button variant="ghost" size="icon" className="text-bokumono-text">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
            {session && !loading && (
              <Button variant="ghost" size="icon" className="text-bokumono-text" onClick={handleSignOut} aria-label="ログアウト">
                <LogOut className="h-5 w-5" />
              </Button>
            )}
            {!session && !loading && (
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="text-bokumono-text" aria-label="ログイン">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </nav>
        )}
        {session && !loading && !isMobile && (
          <nav className="flex space-x-4 items-center">
            <Link to="/">
              <Button variant="ghost" className="text-bokumono-text">
                フレンド
              </Button>
            </Link>
            <Link to="/calendar">
              <Button variant="ghost" className="text-bokumono-text">
                カレンダー
              </Button>
            </Link>
            <Link to="/pet/new">
              <Button variant="ghost" className="text-bokumono-text">
                新規追加
              </Button>
            </Link>
            <Link to="/master">
              <Button variant="ghost" className="text-bokumono-text" aria-label="マイページ">
                <User className="h-5 w-5 mr-1" />
                マイページ
              </Button>
            </Link>
            {session && !loading && (
              <Button variant="ghost" className="text-bokumono-text" onClick={handleSignOut}>
                <LogOut className="h-5 w-5 mr-1" />
                ログアウト
              </Button>
            )}
            {!session && !loading && (
              <Link to="/auth">
                <Button variant="ghost" className="text-bokumono-text">
                  ログイン
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
