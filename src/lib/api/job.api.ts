import { CreateJobDto, JobResponse, UpdateJobDto } from "@/lib/api/job-types";
import { authFetch } from "./auth-fetch";

export const JobApi = {
  async getJobs() {
    return authFetch<JobResponse[]>("/jobs");
  },

  async applyJob(id: string) {
    return authFetch<{ message: string }>(`/jobs/${id}/apply`, {
      method: "POST",
    });
  },

  // [Admin]
  async createJob(dto: CreateJobDto) {
    return authFetch<{ message: string }>("/jobs", {
      method: "POST",
      body: dto as unknown as Record<string, unknown>,
    });
  },

  // [Admin]
  async updateJob(id: number, dto: UpdateJobDto) {
    return authFetch<JobResponse>(`/jobs/${id}`, {
      method: "PUT",
      body: dto as unknown as Record<string, unknown>,
    });
  },

  // [Admin]
  async removeJob(id: number) {
    return authFetch<{ message: string }>(`/jobs/${id}`, {
      method: "DELETE",
    });
  },
};
