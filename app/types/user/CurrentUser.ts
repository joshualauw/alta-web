export type UserRole = "ADMIN";

export interface CurrentUser {
  id: number;
  email: string;
  role: UserRole;
}
