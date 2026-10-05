"use server";

import { ErrorActionResult } from "@/lib/actions/action.type";
import { ApiError } from "@/lib/api/api-error";
import { UpdateProfileDto, UserApi } from "@/lib/api/user.api";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(
  dto: UpdateProfileDto,
): Promise<ErrorActionResult | { success: true }> {
  try {
    await UserApi.updateProfile(dto);
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        code: "API_ERROR",
      };
    }
    throw error;
  }
  revalidatePath("/user");
  return { success: true };
}
