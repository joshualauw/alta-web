import { CookieKey } from "~/const/CookieKey";
import { RouteKey } from "~/const/RouteKey";

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie<string>(CookieKey.TOKEN);
  const { currentUser, getMe } = useUserStore();

  if (!token.value) {
    return navigateTo({ name: RouteKey.LOGIN });
  }

  if (!currentUser.value && token.value) {
    const res = await getMe();
    if (res.success && res.data) {
      currentUser.value = res.data;
    }
  }
});
