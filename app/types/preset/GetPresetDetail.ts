export interface GetPresetDetailResponse {
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
  createdAt: string;
  updatedAt: string;
}
