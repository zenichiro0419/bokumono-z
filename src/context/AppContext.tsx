
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { usePets } from "@/hooks/usePets";
import { useSchedules } from "@/hooks/useSchedules";
import { differenceInYears, parseISO } from "date-fns";

interface AppContextType {
  pets: ReturnType<typeof usePets>;
  schedules: ReturnType<typeof useSchedules>;
  calculatePetAge: (birthdate: string | null | undefined) => number | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pets = usePets();
  const schedules = useSchedules();

  useEffect(() => {
    pets.loadPets();
    schedules.loadSchedules();
  }, []);

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

  const value: AppContextType = {
    pets,
    schedules,
    calculatePetAge,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return {
    ...context.pets,
    ...context.schedules,
    calculatePetAge: context.calculatePetAge,
  };
};
