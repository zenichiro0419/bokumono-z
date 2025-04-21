
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Pet, Schedule } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, differenceInYears } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface AppContextType {
  pets: Pet[];
  activePets: Pet[];
  archivedPets: Pet[];
  schedules: Schedule[];
  isLoading: boolean;
  getPetById: (id: string) => Pet | undefined;
  getScheduleById: (id: string) => Schedule | undefined;
  getSchedulesByPetId: (petId: string) => Schedule[];
  addPet: (pet: Omit<Pet, "id" | "createdAt" | "updatedAt" | "age">) => Promise<Pet | null>;
  updatePet: (id: string, updates: Partial<Omit<Pet, "id" | "createdAt" | "updatedAt" | "age">>) => Promise<Pet | null>;
  deletePet: (id: string) => Promise<boolean>;
  addSchedule: (schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">) => Promise<Schedule | null>;
  updateSchedule: (id: string, updates: Partial<Omit<Schedule, "id" | "createdAt" | "updatedAt">>) => Promise<Schedule | null>;
  deleteSchedule: (id: string) => Promise<boolean>;
  checkScheduleConflict: (petId: string, startDate: string, endDate: string, excludeId?: string) => boolean;
  calculatePetAge: (birthdate: string | null | undefined) => number | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Filter pets by status
  const activePets = pets.filter(pet => pet.status === "active");
  const archivedPets = pets.filter(pet => pet.status === "archived");

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: petsData, error: petsError } = await supabase
          .from('pets')
          .select('*')
          .order('created_at', { ascending: false });

        if (petsError) throw petsError;
        setPets(petsData || []);

        const { data: schedulesData, error: schedulesError } = await supabase
          .from('schedules')
          .select('*')
          .order('start_date', { ascending: true });

        if (schedulesError) throw schedulesError;
        setSchedules(schedulesData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "エラー",
          description: "データの読み込みに失敗しました",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Calculate pet age from birthdate
  const calculatePetAge = (birthdate: string | null | undefined): number | undefined => {
    if (!birthdate) return undefined;
    try {
      const birthdateDate = parseISO(birthdate);
      return differenceInYears(new Date(), birthdateDate);
    } catch (e) {
      console.error("Error calculating age:", e);
      return undefined;
    }
  };

  // Utility functions
  const getPetById = (id: string) => pets.find(pet => pet.id === id);
  const getScheduleById = (id: string) => schedules.find(schedule => schedule.id === id);
  const getSchedulesByPetId = (petId: string) => schedules.filter(schedule => schedule.petId === petId);

  // Check for schedule conflicts
  const checkScheduleConflict = (
    petId: string, 
    startDate: string, 
    endDate: string,
    excludeId?: string
  ): boolean => {
    const petSchedules = getSchedulesByPetId(petId).filter(s => !excludeId || s.id !== excludeId);
    const newStart = new Date(startDate).getTime();
    const newEnd = new Date(endDate).getTime();

    return petSchedules.some(schedule => {
      const existingStart = new Date(schedule.startDate).getTime();
      const existingEnd = new Date(schedule.endDate).getTime();

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  // CRUD operations for pets
  const addPet = async (pet: Omit<Pet, "id" | "createdAt" | "updatedAt">): Promise<Pet | null> => {
    const { data, error } = await supabase
      .from('pets')
      .insert([pet])
      .select()
      .single();

    if (error) {
      toast({
        title: "エラー",
        description: "ペットの追加に失敗しました",
        variant: "destructive"
      });
      return null;
    }

    setPets([data, ...pets]);
    toast({
      title: "ペットを追加しました",
      description: `${data.name}を追加しました`,
    });
    return data;
  };

  const updatePet = async (
    id: string,
    updates: Partial<Omit<Pet, "id" | "createdAt" | "updatedAt">>
  ): Promise<Pet | null> => {
    const { data, error } = await supabase
      .from('pets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: "エラー",
        description: "ペット情報の更新に失敗しました",
        variant: "destructive"
      });
      return null;
    }

    setPets(pets.map(pet => pet.id === id ? data : pet));
    toast({
      title: "ペット情報を更新しました",
      description: `${data.name}の情報を更新しました`,
    });
    return data;
  };

  const deletePet = async (id: string): Promise<boolean> => {
    const petToDelete = getPetById(id);
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "エラー",
        description: "ペットの削除に失敗しました",
        variant: "destructive"
      });
      return false;
    }

    setPets(pets.filter(pet => pet.id !== id));
    if (petToDelete) {
      toast({
        title: "ペットを削除しました",
        description: `${petToDelete.name}を削除しました`,
      });
    }
    return true;
  };

  // CRUD operations for schedules
  const addSchedule = async (
    schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">
  ): Promise<Schedule | null> => {
    if (checkScheduleConflict(schedule.petId, schedule.startDate, schedule.endDate)) {
      toast({
        title: "スケジュール重複",
        description: "同じペットに対して同時刻に既存の予定があります",
        variant: "destructive"
      });
      return null;
    }

    const { data, error } = await supabase
      .from('schedules')
      .insert([schedule])
      .select()
      .single();

    if (error) {
      toast({
        title: "エラー",
        description: "予定の追加に失敗しました",
        variant: "destructive"
      });
      return null;
    }

    setSchedules([...schedules, data]);
    const pet = getPetById(data.petId);
    toast({
      title: "予定を追加しました",
      description: `${pet?.name || 'ペット'}の予定を追加しました`,
    });
    return data;
  };

  const updateSchedule = async (
    id: string,
    updates: Partial<Omit<Schedule, "id" | "createdAt" | "updatedAt">>
  ): Promise<Schedule | null> => {
    const currentSchedule = getScheduleById(id);
    if (!currentSchedule) return null;

    if (
      (updates.startDate || updates.endDate || updates.petId) &&
      checkScheduleConflict(
        updates.petId || currentSchedule.petId,
        updates.startDate || currentSchedule.startDate,
        updates.endDate || currentSchedule.endDate,
        id
      )
    ) {
      toast({
        title: "スケジュール重複",
        description: "同じペットに対して同時刻に既存の予定があります",
        variant: "destructive"
      });
      return null;
    }

    const { data, error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: "エラー",
        description: "予定の更新に失敗しました",
        variant: "destructive"
      });
      return null;
    }

    setSchedules(schedules.map(schedule => schedule.id === id ? data : schedule));
    const pet = getPetById(data.petId);
    toast({
      title: "予定を更新しました",
      description: `${pet?.name || 'ペット'}の予定を更新しました`,
    });
    return data;
  };

  const deleteSchedule = async (id: string): Promise<boolean> => {
    const scheduleToDelete = getScheduleById(id);
    const pet = scheduleToDelete ? getPetById(scheduleToDelete.petId) : null;

    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "エラー",
        description: "予定の削除に失敗しました",
        variant: "destructive"
      });
      return false;
    }

    setSchedules(schedules.filter(schedule => schedule.id !== id));
    toast({
      title: "予定を削除しました",
      description: `${pet?.name || 'ペット'}の予定を削除しました`,
    });
    return true;
  };

  const value: AppContextType = {
    pets,
    activePets,
    archivedPets,
    schedules,
    isLoading,
    getPetById,
    getScheduleById,
    getSchedulesByPetId,
    addPet,
    updatePet,
    deletePet,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    checkScheduleConflict,
    calculatePetAge,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
