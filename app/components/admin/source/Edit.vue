<template>
  <VDialog :open="open" @update:open="emits('close', false)">
    <VDialogContent v-if="source">
      <form @submit="onSubmit" class="space-y-6">
        <VDialogHeader>
          <VDialogTitle>{{ source.name }}</VDialogTitle>
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

        <VFormField v-slot="{ componentField }" name="groupId">
          <VFormItem>
            <VFormLabel>Group</VFormLabel>
            <VSelect v-bind="componentField">
              <VFormControl>
                <VSelectTrigger class="w-full">
                  <VSelectValue placeholder="Select a group" />
                </VSelectTrigger>
              </VFormControl>
              <VSelectContent>
                <VSelectItem :value="null">-no group-</VSelectItem>
                <VSelectItem v-for="group in selectableGroups" :value="group.id">
                  {{ group.name }}
                </VSelectItem>
              </VSelectContent>
            </VSelect>
            <VFormMessage />
          </VFormItem>
        </VFormField>

        <VDialogFooter>
          <VButton type="submit">
            <Loader2Icon v-if="loading" class="mr-2 w-4 h-4 animate-spin" />
            Submit
          </VButton>
        </VDialogFooter>
      </form>
    </VDialogContent>
  </VDialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2Icon } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import type { GetAllGroupResponse } from "~/types/group/GetAllGroup";
import type { GetSourceDetailResponse } from "~/types/source/GetSourceDetail";
import { updateSourceRequest } from "~/types/source/UpdateSource";

const props = defineProps<{
  open: boolean;
  source: GetSourceDetailResponse | null;
}>();

const emits = defineEmits<{
  (e: "close", change: boolean): void;
}>();

const { getAllGroup } = useGroupStore();
const { updateSource } = useSourceStore();
const { execute, loading, success, message } = useApiRef(updateSource);

const selectableGroups = ref<GetAllGroupResponse[]>([]);

const form = useForm({
  validationSchema: toTypedSchema(updateSourceRequest),
  initialValues: {
    name: "",
    groupId: undefined,
  },
});

watch(props, async (val) => {
  if (val.source) {
    form.setFieldValue("name", val.source.name);
    if (val.source.groupId) {
      form.setFieldValue("groupId", val.source.groupId);
    } else {
      form.setFieldValue("groupId", null);
    }
  }

  if (val.open) {
    const getAllGroupHandler = useApi(getAllGroup);
    const res = await getAllGroupHandler();
    if (res.success && res.data) {
      selectableGroups.value = res.data.items;
    }
  }
});

const onSubmit = form.handleSubmit(async (values) => {
  if (props.source) {
    await execute(props.source.id, values);
    if (success.value) {
      toast.success(message.value);
      emits("close", true);
    } else {
      toast.error(message.value);
    }
  }
});
</script>
