import { apiFetch } from "@/lib/api/api-fetch";
import { LoginResponse } from "@/lib/api/api-types";
import { LoginInput, RegisterInput } from "@/lib/schemas/auth.schema";

export const AuthApi = {
  register(data: RegisterInput) {
    return apiFetch<void>("/auth/register", {
      method: "POST",
      body: data,
    });
  },

  login(data: LoginInput) {
    return apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: data,
    });
  },
};
