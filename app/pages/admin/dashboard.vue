<template>
  <div class="space-y-6">
    <div>
      <div class="flex items-center gap-3">
        <h1 class="text-xl md:text-2xl font-bold tracking-tight">Sources</h1>
      </div>
      <p class="text-sm md:text-base text-muted-foreground">Welcome, {{ currentUser?.email }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-xl border bg-card p-6 hover:border-border/80 transition-colors duration-200">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-muted-foreground font-medium">Total Sources</p>
            <p class="text-3xl md:text-4xl font-bold tracking-tight mt-2">
              {{ dashboardStatistic?.statistics.totalSources ?? 0 }}
            </p>
          </div>
          <div class="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
            <FileText class="size-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <p class="text-xs text-muted-foreground mt-4">Documents in your knowledge base</p>
      </div>

      <div class="rounded-xl border bg-card p-6 hover:border-border/80 transition-colors duration-200">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-muted-foreground font-medium">Total Searches</p>
            <p class="text-3xl md:text-4xl font-bold tracking-tight mt-2">
              {{ dashboardStatistic?.statistics.totalSearches ?? 0 }}
            </p>
          </div>
          <div class="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950">
            <Search class="size-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <p class="text-xs text-muted-foreground mt-4">All time Searches performed</p>
      </div>

      <div class="rounded-xl border bg-card p-6 hover:border-border/80 transition-colors duration-200">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-muted-foreground font-medium">Total Groups</p>
            <p class="text-3xl md:text-4xl font-bold tracking-tight mt-2">
              {{ dashboardStatistic?.statistics.totalGroups ?? 0 }}
            </p>
          </div>
          <div class="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
            <Tag class="size-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <p class="text-xs text-muted-foreground mt-4">Organized source groups</p>
      </div>
    </div>

    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-5 md:col-span-2 flex flex-col">
        <AdminDashboardSourceBar
          v-if="dashboardStatistic?.monthlyTopSources"
          :data="dashboardStatistic.monthlyTopSources"
          class="flex-1"
        />
      </div>

      <div class="col-span-5 md:col-span-3 flex flex-col">
        <AdminDashboardSearchLine
          v-if="dashboardStatistic?.weeklySearches"
          :data="dashboardStatistic.weeklySearches"
          class="flex-1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Search, Tag } from "lucide-vue-next";
import { RouteKey } from "~/const/RouteKey";

definePageMeta({
  name: RouteKey.ADMIN_DASHBOARD,
  layout: "admin",
  middleware: ["auth"],
});

const { currentUser } = useUserStore();
const { getDashboardStatistic } = useAnalyticsStore();

const { data } = await useAsyncData(() => getDashboardStatistic());
const dashboardStatistic = computed(() => data.value?.data);
</script>
