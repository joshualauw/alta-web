import { CookieKey } from "~/const/CookieKey";
import { RouteKey } from "~/const/RouteKey";
import type { CurrentUser } from "~/types/user/CurrentUser";
import type { GetMeResponse } from "~/types/user/GetMe";
import type { LoginRequest, LoginResponse } from "~/types/user/Login";

export default function () {
  const currentUser = useState<CurrentUser | null>("currentUser", () => null);

  function getMe() {
    return fetcher<GetMeResponse>("/api/user/me");
  }

  async function login(payload: LoginRequest) {
    const res = await fetcher<LoginResponse>("/api/user/login", {
      method: "POST",
      body: payload,
    });

    if (res.success && res.data) {
      const token = useCookie<string | null>(CookieKey.TOKEN);
      token.value = res.data.token;
    }

    return res;
  }

  async function logout() {
    const token = useCookie<string | null>(CookieKey.TOKEN);
    token.value = null;
    await navigateTo({ name: RouteKey.LOGIN });
  }

  return {
    currentUser,
    getMe,
    login,
    logout,
  };
}
