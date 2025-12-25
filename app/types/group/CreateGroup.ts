import z from "zod";

export const createGroupRequest = z.object({
  name: z.string().min(1),
  colorCode: z.string().min(1),
});

export type CreateGroupRequest = z.infer<typeof createGroupRequest>;

export interface CreateGroupResponse {
  id: number;
  name: string;
  colorCode: string;
  createdAt: string;
}
