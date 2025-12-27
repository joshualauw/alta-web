<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between max-w-full">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-xl md:text-2xl font-bold tracking-tight">Ask</h1>
        </div>
        <p class="text-sm md:text-base text-muted-foreground">Chat with your documents</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-y-5 lg:gap-x-5 h-[calc(100vh-150px)]">
      <div class="rounded-xl border bg-card p-5 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-sm">Sources ({{ filteredSources.length }})</h2>
          <AdminSourceFilter :is-filter="isFilter" @applied="handleFilterApplied" @cleared="handleFilterCleared" />
        </div>

        <div
          v-if="!isFilter"
          class="flex flex-1 flex-col items-center justify-center rounded-md border border-dashed p-4 text-center"
        >
          <VEmpty>
            <VEmptyHeader>
              <VEmptyMedia variant="icon">
                <Filter class="h-10 w-10 text-muted-foreground" />
              </VEmptyMedia>
              <VEmptyTitle>Filter to Select</VEmptyTitle>
              <VEmptyDescription> Click the filter button to select documents </VEmptyDescription>
            </VEmptyHeader>
          </VEmpty>
        </div>

        <div v-else class="space-y-3 flex-1 overflow-y-auto p-2">
          <div
            v-if="filteredSources.length === 0"
            class="flex flex-col items-center justify-center rounded-md border border-dashed p-4 text-center py-8"
          >
            <VEmpty>
              <VEmptyHeader>
                <VEmptyMedia variant="icon">
                  <FileQuestion class="h-8 w-8 text-muted-foreground" />
                </VEmptyMedia>
                <VEmptyTitle class="text-sm">No Sources</VEmptyTitle>
                <VEmptyDescription class="text-xs"> Ensure your filter is correct </VEmptyDescription>
              </VEmptyHeader>
            </VEmpty>
          </div>

          <div
            v-for="source in filteredSources"
            :key="source.id"
            class="p-3 rounded-lg border transition-colors cursor-pointer flex items-start gap-2"
            :class="{
              'ring-2 ring-primary/30 bg-primary/5': isSelected(source.id),
            }"
            @click="toggleSelect(source.id)"
          >
            <VInput type="checkbox" class="shrink-0 mt-0.5 h-4 w-4 rounded border" :checked="isSelected(source.id)" />
            <FileText class="h-4 w-4 text-primary mt-0.5" />
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-xs text-foreground line-clamp-1">{{ source.name }}</h4>
              <p class="text-xs text-muted-foreground mt-0.5">ID: {{ source.id }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="md:col-span-2 rounded-xl border bg-card p-5 flex flex-col">
        <p v-if="sourceChats.length == 0" class="text-center text-muted-foreground mb-4">-no chats yet-</p>
        <VScrollArea v-else class="mb-4 pr-4 h-90">
          <div class="space-y-4">
            <div
              v-for="(chat, idx) in sourceChats"
              :key="idx"
              class="flex gap-3"
              :class="chat.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <template v-if="chat.role === 'ai'">
                <div class="flex gap-2 flex-1 max-w-xs lg:max-w-md">
                  <div class="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span class="text-xs font-semibold text-muted-foreground">AI</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-muted-foreground mb-1">Assistant</p>
                    <div class="bg-muted/50 rounded-lg p-3 text-sm text-foreground leading-relaxed">
                      {{ chat.content }}
                    </div>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="flex gap-2 flex-1 max-w-xs lg:max-w-md justify-end">
                  <div class="flex-1">
                    <p class="text-xs text-muted-foreground mb-1 text-right">You</p>
                    <div class="bg-primary text-primary-foreground rounded-lg p-3 text-sm leading-relaxed">
                      {{ chat.content }}
                    </div>
                  </div>
                  <div class="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span class="text-xs text-primary-foreground font-semibold">U</span>
                  </div>
                </div>
              </template>
            </div>

            <div v-if="loading" class="flex gap-3 justify-start">
              <div class="flex gap-2 flex-1 max-w-xs lg:max-w-md">
                <div class="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span class="text-xs font-semibold text-muted-foreground">AI</span>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-muted-foreground mb-1">Assistant</p>
                  <div class="bg-muted/50 rounded-lg p-3 text-sm">
                    <div class="flex gap-1 items-center">
                      <div
                        class="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style="animation-delay: 0ms"
                      ></div>
                      <div
                        class="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style="animation-delay: 150ms"
                      ></div>
                      <div
                        class="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style="animation-delay: 300ms"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VScrollArea>

        <div class="gap-2 border-t pt-4 -mx-5 px-5">
          <div class="flex flex-col lg:flex-row lg:items-center lg:flex-wrap gap-3 lg:gap-x-5 mb-2">
            <VLabel class="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <VCheckbox v-model="rerank" class="h-4 w-4" />
              <span>Rerank</span>
            </VLabel>

            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <VLabel class="text-sm text-muted-foreground whitespace-nowrap">Tone</VLabel>
              <VSelect v-model="tone" class="rounded-md border bg-background px-2 py-1 text-sm w-full sm:w-auto">
                <VSelectTrigger class="w-full">
                  <VSelectValue placeholder="Select a tone" />
                </VSelectTrigger>
                <VSelectContent>
                  <VSelectItem value="normal">Normal</VSelectItem>
                  <VSelectItem value="concise">Concise</VSelectItem>
                  <VSelectItem value="explanatory">Explanatory</VSelectItem>
                  <VSelectItem value="formal">Formal</VSelectItem>
                </VSelectContent>
              </VSelect>
            </div>

            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <VLabel class="text-sm text-muted-foreground whitespace-nowrap">Preset</VLabel>
              <div class="flex items-center gap-2 w-full">
                <VSelect v-model="selectedPreset" class="rounded-md border bg-background px-2 py-1 text-sm flex-1">
                  <VSelectTrigger class="w-full">
                    <VSelectValue placeholder="Select a preset" />
                  </VSelectTrigger>
                  <VSelectContent>
                    <VSelectItem :value="null">-no preset-</VSelectItem>
                    <VSelectItem v-for="p in presets" :key="p.id" :value="p.id">{{ p.name }}</VSelectItem>
                  </VSelectContent>
                </VSelect>

                <VPopover @update:open="handlePresetOpened">
                  <VPopoverTrigger as-child>
                    <VButton variant="ghost" size="icon" class="h-8 w-8 shrink-0">
                      <Info class="size-4 text-muted-foreground" />
                    </VButton>
                  </VPopoverTrigger>
                  <VPopoverContent class="w-72">
                    <div v-if="presetDetail">
                      <div class="font-semibold">{{ presetDetail.name }}</div>
                      <div class="text-xs text-muted-foreground">Code: {{ presetDetail.code }}</div>
                      <div class="text-sm mt-2">Chunk Size: {{ presetDetail.chunkSplitSize }}</div>
                      <div class="text-sm">Top K: {{ presetDetail.topK }}, Top N: {{ presetDetail.topN }}</div>
                      <div class="text-sm">Min Similarity: {{ presetDetail.minSimilarityScore }}</div>
                      <div class="text-sm">Max Tokens: {{ presetDetail.maxResponseTokens }}</div>
                      <div class="text-sm">Rerank Model: {{ presetDetail.rerankModel }}</div>
                      <div class="text-sm">Responses Model: {{ presetDetail.responsesModel }}</div>
                    </div>
                    <div v-else class="text-sm text-muted-foreground">No preset selected</div>
                  </VPopoverContent>
                </VPopover>
              </div>
            </div>
          </div>

          <div class="flex w-full gap-x-2 mt-4">
            <VInput
              v-model="question"
              :disabled="selectedSources.length === 0"
              placeholder="Ask your question..."
              class="flex-1"
            />
            <VButton
              :disabled="selectedSources.length === 0 || !question || loading"
              @click="sendChat"
              size="icon"
              class="bg-primary text-primary-foreground"
            >
              <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
              <Send v-else class="h-4 w-4" />
            </VButton>
          </div>
          <div class="text-sm text-muted-foreground text-center mt-2">
            {{ chatPlaceholder }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Send, Filter, FileText, FileQuestion, Loader2, Info } from "lucide-vue-next";
import type { GetAllPresetResponse } from "~/types/preset/GetAllPreset";
import { RouteKey } from "~/const/RouteKey";
import type { FilterSourceResponse } from "~/types/source/FilterSource";
import type { GetPresetDetailResponse } from "~/types/preset/GetPresetDetail";
import type { SearchSourceQuery, SearchSourceRequest } from "~/types/source/SearchSource";
import { toast } from "vue-sonner";
import type { SourceChat } from "~/types/ui/SourceChat";

definePageMeta({
  name: RouteKey.ADMIN_ASK,
  layout: "admin",
  middleware: ["auth"],
});

const isFilter = ref(false);
const filteredSources = ref<FilterSourceResponse[]>([]);
const selectedSources = ref<number[]>([]);
const question = ref("");
const rerank = ref(false);
const tone = ref<string | null>("normal");
const selectedPreset = ref<number | null>(null);
const presetDetail = ref<GetPresetDetailResponse | null>(null);

const sourceChats = ref<SourceChat[]>([]);

const { searchSource } = useSourceStore();
const { getAllPreset, getPresetDetail } = usePresetStore();

const { data: presetsData } = await useAsyncData(() => getAllPreset());
const presets = computed<GetAllPresetResponse[]>(() => presetsData.value?.data?.items ?? []);

const { execute, loading, success, message, data } = useApiRef(searchSource);

watch(data, (newData) => {
  if (newData && !loading.value) {
    sourceChats.value.push({
      content: newData.answer,
      role: "ai",
    });
    question.value = "";
  }
});

async function handlePresetOpened() {
  if (selectedPreset.value != null) {
    const getPresetDetailHandler = useApi(getPresetDetail);
    const res = await getPresetDetailHandler(selectedPreset.value);
    if (res.success && res.data) {
      presetDetail.value = res.data;
    }
  } else {
    presetDetail.value = null;
  }
}

function handleFilterApplied(payload: FilterSourceResponse[]) {
  isFilter.value = true;
  filteredSources.value = payload;
}

function handleFilterCleared() {
  isFilter.value = false;
  filteredSources.value = [];
  selectedSources.value = [];
}

function isSelected(id: number) {
  return selectedSources.value.includes(id);
}

function toggleSelect(id: number) {
  const idx = selectedSources.value.indexOf(id);
  if (idx === -1) selectedSources.value.push(id);
  else selectedSources.value.splice(idx, 1);
}

const chatPlaceholder = computed(() => {
  if (selectedSources.value.length === 0) return "Select documents on the left to start a chat";
  if (selectedSources.value.length === 1) return "Chatting with 1 selected document";
  return `Chatting with ${selectedSources.value.length} selected documents`;
});

async function sendChat() {
  if (!question.value || selectedSources.value.length === 0) return;

  const values: SearchSourceRequest = {
    question: question.value,
    sourceIds: selectedSources.value,
  };

  const query: SearchSourceQuery = {
    rerank: rerank.value ? "1" : "0",
    tone: tone.value as any,
  };

  if (selectedPreset.value != null) {
    query.preset = presets.value.find((p) => p.id === selectedPreset.value)?.code;
  }

  sourceChats.value.push({
    content: question.value,
    role: "user",
  });

  await execute(values, query);

  if (!success.value) {
    sourceChats.value.pop();
    toast.error(message.value);
  }
}
</script>
