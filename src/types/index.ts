
export interface Pet {
  id: string;
  name: string;
  age: number;
  status: "active" | "archived";
  memo: string;
  photoUrl: string;
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
