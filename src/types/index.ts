
export interface Pet {
  id: string;
  name: string;
  age?: number;
  birthdate?: string | null;
  status: "active" | "archived";
  memo: string;
  photoUrl: string;
  perceived_master_age: number;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  petId: string;
  title: string;
  details?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  birthdate?: string; // format: MMDD
  createdAt: string;
  updatedAt: string;
}
