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
                <VInput type="color" class="py-0" placeholder="Color Code" v-bind="componentField" />
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
