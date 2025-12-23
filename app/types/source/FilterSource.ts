import z from "zod";
import type { GetAllSourceResponse } from "~/types/source/GetAllSource";

const filterOperators = z.object({
  $eq: z.any().optional(),
  $ne: z.any().optional(),
  $gt: z.number().optional(),
  $gte: z.number().optional(),
  $lt: z.number().optional(),
  $lte: z.number().optional(),
  $in: z.array(z.string()).optional(),
  $nin: z.array(z.string()).optional(),
});

export type FilterOperators = z.infer<typeof filterOperators>;

export const filterSourceRequest = z.record(z.string(), filterOperators);

export type FilterSourceRequest = z.infer<typeof filterSourceRequest>;

export type FilterSourceResponse = GetAllSourceResponse;
