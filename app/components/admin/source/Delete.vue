<template>
  <VDialog :open="open" @update:open="emits('close', false)">
    <VDialogContent v-if="source">
      <VDialogHeader>
        <VDialogTitle>Delete {{ source.name }}</VDialogTitle>
        <VDialogDescription>This action cannot be undone</VDialogDescription>
      </VDialogHeader>
      <VDialogFooter>
        <VButton variant="destructive" @click="handleDeleteSource">Delete</VButton>
      </VDialogFooter>
    </VDialogContent>
  </VDialog>
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";
import type { GetSourceDetailResponse } from "~/types/source/GetSourceDetail";

const props = defineProps<{
  open: boolean;
  source: GetSourceDetailResponse | null;
}>();

const emits = defineEmits<{
  (e: "close", change: boolean): void;
}>();

const { deleteSource } = useSourceStore();
const { execute, success, message } = useApiRef(deleteSource);

async function handleDeleteSource(sourceId: number) {
  await execute(sourceId);

  if (success.value) {
    toast.success(message.value);
    emits("close", true);
  } else {
    toast.error(message.value);
  }
}
</script>
