
import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-bokumono-background">
      {location.pathname !== "/master" && <Header />}
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 animate-fade-in">
        {children}
      </main>
      <footer className="bg-bokumono-card py-4 text-center text-bokumono-muted text-sm">
        &copy; {new Date().getFullYear()} bokumono Z - ペット管理アプリ
      </footer>
    </div>
  );
};

export default Layout;
