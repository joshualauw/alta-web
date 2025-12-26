<template>
  <VDialog :open="open" @update:open="emits('close', false)">
    <VDialogContent>
      <form @submit="onSubmit">
        <VDialogHeader>
          <VDialogTitle>Add Preset</VDialogTitle>
        </VDialogHeader>

        <div class="space-y-4 p-2 my-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <VFormField v-slot="{ componentField }" name="name">
                <VFormItem>
                  <VFormLabel>Name</VFormLabel>
                  <VFormControl>
                    <VInput type="text" placeholder="Name" v-bind="componentField" />
                  </VFormControl>
                  <VFormMessage />
                </VFormItem>
              </VFormField>
            </div>

            <VFormField v-slot="{ componentField }" name="chunkSplitSize">
              <VFormItem>
                <VFormLabel>Chunk Size</VFormLabel>
                <VFormControl>
                  <VInput type="number" min="100" max="2048" v-bind="componentField" />
                </VFormControl>
                <VFormMessage />
              </VFormItem>
            </VFormField>

            <VFormField v-slot="{ componentField }" name="chunkSplitOverlap">
              <VFormItem>
                <VFormLabel>Chunk Overlap</VFormLabel>
                <VFormControl>
                  <VInput type="number" min="10" max="100" v-bind="componentField" />
                </VFormControl>
                <VFormMessage />
              </VFormItem>
            </VFormField>

            <VFormField v-slot="{ componentField }" name="topK">
              <VFormItem>
                <VFormLabel>Top K</VFormLabel>
                <VFormControl>
                  <VInput type="number" min="1" max="50" v-bind="componentField" />
                </VFormControl>
                <VFormMessage />
              </VFormItem>
            </VFormField>

            <VFormField v-slot="{ componentField }" name="topN">
              <VFormItem>
                <VFormLabel>Top N</VFormLabel>
                <VFormControl>
                  <VInput type="number" min="1" max="10" v-bind="componentField" />
                </VFormControl>
                <VFormMessage />
              </VFormItem>
            </VFormField>

            <VFormField v-slot="{ componentField }" name="minSimilarityScore">
              <VFormItem>
                <VFormLabel>Min Similarity</VFormLabel>
                <VFormControl>
                  <VInput type="number" step="0.01" min="0" max="1" v-bind="componentField" />
                </VFormControl>
                <VFormMessage />
              </VFormItem>
            </VFormField>

            <VFormField v-slot="{ componentField }" name="maxResponseTokens">
              <VFormItem>
                <VFormLabel>Max Tokens</VFormLabel>
                <VFormControl>
                  <VInput type="number" min="512" max="4096" v-bind="componentField" />
                </VFormControl>
                <VFormMessage />
              </VFormItem>
            </VFormField>

            <VFormField v-slot="{ componentField }" name="rerankModel">
              <VFormItem>
                <VFormLabel>Rerank Model</VFormLabel>
                <VFormControl>
                  <VInput type="text" placeholder="Rerank model" v-bind="componentField" />
                </VFormControl>
                <VFormMessage />
              </VFormItem>
            </VFormField>

            <VFormField v-slot="{ componentField }" name="responsesModel">
              <VFormItem>
                <VFormLabel>Responses Model</VFormLabel>
                <VFormControl>
                  <VInput type="text" placeholder="Responses model" v-bind="componentField" />
                </VFormControl>
                <VFormMessage />
              </VFormItem>
            </VFormField>
          </div>
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
import { Loader2 } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { createPresetRequest } from "~/types/preset/CreatePreset";
import usePresetStore from "~/composables/stores/usePresetStore";

const props = defineProps<{
  open: boolean;
}>();

const emits = defineEmits<{
  (e: "close", change: boolean): void;
}>();

const { createPreset } = usePresetStore();
const { execute, success, message, loading } = useApiRef(createPreset);

const form = useForm({
  validationSchema: toTypedSchema(createPresetRequest),
  initialValues: {
    name: "",
    chunkSplitSize: 1000,
    chunkSplitOverlap: 50,
    topK: 5,
    topN: 3,
    minSimilarityScore: 0.2,
    maxResponseTokens: 1024,
    rerankModel: "",
    responsesModel: "",
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
