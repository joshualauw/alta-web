<template>
  <VDialog :open="open" @update:open="emits('close', false)">
    <VDialogContent v-if="group">
      <form @submit="onSubmit" class="space-y-6">
        <VDialogHeader>
          <VDialogTitle>{{ group.name }}</VDialogTitle>
        </VDialogHeader>

        <VFormField v-slot="{ componentField }" name="name">
          <VFormItem>
            <VFormLabel>Name</VFormLabel>
            <VFormControl>
              <VInput type="text" placeholder="Name" v-bind="componentField" />
            </VFormControl>
            <VFormMessage />
          </VFormItem>
        </VFormField>

        <VFormField v-slot="{ componentField }" name="colorCode">
          <VFormItem>
            <VFormLabel>Color</VFormLabel>
            <VFormControl>
              <div class="relative flex items-center">
                <div
                  class="flex h-10 w-full items-center gap-2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background"
                >
                  <div
                    class="h-4 w-4 shrink-0 rounded-full border border-black/10"
                    :style="{ backgroundColor: componentField.modelValue }"
                  />
                  <span class="flex-1 text-muted-foreground font-mono">
                    {{ componentField.modelValue || "#000000" }}
                  </span>
                  <input
                    type="color"
                    v-bind="componentField"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </VFormControl>
            <VFormMessage />
          </VFormItem>
        </VFormField>

        <VDialogFooter>
          <VButton type="submit">
            <Loader2 v-if="loading" class="mr-2 w-4 h-4 animate-spin" />
            Submit
          </VButton>
        </VDialogFooter>
      </form>
    </VDialogContent>
  </VDialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import type { GetGroupDetailResponse } from "~/types/group/GetGroupDetail";
import { updateGroupRequest } from "~/types/group/UpdateGroup";

const props = defineProps<{
  open: boolean;
  group: GetGroupDetailResponse | null;
}>();

const emits = defineEmits<{
  (e: "close", change: boolean): void;
}>();

const { updateGroup } = useGroupStore();
const { execute, loading, success, message } = useApiRef(updateGroup);

watch(props, async (val) => {
  if (val.group && val.open) {
    form.setFieldValue("name", val.group.name);
    form.setFieldValue("colorCode", val.group.colorCode);
  }
});

const form = useForm({
  validationSchema: toTypedSchema(updateGroupRequest),
  initialValues: {
    name: "",
    colorCode: "#ffffff",
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  if (props.group) {
    await execute(props.group.id, values);
    if (success.value) {
      toast.success(message.value);
      emits("close", true);
    } else {
      toast.error(message.value);
    }
  }
});
</script>
