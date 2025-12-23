<template>
  <VDialog :open="open" @update:open="emits('close')">
    <VDialogContent v-if="source">
      <VDialogHeader>
        <VDialogTitle>{{ source.name }}</VDialogTitle>
      </VDialogHeader>
      <div class="overflow-y-auto h-60">
        <div class="prose prose-sm prose-neutral max-w-none">
          <div class="rounded-lg border bg-muted/30 p-3 mb-4">
            <h5 class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Metadata</h5>
            <div class="grid grid-cols-2 gap-y-2 gap-x-8">
              <div v-for="(value, key) in source.metadata" :key="key" class="space-y-1">
                <dt class="text-xs text-muted-foreground font-medium">
                  {{ key }}
                </dt>
                <dd class="text-sm font-medium text-foreground">
                  <div v-if="Array.isArray(value)" class="flex flex-wrap gap-1 mt-1">
                    <VBadge v-for="tag in value" :key="tag" variant="secondary" class="text-[10px] px-1.5 py-0">
                      {{ tag }}
                    </VBadge>
                  </div>
                  <VBadge v-else-if="typeof value === 'boolean'" :variant="value ? 'default' : 'outline'">
                    {{ value ? "yes" : "no" }}
                  </VBadge>
                  <span v-else>
                    {{ value }}
                  </span>
                </dd>
              </div>
            </div>
          </div>
          <p class="whitespace-pre-wrap">
            {{ source.content }}
          </p>
        </div>
      </div>
      <VDialogFooter class="border-t pt-4">
        <VButton variant="outline" size="sm" @click="handleCopy">
          <component :is="copied ? Check : Copy" class="mr-2 size-3.5" />
          {{ copied ? "Copied!" : "Copy Content" }}
        </VButton>
      </VDialogFooter>
    </VDialogContent>
  </VDialog>
</template>

<script setup lang="ts">
import type { GetSourceDetailResponse } from "~/types/source/GetSourceDetail";
import { Check, Copy } from "lucide-vue-next";

const props = defineProps<{
  open: boolean;
  source: GetSourceDetailResponse | null;
}>();

const emits = defineEmits<{
  (e: "close"): void;
}>();

const copied = ref(false);

const handleCopy = async () => {
  if (props.source) {
    try {
      await navigator.clipboard.writeText(props.source.content);
      copied.value = true;

      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }
};
</script>
