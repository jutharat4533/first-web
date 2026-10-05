import { authFetch } from "@/lib/api/auth-fetch";
import { UserResponse } from "@/lib/api/api-types";

export type UpdateProfileDto = {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: "MALE" | "FEMALE";
  avatarUrl?: string;
};

export const UserApi = {
  async getProfile(userId: string) {
    return authFetch<UserResponse>(`/users/${userId}/profile`);
  },

  async updateProfile(dto: UpdateProfileDto) {
    return authFetch<UserResponse>("/users/me/profile", {
      method: "PATCH",
      body: dto,
    });
  },
};
