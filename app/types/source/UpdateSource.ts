import z from "zod";

export const updateSourceRequest = z.object({
  name: z.string().min(1).optional(),
  groupId: z.number().nullable().optional(),
});

export type UpdateSourceRequest = z.infer<typeof updateSourceRequest>;

export interface UpdateSourceResponse {
  id: number;
  name: string;
  updatedAt: string;
}
