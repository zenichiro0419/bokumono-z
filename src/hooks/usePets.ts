
import { useState, useCallback } from "react";
import { Pet } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { session } = useAuth();

  const loadPets = useCallback(async () => {
    try {
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (petsError) throw petsError;

      const mappedPets: Pet[] = (petsData || []).map(pet => ({
        id: pet.id,
        name: pet.name,
        birthdate: pet.birthdate,
        status: pet.status as "active" | "archived",
        memo: pet.memo || "",
        photoUrl: pet.photo_url || "/placeholder.svg",
        perceived_master_age: pet.perceived_master_age,
        createdAt: pet.created_at,
        updatedAt: pet.updated_at
      }));

      setPets(mappedPets);
    } catch (error) {
      console.error('Error loading pets:', error);
      toast({
        title: "エラー",
        description: "ペットデータの読み込みに失敗しました",
        variant: "destructive"
      });
    }
  }, [toast]);

  const addPet = async (pet: Omit<Pet, "id" | "createdAt" | "updatedAt">) => {
    if (!session?.user?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from('pets')
        .insert([{
          name: pet.name,
          birthdate: pet.birthdate,
          status: pet.status,
          memo: pet.memo,
          photo_url: pet.photoUrl,
          perceived_master_age: pet.perceived_master_age,
          user_id: session.user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const newPet: Pet = {
        id: data.id,
        name: data.name,
        birthdate: data.birthdate,
        status: data.status,
        memo: data.memo || "",
        photoUrl: data.photo_url || "/placeholder.svg",
        perceived_master_age: data.perceived_master_age,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setPets([newPet, ...pets]);
      toast({
        title: "ペットを追加しました",
        description: `${newPet.name}を追加しました`,
      });
      return newPet;
    } catch (error) {
      console.error('Error adding pet:', error);
      toast({
        title: "エラー",
        description: "ペットの追加に失敗しました",
        variant: "destructive"
      });
      return null;
    }
  };

  const updatePet = async (id: string, updates: Partial<Omit<Pet, "id" | "createdAt" | "updatedAt">>) => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .update({
          name: updates.name,
          birthdate: updates.birthdate,
          status: updates.status,
          memo: updates.memo,
          photo_url: updates.photoUrl,
          perceived_master_age: updates.perceived_master_age
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedPet: Pet = {
        id: data.id,
        name: data.name,
        birthdate: data.birthdate,
        status: data.status,
        memo: data.memo || "",
        photoUrl: data.photo_url || "/placeholder.svg",
        perceived_master_age: data.perceived_master_age,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setPets(pets.map(pet => pet.id === id ? updatedPet : pet));
      toast({
        title: "ペット情報を更新しました",
        description: `${updatedPet.name}の情報を更新しました`,
      });
      return updatedPet;
    } catch (error) {
      console.error('Error updating pet:', error);
      toast({
        title: "エラー",
        description: "ペット情報の更新に失敗しました",
        variant: "destructive"
      });
      return null;
    }
  };

  const deletePet = async (id: string) => {
    const petToDelete = pets.find(pet => pet.id === id);
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPets(pets.filter(pet => pet.id !== id));
      if (petToDelete) {
        toast({
          title: "ペットを削除しました",
          description: `${petToDelete.name}を削除しました`,
        });
      }
      return true;
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast({
        title: "エラー",
        description: "ペットの削除に失敗しました",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    pets,
    isLoading,
    loadPets,
    addPet,
    updatePet,
    deletePet,
    activePets: pets.filter(pet => pet.status === "active"),
    archivedPets: pets.filter(pet => pet.status === "archived"),
    getPetById: (id: string) => pets.find(pet => pet.id === id)
  };
};
