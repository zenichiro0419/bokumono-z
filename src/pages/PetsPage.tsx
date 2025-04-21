
import React from "react";
import Layout from "@/components/Layout";
import PetList from "@/components/PetList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const PetsPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-bokumono-text">ペット一覧</h1>
          <p className="text-bokumono-muted mt-2">
            あなたのペットの情報を管理します
          </p>
        </div>
        <Link to="/pet/new">
          <Button className="bg-bokumono-primary">
            <Plus className="h-5 w-5 mr-1" />
            新規追加
          </Button>
        </Link>
      </div>
      <PetList />
    </Layout>
  );
};

export default PetsPage;
