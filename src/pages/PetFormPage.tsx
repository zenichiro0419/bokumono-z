
import React from "react";
import { useParams, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import PetForm from "@/components/PetForm";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";

const PetFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPetById, isLoading } = useApp();
  const location = useLocation();
  const { session } = useAuth();
  
  console.log("PetFormPage accessed with path:", location.pathname);
  const isEditing = id && id !== "new";
  const isNewPet = location.pathname === "/pet/new";

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

  // For new pets, check if user is logged in
  if (isNewPet && !session) {
    toast({
      title: "ログインが必要です",
      description: "ペットを追加するにはログインしてください",
      variant: "destructive"
    });
    return <Navigate to="/auth" replace />;
  }

  // If we're editing, make sure the pet exists
  if (isEditing) {
    const pet = id ? getPetById(id) : undefined;
    
    if (!pet) {
      return <Navigate to="/" replace />;
    }

    return (
      <Layout>
        <PetForm pet={pet} isEditing={true} />
      </Layout>
    );
  }

  // For new pets
  return (
    <Layout>
      <PetForm />
    </Layout>
  );
};

export default PetFormPage;
