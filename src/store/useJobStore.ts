import { create } from "zustand";
import { JobPost } from "@/@types/types";

interface UserProfile {
  id: string;
  name: string;
  role: "admin" | "user";
  appliedJobs: number[];
}

interface JobState {
  currentUser: UserProfile | null;
  jobs: JobPost[];
  loading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  addJob: (
    newJob: Omit<JobPost, "id" | "createdAt" | "applicants">,
  ) => Promise<void>;
  updateJob: (id: number, updatedData: Partial<JobPost>) => Promise<void>;
  deleteJob: (id: number) => Promise<void>;
  applyJob: (id: number) => Promise<void>;

  setCurrentUser: (user: UserProfile | null) => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  currentUser: {
    id: "user-uuid-1234-5678-abcd",
    name: "Dr. Somchai",
    role: "admin",
    appliedJobs: [],
  },
  jobs: [],
  loading: false,
  error: null,

  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/jobs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      set({ jobs: data, loading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      set({ error: message, loading: false });
    }
  },

  addJob: async (newJobData) => {
    try {
      const response = await fetch("http://localhost:3000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify(newJobData),
      });
      if (response.ok) get().fetchJobs();
    } catch (error) {
      console.error("Failed to add job:", error);
    }
  },

  updateJob: async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3000/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        get().fetchJobs();
      }
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  },

  deleteJob: async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });
      if (response.ok) get().fetchJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  },

  applyJob: async (id: number) => {
    const user = get().currentUser;
    if (!user) return;

    const updatedAppliedJobs = [...user.appliedJobs, id];
    set({
      currentUser: {
        ...user,
        appliedJobs: updatedAppliedJobs,
      },
    });
  },

  setCurrentUser: (user) => set({ currentUser: user }),
}));
