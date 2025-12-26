<template>
  <VDialog :open="open" @update:open="emits('close', false)">
    <VDialogContent>
      <form @submit="onSubmit">
        <VDialogHeader>
          <VDialogTitle>Add Group</VDialogTitle>
        </VDialogHeader>

        <div class="space-y-4 p-2 my-4">
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
        </div>

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
import { createGroupRequest } from "~/types/group/CreateGroup";

const props = defineProps<{
  open: boolean;
}>();

const emits = defineEmits<{
  (e: "close", change: boolean): void;
}>();

const { createGroup } = useGroupStore();
const { execute, success, message, loading } = useApiRef(createGroup);

const form = useForm({
  validationSchema: toTypedSchema(createGroupRequest),
  initialValues: {
    name: "",
    colorCode: "#000000",
  },
  keepValuesOnUnmount: true,
});

const onSubmit = form.handleSubmit(async (values) => {
  await execute(values);
  if (success.value) {
    toast.success(message.value);
    emits("close", true);
  } else {
    toast.error(message.value);
  }
});
</script>
