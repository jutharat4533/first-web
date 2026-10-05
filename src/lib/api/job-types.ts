export interface JobResponse {
  id: number;
  title: string;
  location: string;
  aboutWord?: string;
  compensation: number;
  status: "OPEN" | "FULL" | "CLOSED";
  isHighlighted: boolean;
  createdAt: string;
}

export interface CreateJobDto {
  title: string;
  location: string;
  aboutWord?: string;
  compensation: number;
  status: "OPEN" | "FULL" | "CLOSED";
  isHighlighted: boolean;
}

export interface UpdateJobDto {
  title?: string;
  location?: string;
  aboutWord?: string;
  compensation?: number;
  status?: "OPEN" | "FULL" | "CLOSED";
  isHighlighted?: boolean;
}
