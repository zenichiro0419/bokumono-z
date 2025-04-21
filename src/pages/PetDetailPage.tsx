
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PetDetail from "@/components/PetDetail";
import { useApp } from "@/context/AppContext";

const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPetById, getSchedulesByPetId, isLoading } = useApp();

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bokumono-primary mb-4"></div>
          <p className="text-bokumono-text">読み込み中...</p>
        </div>
      </Layout>
    );
  }

  const pet = id ? getPetById(id) : undefined;
  
  if (!pet) {
    return <Navigate to="/" replace />;
  }

  const schedules = getSchedulesByPetId(pet.id);

  return (
    <Layout>
      <PetDetail pet={pet} schedules={schedules} />
    </Layout>
  );
};

export default PetDetailPage;
