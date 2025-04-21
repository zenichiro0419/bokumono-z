
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
        
        // Map database fields to our application types
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

        const { data: schedulesData, error: schedulesError } = await supabase
          .from('schedules')
          .select('*')
          .order('start_date', { ascending: true });

        if (schedulesError) throw schedulesError;
        
        // Map database fields to our application types
        const mappedSchedules: Schedule[] = (schedulesData || []).map(schedule => ({
          id: schedule.id,
          petId: schedule.pet_id,
          title: schedule.title,
          details: schedule.details || "",
          startDate: schedule.start_date,
          endDate: schedule.end_date,
          createdAt: schedule.created_at,
          updatedAt: schedule.updated_at
        }));
        
        setSchedules(mappedSchedules);
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
    // Convert from our app model to database model
    const dbPet = {
      name: pet.name,
      birthdate: pet.birthdate,
      status: pet.status,
      memo: pet.memo,
      photo_url: pet.photoUrl,
      perceived_master_age: pet.perceived_master_age
    };

    const { data, error } = await supabase
      .from('pets')
      .insert([dbPet])
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

    // Convert from database model back to our app model
    const newPet: Pet = {
      id: data.id,
      name: data.name,
      birthdate: data.birthdate,
      status: data.status as "active" | "archived",
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
  };

  const updatePet = async (
    id: string,
    updates: Partial<Omit<Pet, "id" | "createdAt" | "updatedAt">>
  ): Promise<Pet | null> => {
    // Convert from our app model to database model
    const dbUpdates: Record<string, any> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.birthdate !== undefined) dbUpdates.birthdate = updates.birthdate;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.memo !== undefined) dbUpdates.memo = updates.memo;
    if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl;
    if (updates.perceived_master_age !== undefined) dbUpdates.perceived_master_age = updates.perceived_master_age;

    const { data, error } = await supabase
      .from('pets')
      .update(dbUpdates)
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

    // Convert from database model back to our app model
    const updatedPet: Pet = {
      id: data.id,
      name: data.name,
      birthdate: data.birthdate,
      status: data.status as "active" | "archived",
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

    // Convert from our app model to database model
    const dbSchedule = {
      pet_id: schedule.petId,
      title: schedule.title,
      details: schedule.details,
      start_date: schedule.startDate,
      end_date: schedule.endDate
    };

    const { data, error } = await supabase
      .from('schedules')
      .insert([dbSchedule])
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

    // Convert from database model back to our app model
    const newSchedule: Schedule = {
      id: data.id,
      petId: data.pet_id,
      title: data.title,
      details: data.details || "",
      startDate: data.start_date,
      endDate: data.end_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    setSchedules([...schedules, newSchedule]);
    const pet = getPetById(newSchedule.petId);
    toast({
      title: "予定を追加しました",
      description: `${pet?.name || 'ペット'}の予定を追加しました`,
    });
    return newSchedule;
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

    // Convert from our app model to database model
    const dbUpdates: Record<string, any> = {};
    if (updates.petId !== undefined) dbUpdates.pet_id = updates.petId;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.details !== undefined) dbUpdates.details = updates.details;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;

    const { data, error } = await supabase
      .from('schedules')
      .update(dbUpdates)
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

    // Convert from database model back to our app model
    const updatedSchedule: Schedule = {
      id: data.id,
      petId: data.pet_id,
      title: data.title,
      details: data.details || "",
      startDate: data.start_date,
      endDate: data.end_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    setSchedules(schedules.map(schedule => schedule.id === id ? updatedSchedule : schedule));
    const pet = getPetById(updatedSchedule.petId);
    toast({
      title: "予定を更新しました",
      description: `${pet?.name || 'ペット'}の予定を更新しました`,
    });
    return updatedSchedule;
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
