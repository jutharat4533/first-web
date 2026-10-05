export type UserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "MALE" | "FEMALE";
  avatarUrl: string | null;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  access_token: string;
  user: UserResponse;
};

export type UserProfileResponse = {
  user: UserResponse;
};
