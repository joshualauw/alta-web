import z from "zod";

export const loginRequest = z.object({
  email: z.string().email({ message: "email must be a valid email" }),
  password: z.string({ message: "password is required" }),
});

export type LoginRequest = z.infer<typeof loginRequest>;

export interface LoginResponse {
  userId: number;
  token: string;
}
