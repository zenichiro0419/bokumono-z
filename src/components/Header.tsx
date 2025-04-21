
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, LogIn, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, signOut } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header: React.FC = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const renderNavItems = () => (
    <>
      <Link to="/">
        <Button variant="ghost" className="text-bokumono-text font-medium text-lg">
          ペット
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
    </>
  );

  const renderMobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>メニュー</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4 mt-6">
          {renderNavItems()}
        </nav>
      </SheetContent>
    </Sheet>
  );

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
          <>
            {isMobile ? (
              renderMobileMenu()
            ) : (
              <nav className="hidden md:flex items-center space-x-8">
                {renderNavItems()}
              </nav>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
