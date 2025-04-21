
import React from "react";
import Layout from "@/components/Layout";
import PetList from "@/components/PetList";

const PetsPage: React.FC = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-bokumono-text">フレンド一覧</h1>
        <p className="text-bokumono-muted mt-2">
          あなたのフレンド（ペット）の情報を管理します
        </p>
      </div>
      <PetList />
    </Layout>
  );
};

export default PetsPage;
