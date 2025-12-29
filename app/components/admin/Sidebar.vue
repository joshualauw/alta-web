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
import { ChevronUp, FileText, LayoutDashboard, Search, Sliders, Tag } from "lucide-vue-next";
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
    title: "Search",
    name: RouteKey.ADMIN_SEARCH,
    icon: Search,
  },
  {
    title: "Sources",
    name: RouteKey.ADMIN_SOURCE,
    icon: FileText,
  },
  {
    title: "Groups",
    name: RouteKey.ADMIN_GROUP,
    icon: Tag,
  },
  {
    title: "Presets",
    name: RouteKey.ADMIN_PRESET,
    icon: Sliders,
  },
];
</script>
