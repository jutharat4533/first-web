"use server";

import { ErrorActionResult } from "@/lib/actions/action.type";
import { ApiError } from "@/lib/api/api-error";
import { CreateJobDto, UpdateJobDto } from "@/lib/api/job-types";
import { JobApi } from "@/lib/api/job.api";
import { revalidatePath } from "next/cache";

type ActionResult = ErrorActionResult | { success: true };

function handleApiError(error: unknown): ActionResult {
  if (error instanceof ApiError) {
    return {
      success: false,
      message: error.message,
      code: "API_ERROR",
    };
  }
  throw error;
}

export async function applyJobAction(jobId: string): Promise<ActionResult> {
  try {
    await JobApi.applyJob(jobId);
  } catch (error) {
    return handleApiError(error);
  }
  revalidatePath("/jobs");
  return { success: true };
}

// [Admin]
export async function createJobAction(dto: CreateJobDto): Promise<ActionResult> {
  try {
    await JobApi.createJob(dto);
  } catch (error) {
    return handleApiError(error);
  }
  revalidatePath("/jobs");
  return { success: true };
}

// [Admin]
export async function updateJobAction(
  id: number,
  dto: UpdateJobDto,
): Promise<ActionResult> {
  try {
    await JobApi.updateJob(id, dto);
  } catch (error) {
    return handleApiError(error);
  }
  revalidatePath("/jobs");
  return { success: true };
}

// [Admin]
export async function removeJobAction(id: number): Promise<ActionResult> {
  try {
    await JobApi.removeJob(id);
  } catch (error) {
    return handleApiError(error);
  }
  revalidatePath("/jobs");
  return { success: true };
}
