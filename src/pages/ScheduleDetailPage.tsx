
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ScheduleDetail from "@/components/ScheduleDetail";
import { useApp } from "@/context/AppContext";

const ScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getScheduleById, getPetById, isLoading } = useApp();

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

  const schedule = id ? getScheduleById(id) : undefined;
  
  if (!schedule) {
    return <Navigate to="/calendar" replace />;
  }

  const pet = getPetById(schedule.petId);
  
  if (!pet) {
    return <Navigate to="/calendar" replace />;
  }

  return (
    <Layout>
      <ScheduleDetail schedule={schedule} pet={pet} />
    </Layout>
  );
};

export default ScheduleDetailPage;
