
import React from "react";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuth, signOut } from "@/hooks/useAuth";

interface MobileNavProps {
  onSignOut: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onSignOut }) => {
  const { session } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/" className="text-bokumono-text text-xl font-bold">
          bokumono Z
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {session ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/" className="w-full">ペット</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/calendar" className="w-full">カレンダー</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/master" className="w-full flex items-center">
                  <User className="h-5 w-5 mr-1" />
                  マイページ
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onSignOut} className="w-full flex items-center">
                <LogOut className="h-5 w-5 mr-1" />
                ログアウト
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/auth" className="w-full">サインイン</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/auth?mode=signup" className="w-full">サインアップ</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default MobileNav;
