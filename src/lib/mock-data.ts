
import { Pet, Schedule } from "@/types";

// Generate random date in ISO format
const randomDate = (start: Date, end: Date): string => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

// Create mock pets data
export const generateMockPets = (count: number): Pet[] => {
  const petNames = [
    "Luna", "Max", "Bella", "Charlie", "Lucy", "Cooper", "Daisy", "Milo", 
    "Lily", "Bailey", "Zoe", "Buddy", "Stella", "Rocky", "Lola", "Bear", 
    "Molly", "Duke", "Chloe", "Tucker"
  ];
  
  const pets: Pet[] = [];
  
  for (let i = 0; i < count; i++) {
    const now = new Date();
    const status = Math.random() > 0.2 ? "active" : "archived";
    const birthYear = now.getFullYear() - Math.floor(Math.random() * 15) - 1;
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = Math.floor(Math.random() * 28) + 1;
    const birthdate = new Date(birthYear, birthMonth, birthDay).toISOString().split('T')[0];
    
    pets.push({
      id: `pet-${i + 1}`,
      name: petNames[i % petNames.length],
      birthdate: Math.random() > 0.3 ? birthdate : null,
      status: status as "active" | "archived",
      memo: `This is ${petNames[i % petNames.length]}'s memo. Add more details here.`,
      photoUrl: `/placeholder.svg`,
      perceived_master_age: Math.floor(Math.random() * 40) + 20, // Random age between 20-60
      createdAt: randomDate(new Date(now.getFullYear() - 1, 0, 1), now),
      updatedAt: randomDate(new Date(now.getFullYear() - 1, 0, 1), now),
    });
  }
  
  return pets;
};

// Create mock schedules data
export const generateMockSchedules = (pets: Pet[], count: number): Schedule[] => {
  const scheduleTypes = [
    "Vet Visit", "Grooming", "Playtime", "Training", "Feeding",
    "Medication", "Walk", "Shower", "Health Check", "Vaccination"
  ];
  
  const schedules: Schedule[] = [];
  
  for (let i = 0; i < count; i++) {
    const petIndex = Math.floor(Math.random() * pets.length);
    const pet = pets[petIndex];
    
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() + Math.floor(Math.random() * 30) - 15); // Random date ±15 days from now
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + Math.floor(Math.random() * 3) + 1); // 1-3 hours later
    
    const scheduleType = scheduleTypes[Math.floor(Math.random() * scheduleTypes.length)];
    
    schedules.push({
      id: `schedule-${i + 1}`,
      petId: pet.id,
      title: `${scheduleType} - ${pet.name}`,
      details: `Details for ${scheduleType.toLowerCase()} with ${pet.name}.`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      createdAt: randomDate(new Date(now.getFullYear() - 1, 0, 1), now),
      updatedAt: randomDate(new Date(now.getFullYear() - 1, 0, 1), now),
    });
  }
  
  return schedules;
};

// Mock data context
let mockPets = generateMockPets(20);
let mockSchedules = generateMockSchedules(mockPets, 30);

// Utility functions to access and modify mock data
export const getMockPets = () => [...mockPets];
export const getMockPetById = (id: string) => mockPets.find(pet => pet.id === id);
export const getMockActivePets = () => mockPets.filter(pet => pet.status === "active");
export const getMockArchivedPets = () => mockPets.filter(pet => pet.status === "archived");

export const getMockSchedules = () => [...mockSchedules];
export const getMockScheduleById = (id: string) => mockSchedules.find(schedule => schedule.id === id);
export const getMockSchedulesByPetId = (petId: string) => mockSchedules.filter(schedule => schedule.petId === petId);

export const addMockPet = (pet: Omit<Pet, "id" | "createdAt" | "updatedAt">) => {
  const now = new Date().toISOString();
  const newPet: Pet = {
    ...pet,
    id: `pet-${mockPets.length + 1}`,
    createdAt: now,
    updatedAt: now,
  };
  mockPets.push(newPet);
  return newPet;
};

export const updateMockPet = (id: string, updates: Partial<Omit<Pet, "id" | "createdAt" | "updatedAt">>) => {
  const petIndex = mockPets.findIndex(pet => pet.id === id);
  if (petIndex === -1) return null;
  
  mockPets[petIndex] = {
    ...mockPets[petIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return mockPets[petIndex];
};

export const deleteMockPet = (id: string) => {
  const petIndex = mockPets.findIndex(pet => pet.id === id);
  if (petIndex === -1) return false;
  
  mockPets = mockPets.filter(pet => pet.id !== id);
  return true;
};

export const addMockSchedule = (schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">) => {
  const now = new Date().toISOString();
  const newSchedule: Schedule = {
    ...schedule,
    id: `schedule-${mockSchedules.length + 1}`,
    createdAt: now,
    updatedAt: now,
  };
  mockSchedules.push(newSchedule);
  return newSchedule;
};

export const updateMockSchedule = (id: string, updates: Partial<Omit<Schedule, "id" | "createdAt" | "updatedAt">>) => {
  const scheduleIndex = mockSchedules.findIndex(schedule => schedule.id === id);
  if (scheduleIndex === -1) return null;
  
  mockSchedules[scheduleIndex] = {
    ...mockSchedules[scheduleIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return mockSchedules[scheduleIndex];
};

export const deleteMockSchedule = (id: string) => {
  const scheduleIndex = mockSchedules.findIndex(schedule => schedule.id === id);
  if (scheduleIndex === -1) return false;
  
  mockSchedules = mockSchedules.filter(schedule => schedule.id !== id);
  return true;
};
