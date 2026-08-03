import { create } from "zustand";

export interface UserProfile {
  id: string; // UUID ตาม Prisma Schema
  name: string;
  role: "ADMIN" | "USER";
  appliedJobs: number[];
}

interface AuthState {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: {
    id: "user-uuid-1234",
    name: "Dr. Somchai",
    role: "ADMIN",
    appliedJobs: [],
  },
  setCurrentUser: (user) => set({ currentUser: user }),
}));
