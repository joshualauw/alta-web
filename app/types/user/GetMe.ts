import type { UserRole } from "~/types/user/CurrentUser";

export interface GetMeResponse {
  id: number;
  email: string;
  role: UserRole;
}
