<template>
  <div class="space-y-6">
    <div class="max-w-full flex justify-between items-center">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight">Sources</h1>
        </div>
        <p class="text-muted-foreground">Manage your knowledge base documents</p>
      </div>
      <div class="flex items-center gap-2">
        <AdminSourceFilter
          :is-filter="isFilter"
          @applied="handleFilterSourceApplied"
          @cleared="handleFilterSourceCleared"
        />
        <VButton variant="outline" size="icon" @click="refresh" :disabled="pending" title="Refresh sources">
          <RefreshCcw :class="['h-4 w-4', pending ? 'animate-spin' : '']" />
        </VButton>
        <VButton class="bg-primary text-primary-foreground">
          <Plus class="h-4 w-4" />
          Add Source
        </VButton>
      </div>
    </div>

    <div
      v-if="isFilter && filteredSources.length == 0"
      class="flex min-h-100 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in zoom-in duration-300"
    >
      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-ghost">
        <Frown class="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-semibold">Could not find sources</h3>
      <p class="mb-6 mt-2 text-sm text-muted-foreground max-w-xs mx-auto">Esnure your filter is correct</p>
    </div>

    <div
      v-if="(sources?.data?.items ?? []).length === 0"
      class="flex min-h-100 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in zoom-in duration-300"
    >
      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
        <FileText class="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 class="mt-4 text-lg font-semibold">No sources found</h3>
      <p class="mb-6 mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
        You haven't added any documents to your knowledge base yet
      </p>
      <VButton variant="outline" class="gap-2">
        <Plus class="h-4 w-4" />
        Add your first source
      </VButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="source in (filteredSources.length > 0 || isFilter ? filteredSources : sources?.data?.items) ?? []"
        :key="source.id"
        class="rounded-xl border bg-card p-5 hover:border-border/80 transition-colors duration-200"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary/5">
              <FileText class="size-4 text-primary" />
            </div>
            <div>
              <h4 class="font-semibold text-sm text-foreground line-clamp-1">
                {{ source.name }}
              </h4>
              <p class="text-xs text-muted-foreground mt-0.5">ID: {{ source.id }}</p>
            </div>
          </div>

          <VDropdownMenu>
            <VDropdownMenuTrigger as-child>
              <VButton variant="ghost" size="icon" class="h-7 w-7">
                <MoreHorizontal class="size-4" />
              </VButton>
            </VDropdownMenuTrigger>
            <VDropdownMenuContent align="end" class="w-40">
              <VDropdownMenuItem @click="handleGetSourceDetail(source.id, 'detail')" class="text-sm">
                <Eye class="mr-1 size-3.5" />
                Detail
              </VDropdownMenuItem>
              <VDropdownMenuItem @click="handleGetSourceDetail(source.id, 'edit')" class="text-sm">
                <Edit class="mr-1 size-3.5" />
                Edit
              </VDropdownMenuItem>
              <VDropdownMenuSeparator />
              <VDropdownMenuItem @click="handleGetSourceDetail(source.id, 'delete')" class="text-sm text-destructive">
                <Trash2 class="mr-1 size-3.5" />
                Delete
              </VDropdownMenuItem>
            </VDropdownMenuContent>
          </VDropdownMenu>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground">Status</span>
            <VBadge
              variant="outline"
              :class="
                cn(
                  'px-2 py-0.5 text-xs font-normal',
                  source.status === 'DONE'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
                )
              "
            >
              {{ source.status }}
            </VBadge>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground">Group</span>
            <span class="text-sm font-medium text-foreground">
              {{ source.groupName ?? "-" }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground">Created</span>
            <div class="text-right">
              <div class="text-sm font-medium text-foreground">
                {{ dayjs(source.createdAt).format("MMM DD, YYYY") }}
              </div>
              <div class="text-xs text-muted-foreground">
                {{ dayjs(source.createdAt).format("HH:mm") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AdminSourceDetail @close="detailModalOpen = false" :open="detailModalOpen" :source="sourceDetail" />
    <AdminSourceEdit @close="handleUpdateSource" :open="editModalOpen" :source="sourceDetail" />
    <AdminSourceDelete @close="handleDeleteSource" :open="deleteModalOpen" :source="sourceDetail" />
  </div>
</template>

<script setup lang="ts">
import { Edit, Eye, FileText, Frown, MoreHorizontal, Plus, RefreshCcw, Trash2 } from "lucide-vue-next";
import { RouteKey } from "~/const/RouteKey";
import { cn } from "~/lib/utils";
import type { GetSourceDetailResponse } from "~/types/source/GetSourceDetail";
import dayjs from "dayjs";
import type { FilterSourceResponse } from "~/types/source/FilterSource";

definePageMeta({
  name: RouteKey.ADMIN_SOURCE,
  layout: "admin",
  middleware: ["auth"],
});

const detailModalOpen = ref(false);
const editModalOpen = ref(false);
const deleteModalOpen = ref(false);

const sourceDetail = ref<GetSourceDetailResponse | null>(null);
const isFilter = ref(false);
const filteredSources = ref<FilterSourceResponse[]>([]);

const { getAllSource, getSourceDetail } = useSourceStore();
const { data: sources, refresh, pending } = await useAsyncData(() => getAllSource());

function handleFilterSourceApplied(payload: FilterSourceResponse[]) {
  isFilter.value = true;
  filteredSources.value = payload;
  console.log(payload);
}

function handleFilterSourceCleared() {
  isFilter.value = false;
  filteredSources.value = [];
}

async function handleUpdateSource(change: boolean) {
  editModalOpen.value = false;
  if (change) await refresh();
}

async function handleDeleteSource(change: boolean) {
  deleteModalOpen.value = false;
  if (change) await refresh();
}

async function handleGetSourceDetail(sourceId: number, modal: "detail" | "edit" | "delete") {
  const res = await getSourceDetail(sourceId);

  if (res.success && res.data) {
    sourceDetail.value = res.data;

    if (modal == "detail") {
      detailModalOpen.value = true;
    } else if (modal == "edit") {
      editModalOpen.value = true;
    } else {
      deleteModalOpen.value = true;
    }
  }
}
</script>
