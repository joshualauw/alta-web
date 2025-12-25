import z from "zod";

export const updateGroupRequest = z.object({
  name: z.string().min(1),
  colorCode: z.string().min(1),
});

export type UpdateGroupRequest = z.infer<typeof updateGroupRequest>;

export interface UpdateGroupResponse {
  id: number;
  name: string;
  colorCode: string;
  updatedAt: string;
}
