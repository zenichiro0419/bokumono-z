
import React from "react";
import Layout from "@/components/Layout";
import PetList from "@/components/PetList";

const PetsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <PetList />
      </div>
    </Layout>
  );
};

export default PetsPage;
