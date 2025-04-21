
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import PetsPage from "@/pages/PetsPage";

const Index: React.FC = () => {
  const { session, loading } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bokumono-background">
      <div className="w-full max-w-md bg-bokumono-card shadow-lg rounded-lg p-8 mt-8">
        <h1 className="text-3xl font-bold text-bokumono-text text-center mb-4">bokumono-friend-planner</h1>
        <p className="mb-6 text-center text-bokumono-muted">ペットやフレンドを管理するアプリへようこそ。</p>
        {!loading && !session && (
          <div className="flex flex-col items-center space-y-3">
            <Link
              to="/auth"
              className="text-primary underline text-lg font-semibold"
            >
              ログイン・新規登録はこちら
            </Link>
            <p className="text-sm text-bokumono-muted">未ログインです。ログインしてください。</p>
          </div>
        )}
        {!loading && session && (
          <div>
            <p className="text-center mb-2">ログイン済みです。下記より管理へ進めます。</p>
            <Link
              to="/calendar"
              className="block text-primary underline text-center font-semibold"
            >
              カレンダーへ進む
            </Link>
          </div>
        )}
      </div>
      {session && <PetsPage />}
    </div>
  );
};

export default Index;
