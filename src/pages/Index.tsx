
import React from "react";
import PetsPage from "@/pages/PetsPage";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  const { session, loading } = useAuth();

  return (
    <div>
      {!loading && !session && (
        <div className="flex justify-center py-6">
          <Link
            to="/auth"
            className="text-primary underline text-lg font-semibold"
          >
            ログイン・新規登録はこちら
          </Link>
        </div>
      )}
      <PetsPage />
    </div>
  );
};

export default Index;
