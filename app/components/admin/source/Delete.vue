<template>
  <VDialog :open="open" @update:open="emits('close', false)">
    <VDialogContent v-if="source">
      <VDialogHeader>
        <VDialogTitle>Delete {{ source.name }}</VDialogTitle>
        <VDialogDescription>This action cannot be undone</VDialogDescription>
      </VDialogHeader>
      <VDialogFooter>
        <VButton variant="destructive" @click="handleDeleteSource">
          <Loader2Icon v-if="loading" class="mr-2 w-4 h-4 animate-spin" />
          Delete
        </VButton>
      </VDialogFooter>
    </VDialogContent>
  </VDialog>
</template>

<script setup lang="ts">
import { Loader2Icon } from "lucide-vue-next";
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
const { execute, success, message, loading } = useApiRef(deleteSource);

async function handleDeleteSource() {
  if (props.source) {
    await execute(props.source.id);

    if (success.value) {
      toast.success(message.value);
      emits("close", true);
    } else {
      toast.error(message.value);
    }
  }
}
</script>
