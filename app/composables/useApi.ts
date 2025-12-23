import type { ApiResponse } from "~/types/ApiResponse";

export default function <Args extends any[], T>(fn: (...args: Args) => Promise<ApiResponse<T>>) {
  return async (...args: Args) => {
    let errors: string[] = [];
    let data: T | null = null;
    let success: boolean = true;
    let message: string = "";

    try {
      const result = await fn(...args);
      data = result.data as T;
      message = result.message;
    } catch (e: any) {
      errors = e?.data?.errors ?? [];
      message = e?.data?.message ?? "";
      success = false;
    }

    return { message, success, data, errors };
  };
}
