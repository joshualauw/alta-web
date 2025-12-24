import z from "zod";

export const allowedSourceMetadata = z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]);

export const createSourceRequest = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  metadata: z.record(z.string().min(1), allowedSourceMetadata).optional(),
  groupId: z.number().nullable().optional(),
});

export type CreateSourceRequest = z.infer<typeof createSourceRequest>;

export interface CreateSourceResponse {
  id: number;
  name: string;
  createdAt: string;
}
