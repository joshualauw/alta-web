<template>
  <VDialog :open="open" @update:open="emits('close', false)">
    <VDialogContent v-if="group">
      <VDialogHeader>
        <VDialogTitle>Delete {{ group.name }}</VDialogTitle>
        <VDialogDescription>This action cannot be undone</VDialogDescription>
      </VDialogHeader>
      <VDialogFooter>
        <VButton variant="destructive" @click="handleDeleteGroup">
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
import type { GetGroupDetailResponse } from "~/types/group/GetGroupDetail";

const props = defineProps<{
  open: boolean;
  group: GetGroupDetailResponse | null;
}>();

const emits = defineEmits<{
  (e: "close", change: boolean): void;
}>();

const { deleteGroup } = useGroupStore();
const { execute, success, message, loading } = useApiRef(deleteGroup);

async function handleDeleteGroup() {
  if (props.group) {
    await execute(props.group.id);

    if (success.value) {
      toast.success(message.value);
      emits("close", true);
    } else {
      toast.error(message.value);
    }
  }
}
</script>
