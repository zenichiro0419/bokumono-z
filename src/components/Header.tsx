
import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-bokumono-card shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="text-bokumono-text text-xl font-bold">
          bokumono Z
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        {isMobile ? (
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
          </nav>
        ) : (
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
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
