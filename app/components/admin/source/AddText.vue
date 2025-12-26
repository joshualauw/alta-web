<template>
  <VDialog :open="open" @update:open="emits('close', false)">
    <VDialogContent>
      <form @submit="onSubmit">
        <VDialogHeader>
          <VDialogTitle>Add Source</VDialogTitle>
        </VDialogHeader>

        <div class="h-80 overflow-y-auto space-y-4 p-2 my-4">
          <VFormField v-slot="{ componentField }" name="name">
            <VFormItem>
              <VFormLabel>Name</VFormLabel>
              <VFormControl>
                <VInput type="text" placeholder="Name" v-bind="componentField" />
              </VFormControl>
              <VFormMessage />
            </VFormItem>
          </VFormField>

          <VFormField v-slot="{ componentField }" name="content">
            <VFormItem>
              <VFormLabel>Content</VFormLabel>
              <VTextarea placeholder="This is your source content" class="w-full h-40" v-bind="componentField" />
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

          <VFormField v-slot="{ componentField }" name="presetId">
            <VFormItem>
              <VFormLabel>Preset</VFormLabel>
              <div class="flex items-center gap-2">
                <VSelect v-bind="componentField" v-model="selectedPreset">
                  <VFormControl>
                    <VSelectTrigger class="w-full">
                      <VSelectValue placeholder="Select a preset" />
                    </VSelectTrigger>
                  </VFormControl>
                  <VSelectContent>
                    <VSelectItem :value="null">-no preset-</VSelectItem>
                    <VSelectItem v-for="p in selectablePresets" :value="p.id">{{ p.name }}</VSelectItem>
                  </VSelectContent>
                </VSelect>

                <VPopover @update:open="handlePresetOpened">
                  <VPopoverTrigger as-child>
                    <VButton variant="ghost" size="icon" class="h-8 w-8">
                      <Info class="size-4 text-muted-foreground" />
                    </VButton>
                  </VPopoverTrigger>
                  <VPopoverContent class="w-72">
                    <div v-if="presetDetail">
                      <div class="font-semibold">{{ presetDetail.name }}</div>
                      <div class="text-xs text-muted-foreground">Code: {{ presetDetail.code }}</div>
                      <div class="text-sm mt-2">Chunk Size: {{ presetDetail.chunkSplitSize }}</div>
                      <div class="text-sm">Top K: {{ presetDetail.topK }}, Top N: {{ presetDetail.topN }}</div>
                      <div class="text-sm">Min Similarity: {{ presetDetail.minSimilarityScore }}</div>
                      <div class="text-sm">Max Tokens: {{ presetDetail.maxResponseTokens }}</div>
                      <div class="text-sm">Rerank Model: {{ presetDetail.rerankModel }}</div>
                      <div class="text-sm">Responses Model: {{ presetDetail.responsesModel }}</div>
                    </div>
                    <div v-else class="text-sm text-muted-foreground">No preset selected</div>
                  </VPopoverContent>
                </VPopover>
              </div>
              <VFormMessage />
            </VFormItem>
          </VFormField>

          <div class="mt-4">
            <div class="w-full flex items-center justify-between mb-2">
              <VLabel>Metadata</VLabel>
              <div class="flex items-center gap-x-2">
                <VTooltipProvider>
                  <VTooltip>
                    <VTooltipTrigger as-child>
                      <CircleQuestionMarkIcon class="size-4 text-muted-foreground" />
                    </VTooltipTrigger>
                    <VTooltipContent>
                      <p>for array values, use comma separated values (ex: blue, red, green)</p>
                    </VTooltipContent>
                  </VTooltip>
                </VTooltipProvider>
                <VButton type="button" @click="addMetadataPayload" size="sm" variant="secondary">+ Add</VButton>
              </div>
            </div>
          </div>
          <p v-if="selectedMetadata.length == 0" class="text-sm text-center text-neutral-500">
            -click add to insert metadata-
          </p>
          <div v-for="(meta, index) in selectedMetadata" :key="index" class="w-full flex items-center gap-x-2 mb-2">
            <VInput v-model="meta.name" placeholder="Field name" />
            <VInput v-model="meta.value" placeholder="value" />
            <VButton type="button" @click="removeMetadataPayload(index)" size="icon-sm" variant="ghost">
              <XIcon />
            </VButton>
          </div>
        </div>

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
import { CircleQuestionMarkIcon, Loader2Icon, XIcon, Info } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import type { GetAllGroupResponse } from "~/types/group/GetAllGroup";
import type { GetAllPresetResponse } from "~/types/preset/GetAllPreset";
import type { GetPresetDetailResponse } from "~/types/preset/GetPresetDetail";
import { createSourceRequest } from "~/types/source/CreateSource";
import type { MetadataPayload } from "~/types/ui/MetadataPayload";

const props = defineProps<{
  open: boolean;
}>();

const emits = defineEmits<{
  (e: "close", change: boolean): void;
}>();

const { getAllGroup } = useGroupStore();
const { getAllPreset, getPresetDetail } = usePresetStore();
const { createSource } = useSourceStore();
const { execute, success, message, loading } = useApiRef(createSource);

const selectableGroups = ref<GetAllGroupResponse[]>([]);
const selectablePresets = ref<GetAllPresetResponse[]>([]);
const selectedPreset = ref<number | null>(null);
const presetDetail = ref<GetPresetDetailResponse | null>(null);
const selectedMetadata = ref<MetadataPayload[]>([]);

watch(props, async (val) => {
  if (val.open) {
    const getAllGroupHandler = useApi(getAllGroup);
    const res = await getAllGroupHandler();
    if (res.success && res.data) {
      selectableGroups.value = res.data.items;
    }

    const getAllPresetHandler = useApi(getAllPreset);
    const pr = await getAllPresetHandler();
    if (pr.success && pr.data) {
      selectablePresets.value = pr.data.items;
    }
  }
});

async function handlePresetOpened() {
  if (selectedPreset.value != null) {
    const getPresetDetailHandler = useApi(getPresetDetail);
    const res = await getPresetDetailHandler(selectedPreset.value);
    if (res.success && res.data) {
      presetDetail.value = res.data;
    }
  } else {
    presetDetail.value = null;
  }
}

const form = useForm({
  validationSchema: toTypedSchema(createSourceRequest),
  initialValues: {
    name: "",
    content: "",
  },
});

function addMetadataPayload() {
  selectedMetadata.value.push({
    name: "",
    value: null,
  });
}

function removeMetadataPayload(index: number) {
  selectedMetadata.value.splice(index, 1);
}

function metadataToObject(data: MetadataPayload[]) {
  function getObjectValue(value: string | number | boolean): string[] | string | number | boolean {
    if (typeof value === "string" && value.includes(",")) {
      return value.split(",");
    }
    return value;
  }

  return data.reduce((acc: Record<string, any>, item) => {
    acc[item.name] = getObjectValue(item.value);
    return acc;
  }, {});
}

const onSubmit = form.handleSubmit(async (values) => {
  const metadata = metadataToObject(selectedMetadata.value);
  let preset = undefined;
  if (selectedPreset.value != null) {
    preset = selectablePresets.value.find((p) => p.id === selectedPreset.value)?.code;
  }

  await execute({ ...values, metadata }, preset);
  if (success.value) {
    toast.success(message.value);
    emits("close", true);
  } else {
    toast.error(message.value);
  }
});
</script>
