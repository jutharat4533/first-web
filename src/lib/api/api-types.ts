export type UserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  avatarUrl: string | null;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  access_token: string;
  user: UserResponse;
};

export type RelationshipStatus =
  | "NONE"
  | "FRIEND"
  | "SELF"
  | "REQUEST_SENT"
  | "REQUEST_RECEIVED";

export type UserProfileResponse = {
  user: UserResponse;
  friends: UserResponse[];
  relationshipStatus: RelationshipStatus;
};
