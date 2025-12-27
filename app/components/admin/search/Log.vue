<template>
  <VDialog :open="open" @update:open="handleOpenChange">
    <VDialogContent class="max-w-2xl">
      <VDialogHeader>
        <VDialogTitle>Search Log</VDialogTitle>
      </VDialogHeader>

      <div v-if="!loading && logs.length === 0" class="text-center py-8">
        <VEmpty>
          <VEmptyHeader>
            <VEmptyMedia variant="icon">
              <FileQuestion class="h-10 w-10 text-muted-foreground" />
            </VEmptyMedia>
            <VEmptyTitle>No Search Logs</VEmptyTitle>
            <VEmptyDescription>No search history yet</VEmptyDescription>
          </VEmptyHeader>
        </VEmpty>
      </div>

      <VScrollArea v-else class="h-90 pr-4">
        <div class="space-y-4">
          <div v-for="log in logs" :key="log.id" class="border rounded-lg p-4 bg-muted/30">
            <div class="mb-1">
              <p class="text-xs text-muted-foreground">{{ dayjs(log.createdAt).format("MMM DD, YYYY HH:mm") }}</p>
            </div>
            <div class="mb-2">
              <p class="text-sm font-medium text-foreground">Q: {{ log.question }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">{{ log.answer }}</p>
            </div>
          </div>

          <div v-if="loadingMore" class="flex justify-center py-4">
            <div class="flex gap-1 items-center">
              <div class="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>
      </VScrollArea>

      <VDialogFooter class="border-t pt-4">
        <VButton
          v-if="hasMore && !loadingMore"
          @click="loadMore"
          variant="ghost"
          size="sm"
          class="w-full text-center text-sm text-muted-foreground"
        >
          <Plus class="h-4 w-4" />
          More
        </VButton>
        <div v-else-if="!hasMore && logs.length > 0" class="w-full text-center text-sm text-muted-foreground">
          No more logs
        </div>
      </VDialogFooter>
    </VDialogContent>
  </VDialog>
</template>

<script setup lang="ts">
import { FileQuestion, Plus } from "lucide-vue-next";
import type { GetSearchLogResponse } from "~/types/source/GetSearchLog";
import dayjs from "dayjs";

const props = defineProps<{
  open: boolean;
}>();

const emits = defineEmits<{
  (e: "close"): void;
}>();

const logs = ref<GetSearchLogResponse[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const totalItems = ref(0);

const paging = reactive({
  page: 1,
  size: 5,
});

const { getSearchLog } = useSourceStore();

const hasMore = computed(() => logs.value.length < totalItems.value);

async function fetchSearchLog(page: number = 1) {
  const isFirstPage = page === 1;

  if (isFirstPage) {
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  const getSearchLogHandler = useApi(getSearchLog);
  const res = await getSearchLogHandler({ page, size: paging.size });

  if (res.success && res.data) {
    if (isFirstPage) {
      logs.value = res.data.items ?? [];
      loading.value = false;
    } else {
      logs.value.push(...(res.data.items ?? []));
      loadingMore.value = false;
    }

    paging.page = page;
    totalItems.value = res.data.totalItems;
  }
}

function handleOpenChange(open: boolean) {
  if (!open) {
    paging.page = 1;
    emits("close");
  }
}

watch(props, async (val) => {
  if (val.open) {
    await fetchSearchLog();
  }
});

async function loadMore() {
  await fetchSearchLog(paging.page + 1);
}
</script>
