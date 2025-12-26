<template>
  <VSidebar>
    <VSidebarContent>
      <VSidebarGroup>
        <VSidebarGroupLabel class="mb-2">Application</VSidebarGroupLabel>
        <VSidebarGroupContent>
          <VSidebarMenu>
            <VSidebarMenuItem v-for="item in items" :key="item.title">
              <VSidebarMenuButton as-child size="lg" :is-active="item.name == route.name">
                <NuxtLink :to="{ name: item.name }">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </VSidebarMenuButton>
            </VSidebarMenuItem>
          </VSidebarMenu>
        </VSidebarGroupContent>
      </VSidebarGroup>
    </VSidebarContent>
    <VSidebarFooter>
      <VSidebarMenu>
        <VSidebarMenuItem>
          <VDropdownMenu>
            <VDropdownMenuTrigger asChild>
              <VSidebarMenuButton>
                <span class="font-semibold">{{ currentUser?.email }}</span>
                <ChevronUp class="ml-auto" />
              </VSidebarMenuButton>
            </VDropdownMenuTrigger>
            <VDropdownMenuContent side="top" class="w-[--radix-popper-anchor-width]">
              <VDropdownMenuItem @click="logout">Sign out</VDropdownMenuItem>
            </VDropdownMenuContent>
          </VDropdownMenu>
        </VSidebarMenuItem>
      </VSidebarMenu>
    </VSidebarFooter>
  </VSidebar>
</template>

<script setup lang="ts">
import { ChevronUp, Database, LayoutDashboard, Sliders, Sparkles, Tag } from "lucide-vue-next";
import { RouteKey } from "~/const/RouteKey";

const { logout, currentUser } = useUserStore();
const route = useRoute();

const items = [
  {
    title: "Dashboard",
    name: RouteKey.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Ask",
    name: RouteKey.ADMIN_ASK,
    icon: Sparkles,
  },
  {
    title: "Source",
    name: RouteKey.ADMIN_SOURCE,
    icon: Database,
  },
  {
    title: "Group",
    name: RouteKey.ADMIN_GROUP,
    icon: Tag,
  },
  {
    title: "Preset",
    name: RouteKey.ADMIN_PRESET,
    icon: Sliders,
  },
];
</script>
