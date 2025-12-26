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
        <div class="text-sm font-semibold mr-2">{{ totalRecords }} Record(s)</div>
        <AdminSourceFilter
          :is-filter="isFilter"
          @applied="handleFilterSourceApplied"
          @cleared="handleFilterSourceCleared"
        />
        <VButton variant="outline" size="icon" @click="refresh" :disabled="pending" title="Refresh sources">
          <RefreshCcw :class="['h-4 w-4', pending ? 'animate-spin' : '']" />
        </VButton>

        <VDropdownMenu>
          <VDropdownMenuTrigger as-child>
            <VButton class="bg-primary text-primary-foreground">
              <Plus class="h-4 w-4" />
              Add Source
            </VButton>
          </VDropdownMenuTrigger>
          <VDropdownMenuContent>
            <VDropdownMenuItem @click="addTextModalOpen = true">
              <FileText class="size-3.5" />
              Add from text
            </VDropdownMenuItem>
            <VDropdownMenuItem disabled>
              <FileUp class="size-3.5" />
              Upload File (soon)
            </VDropdownMenuItem>
            <VDropdownMenuItem disabled>
              <LayersPlus class="size-3.5" />
              Bulk Create (soon)
            </VDropdownMenuItem>
          </VDropdownMenuContent>
        </VDropdownMenu>
      </div>
    </div>

    <div
      v-if="isFilter && filteredSources.length == 0"
      class="flex min-h-100 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in zoom-in duration-300"
    >
      <VEmpty>
        <VEmptyHeader>
          <VEmptyMedia variant="icon">
            <FileQuestion class="h-10 w-10 text-muted-foreground" />
          </VEmptyMedia>
          <VEmptyTitle>Sources not Found</VEmptyTitle>
          <VEmptyDescription> Ensure your filter is correct </VEmptyDescription>
        </VEmptyHeader>
      </VEmpty>
    </div>

    <div
      v-if="(sources?.data?.items ?? []).length === 0"
      class="flex min-h-100 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in zoom-in duration-300"
    >
      <VEmpty>
        <VEmptyHeader>
          <VEmptyMedia variant="icon">
            <FileText class="h-10 w-10 text-muted-foreground" />
          </VEmptyMedia>
          <VEmptyTitle>No Sources</VEmptyTitle>
          <VEmptyDescription> You haven't added any documents to your knowledge base yet </VEmptyDescription>
        </VEmptyHeader>
        <VEmptyContent>
          <VButton @click="addTextModalOpen = true" class="gap-2">
            <Plus class="h-4 w-4" />
            Add your first source
          </VButton>
        </VEmptyContent>
      </VEmpty>
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
    <AdminSourceAddText @close="handleSourceChanged($event, 'add-text')" :open="addTextModalOpen" />
    <AdminSourceEdit @close="handleSourceChanged($event, 'edit')" :open="editModalOpen" :source="sourceDetail" />
    <AdminSourceDelete @close="handleSourceChanged($event, 'delete')" :open="deleteModalOpen" :source="sourceDetail" />
  </div>
</template>

<script setup lang="ts">
import {
  Edit,
  Eye,
  FileText,
  FileQuestion,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  Trash2,
  LayersPlus,
  FileUp,
} from "lucide-vue-next";
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
const addTextModalOpen = ref(false);

const sourceDetail = ref<GetSourceDetailResponse | null>(null);
const isFilter = ref(false);
const filteredSources = ref<FilterSourceResponse[]>([]);

const { getAllSource, getSourceDetail } = useSourceStore();
const { data: sources, refresh, pending } = await useAsyncData(() => getAllSource());

const totalRecords = computed(() => {
  const list = isFilter.value ? filteredSources.value : sources.value?.data?.items ?? [];
  return (list ?? []).length;
});

function handleFilterSourceApplied(payload: FilterSourceResponse[]) {
  isFilter.value = true;
  filteredSources.value = payload;
}

function handleFilterSourceCleared() {
  isFilter.value = false;
  filteredSources.value = [];
}

async function handleSourceChanged(change: boolean, modal: "add-text" | "edit" | "delete") {
  if (modal === "add-text") {
    addTextModalOpen.value = false;
  } else if (modal === "edit") {
    editModalOpen.value = false;
  } else if (modal === "delete") {
    deleteModalOpen.value = false;
  }

  if (change) {
    if (isFilter.value) {
      isFilter.value = false;
      filteredSources.value = [];
    }
    await refresh();
  }
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
