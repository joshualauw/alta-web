import z from "zod";

export const updatePresetRequest = z.object({
  name: z.string().min(1).optional(),
  chunkSplitSize: z.number().min(100).max(2048).optional(),
  chunkSplitOverlap: z.number().min(10).max(100).optional(),
  topK: z.number().min(1).max(50).optional(),
  topN: z.number().min(1).max(10).optional(),
  minSimilarityScore: z.number().min(0).max(1).optional(),
  maxResponseTokens: z.number().min(512).max(4096).optional(),
  rerankModel: z.string().min(1).optional(),
  responsesModel: z.string().min(1).optional(),
});

export type UpdatePresetRequest = z.infer<typeof updatePresetRequest>;

export interface UpdatePresetResponse {
  id: number;
  code: string;
  name: string;
  chunkSplitSize: number;
  chunkSplitOverlap: number;
  topK: number;
  topN: number;
  minSimilarityScore: number;
  maxResponseTokens: number;
  rerankModel: string;
  responsesModel: string;
  updatedAt: string;
}
