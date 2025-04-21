
import React from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ScheduleForm from "@/components/ScheduleForm";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";

const ScheduleFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getScheduleById, isLoading } = useApp();
  const location = useLocation();
  const { session } = useAuth();
  
  // Check if we're on the /schedule/new path or editing an existing schedule
  const isNew = !id || location.pathname === "/schedule/new";
  const isEditing = !isNew;
  
  // Parse query parameters for default pet ID when creating a new schedule
  const queryParams = new URLSearchParams(location.search);
  const defaultPetId = queryParams.get("petId") || undefined;

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

  // Check if user is logged in
  if (!session) {
    toast("予定を追加・編集するにはログインしてください", {
      variant: "destructive"
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If we're editing, make sure the schedule exists
  if (isEditing) {
    const schedule = id ? getScheduleById(id) : undefined;
    
    if (!schedule) {
      return <Navigate to="/calendar" replace />;
    }

    return (
      <Layout>
        <ScheduleForm schedule={schedule} isEditing={true} />
      </Layout>
    );
  }

  // For new schedules
  return (
    <Layout>
      <ScheduleForm defaultPetId={defaultPetId} />
    </Layout>
  );
};

export default ScheduleFormPage;
