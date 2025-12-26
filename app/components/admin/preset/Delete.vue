<template>
  <VDialog :open="open" @update:open="emits('close', false)">
    <VDialogContent v-if="preset">
      <VDialogHeader>
        <VDialogTitle>Delete {{ preset.name }}</VDialogTitle>
        <VDialogDescription>This action cannot be undone</VDialogDescription>
      </VDialogHeader>
      <VDialogFooter>
        <VButton variant="destructive" @click="handleDeletePreset">
          <Loader2 v-if="loading" class="mr-2 w-4 h-4 animate-spin" />
          Delete
        </VButton>
      </VDialogFooter>
    </VDialogContent>
  </VDialog>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { GetPresetDetailResponse } from "~/types/preset/GetPresetDetail";

const props = defineProps<{
  open: boolean;
  preset: GetPresetDetailResponse | null;
}>();

const emits = defineEmits<{
  (e: "close", change: boolean): void;
}>();

const { deletePreset } = usePresetStore();
const { execute, success, message, loading } = useApiRef(deletePreset);

async function handleDeletePreset() {
  if (props.preset) {
    await execute(props.preset.id);

    if (success.value) {
      toast.success(message.value);
      emits("close", true);
    } else {
      toast.error(message.value);
    }
  }
}
</script>
