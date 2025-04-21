
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, Navigate } from "react-router-dom";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80 text-gray-400">
        認証確認中...
      </div>
    );
  }
  
  // For pet/new, allow access even if not logged in
  if (!session && location.pathname !== "/pet/new") {
    console.log("AuthGuard redirecting to home from:", location.pathname);
    // 未ログイン時はトップページへ
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
