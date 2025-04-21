
import React from "react";
import Layout from "@/components/Layout";
import PetList from "@/components/PetList";

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-bokumono-primary mb-8">フレンド一覧</h1>
        <PetList />
      </div>
    </Layout>
  );
};

export default Index;
