import type { UseFetchOptions } from "#app";
import defu from "defu";
import type { ApiResponse } from "~/types/ApiResponse";
import { CookieKey } from "~/const/CookieKey";

export default function <T>(url: string, options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig();
  const token = useCookie(CookieKey.TOKEN);

  const headers: HeadersInit = {};
  if (token.value) {
    Object.assign(headers, {
      Authorization: `Bearer ${token.value}`,
    });
  }

  const defaults: UseFetchOptions<T> = {
    key: url,
    baseURL: config.public.apiUrl,
    headers,
  };

  const params = defu(options, defaults);
  //@ts-ignore
  return $fetch<ApiResponse<T>>(url, params);
}
