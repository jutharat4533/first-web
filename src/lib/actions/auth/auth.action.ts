"use server";

import { ErrorActionResult } from "@/lib/actions/action.type";
import { ApiError } from "@/lib/api/api-error";
import { AuthApi } from "@/lib/api/auth.api";
import { signIn, signOut } from "@/lib/auth";
import {
  LoginInput,
  RegisterInput,
  registerSchema,
} from "@/lib/schemas/auth.schema";
import { redirect } from "next/navigation";
import { CredentialsSignin } from "next-auth";
import z from "zod";

export async function registerAction(
  input: RegisterInput,
): Promise<ErrorActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: z.flattenError(parsed.error),
      code: "VALIDATION_ERROR",
    };
  }
  try {
    await AuthApi.register(parsed.data);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 409) {
        return {
          success: false,
          message: "Email already in use",
          code: "EMAIL_ALREADY_EXISTS",
        };
      }
    }
    throw error;
  }

  redirect("/login");
}

export async function loginAction(
  input: LoginInput,
): Promise<ErrorActionResult> {
  try {
    const result = await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        message: "This email is not registered or the password is incorrect.",
        code: "INVALID_CREDENTIALS",
      };
    }
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return {
        success: false,
        message: "This email is not registered or the password is incorrect.",
        code: "INVALID_CREDENTIALS",
      };
    }
    throw error;
  }

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
