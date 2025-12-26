<template>
  <div class="space-y-6">
    <div class="max-w-full flex justify-between items-center">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight">Presets</h1>
        </div>
        <p class="text-muted-foreground">Manage your AI generation presets</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="text-sm font-semibold mr-2">{{ presetCards.length }} Record(s)</div>
        <VButton variant="outline" size="icon" @click="refresh" :disabled="pending" title="Refresh presets">
          <RefreshCcw :class="['h-4 w-4', pending ? 'animate-spin' : '']" />
        </VButton>
        <VButton @click="addModalOpen = true" class="bg-primary text-primary-foreground">
          <Plus class="h-4 w-4" />
          Add Preset
        </VButton>
      </div>
    </div>

    <div
      v-if="presetCards.length === 0"
      class="flex min-h-100 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in zoom-in duration-300"
    >
      <VEmpty>
        <VEmptyHeader>
          <VEmptyMedia variant="icon">
            <Sliders class="h-10 w-10 text-muted-foreground" />
          </VEmptyMedia>
          <VEmptyTitle>No Presets</VEmptyTitle>
          <VEmptyDescription> You haven't added any presets yet </VEmptyDescription>
        </VEmptyHeader>
      </VEmpty>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="preset in presetCards"
        :key="preset.id"
        class="rounded-xl border bg-card p-5 hover:border-border/80 transition-colors duration-200"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary/5">
              <Sliders class="size-4 text-primary" />
            </div>
            <div>
              <h4 class="font-semibold text-sm text-foreground line-clamp-1">
                {{ preset.name }}
              </h4>
              <p class="text-xs text-muted-foreground mt-0.5">ID: {{ preset.id }}</p>
            </div>
          </div>

          <VDropdownMenu>
            <VDropdownMenuTrigger as-child>
              <VButton variant="ghost" size="icon" class="h-7 w-7">
                <MoreHorizontal class="size-4" />
              </VButton>
            </VDropdownMenuTrigger>
            <VDropdownMenuContent align="end" class="w-40">
              <VDropdownMenuItem @click="handleGetPresetDetail(preset.id, 'edit')" class="text-sm">
                <Edit class="mr-1 size-3.5" />
                Edit
              </VDropdownMenuItem>
              <VDropdownMenuSeparator />
              <VDropdownMenuItem @click="handleGetPresetDetail(preset.id, 'delete')" class="text-sm text-destructive">
                <Trash2 class="mr-1 size-3.5" />
                Delete
              </VDropdownMenuItem>
            </VDropdownMenuContent>
          </VDropdownMenu>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground">Code</span>
            <div class="text-sm font-medium text-foreground flex items-center">
              <code class="bg-muted px-1.5 py-0.5 rounded text-xs">{{ preset.code }}</code>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground">Created</span>
            <div class="text-right">
              <div class="text-sm font-medium text-foreground">
                {{ dayjs(preset.createdAt).format("MMM DD, YYYY") }}
              </div>
              <div class="text-xs text-muted-foreground">
                {{ dayjs(preset.createdAt).format("HH:mm") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-6">
      <VPagination
        v-model:page="paging.page"
        v-slot="{ page }"
        :items-per-page="paging.size"
        :total="presets?.data?.totalItems"
        :default-page="1"
      >
        <VPaginationContent v-slot="{ items }">
          <VPaginationPrevious />
          <template v-for="(item, index) in items" :key="index">
            <VPaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
              {{ item.value }}
            </VPaginationItem>
          </template>
          <VPaginationEllipsis :index="4" />
          <VPaginationNext />
        </VPaginationContent>
      </VPagination>
    </div>

    <AdminPresetAdd @close="handlePresetChanged($event, 'add')" :open="addModalOpen" />
    <AdminPresetEdit @close="handlePresetChanged($event, 'edit')" :open="editModalOpen" :preset="presetDetail" />
    <AdminPresetDelete @close="handlePresetChanged($event, 'delete')" :open="deleteModalOpen" :preset="presetDetail" />
  </div>
</template>

<script setup lang="ts">
import { RefreshCcw, Sliders, Plus, Edit, MoreHorizontal, Trash2 } from "lucide-vue-next";
import { RouteKey } from "~/const/RouteKey";
import dayjs from "dayjs";
import type { GetPresetDetailResponse } from "~/types/preset/GetPresetDetail";

definePageMeta({
  name: RouteKey.ADMIN_PRESET,
  layout: "admin",
  middleware: ["auth"],
});

const paging = reactive({
  page: 1,
  size: 6,
});

const { getAllPreset, getPresetDetail } = usePresetStore();
const {
  data: presets,
  pending,
  refresh,
} = await useAsyncData(() => getAllPreset(paging), {
  watch: [paging],
});

const presetCards = computed(() => presets.value?.data?.items ?? []);

const addModalOpen = ref(false);
const editModalOpen = ref(false);
const deleteModalOpen = ref(false);
const presetDetail = ref<GetPresetDetailResponse | null>(null);

async function handlePresetChanged(change: boolean, modal: "add" | "edit" | "delete") {
  if (modal === "add") {
    addModalOpen.value = false;
  } else if (modal === "edit") {
    editModalOpen.value = false;
  } else if (modal === "delete") {
    deleteModalOpen.value = false;
  }

  if (change) {
    await refresh();
    paging.page = 1;
  }
}

async function handleGetPresetDetail(presetId: number, modal: "edit" | "delete") {
  const res = await getPresetDetail(presetId);
  if (res.success && res.data) {
    presetDetail.value = res.data;

    if (modal === "edit") {
      editModalOpen.value = true;
    } else if (modal === "delete") {
      deleteModalOpen.value = true;
    }
  }
}
</script>
