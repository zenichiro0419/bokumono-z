
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Pet, Schedule } from "@/types";
import { 
  getMockPets, 
  getMockSchedules, 
  addMockPet, 
  updateMockPet, 
  deleteMockPet,
  addMockSchedule,
  updateMockSchedule,
  deleteMockSchedule
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

interface AppContextType {
  pets: Pet[];
  activePets: Pet[];
  archivedPets: Pet[];
  schedules: Schedule[];
  isLoading: boolean;
  getPetById: (id: string) => Pet | undefined;
  getScheduleById: (id: string) => Schedule | undefined;
  getSchedulesByPetId: (petId: string) => Schedule[];
  addPet: (pet: Omit<Pet, "id" | "createdAt" | "updatedAt">) => Pet;
  updatePet: (id: string, updates: Partial<Omit<Pet, "id" | "createdAt" | "updatedAt">>) => Pet | null;
  deletePet: (id: string) => boolean;
  addSchedule: (schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">) => Schedule | null;
  updateSchedule: (id: string, updates: Partial<Omit<Schedule, "id" | "createdAt" | "updatedAt">>) => Schedule | null;
  deleteSchedule: (id: string) => boolean;
  checkScheduleConflict: (petId: string, startDate: string, endDate: string, excludeId?: string) => boolean;
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

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setPets(getMockPets());
      setSchedules(getMockSchedules());
      setIsLoading(false);
    };

    loadData();
  }, []);

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

      // Check for overlap
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  // CRUD operations for pets
  const addPet = (pet: Omit<Pet, "id" | "createdAt" | "updatedAt">) => {
    const newPet = addMockPet(pet);
    setPets([...pets, newPet]);
    toast({
      title: "ペットを追加しました",
      description: `${newPet.name}を追加しました`,
    });
    return newPet;
  };

  const updatePet = (id: string, updates: Partial<Omit<Pet, "id" | "createdAt" | "updatedAt">>) => {
    const updatedPet = updateMockPet(id, updates);
    if (updatedPet) {
      setPets(pets.map(pet => pet.id === id ? updatedPet : pet));
      toast({
        title: "ペット情報を更新しました",
        description: `${updatedPet.name}の情報を更新しました`,
      });
    }
    return updatedPet;
  };

  const deletePet = (id: string) => {
    const petToDelete = getPetById(id);
    const success = deleteMockPet(id);
    if (success && petToDelete) {
      setPets(pets.filter(pet => pet.id !== id));
      // Also delete associated schedules
      const associatedSchedules = getSchedulesByPetId(id);
      associatedSchedules.forEach(schedule => {
        deleteMockSchedule(schedule.id);
      });
      setSchedules(schedules.filter(schedule => schedule.petId !== id));
      toast({
        title: "ペットを削除しました",
        description: `${petToDelete.name}を削除しました`,
      });
    }
    return success;
  };

  // CRUD operations for schedules
  const addSchedule = (schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">) => {
    // Check for conflicts
    if (checkScheduleConflict(schedule.petId, schedule.startDate, schedule.endDate)) {
      toast({
        title: "スケジュール重複",
        description: "同じペットに対して同時刻に既存の予定があります",
        variant: "destructive"
      });
      return null;
    }

    const newSchedule = addMockSchedule(schedule);
    setSchedules([...schedules, newSchedule]);
    const pet = getPetById(schedule.petId);
    toast({
      title: "予定を追加しました",
      description: `${pet?.name || 'ペット'}の予定を追加しました`,
    });
    return newSchedule;
  };

  const updateSchedule = (id: string, updates: Partial<Omit<Schedule, "id" | "createdAt" | "updatedAt">>) => {
    const currentSchedule = getScheduleById(id);
    if (!currentSchedule) return null;

    // Check for conflicts if dates are being updated
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

    const updatedSchedule = updateMockSchedule(id, updates);
    if (updatedSchedule) {
      setSchedules(schedules.map(schedule => schedule.id === id ? updatedSchedule : schedule));
      const pet = getPetById(updatedSchedule.petId);
      toast({
        title: "予定を更新しました",
        description: `${pet?.name || 'ペット'}の予定を更新しました`,
      });
    }
    return updatedSchedule;
  };

  const deleteSchedule = (id: string) => {
    const scheduleToDelete = getScheduleById(id);
    const pet = scheduleToDelete ? getPetById(scheduleToDelete.petId) : null;
    const success = deleteMockSchedule(id);
    if (success) {
      setSchedules(schedules.filter(schedule => schedule.id !== id));
      toast({
        title: "予定を削除しました",
        description: `${pet?.name || 'ペット'}の予定を削除しました`,
      });
    }
    return success;
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
