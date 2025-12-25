<template>
  <VPopover v-model:open="open">
    <VPopoverTrigger as-child>
      <VButton size="icon" variant="outline" class="relative">
        <FilterIcon />
        <VBadge
          v-if="isFilter"
          class="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 font-mono tabular-nums"
          variant="destructive"
        >
          {{ totalActiveFilter }}
        </VBadge>
      </VButton>
    </VPopoverTrigger>
    <VPopoverContent class="w-100 mt-2">
      <VSelect v-model="selectedGroup">
        <VLabel>Filter by Group</VLabel>
        <VSelectTrigger class="w-full mt-2">
          <VSelectValue placeholder="Select a group" />
        </VSelectTrigger>
        <VSelectContent>
          <VSelectItem :value="null">All</VSelectItem>
          <VSelectItem v-for="group in selectableGroups" :value="group.id">
            {{ group.name }}
          </VSelectItem>
        </VSelectContent>
      </VSelect>

      <div class="mt-4">
        <div class="w-full flex items-center justify-between mb-2">
          <VLabel>Filter by Metadata</VLabel>
          <div class="flex items-center gap-x-2">
            <VTooltipProvider>
              <VTooltip>
                <VTooltipTrigger as-child>
                  <CircleQuestionMarkIcon class="size-4 text-muted-foreground" />
                </VTooltipTrigger>
                <VTooltipContent>
                  <p>for array operations, use comma separated values (ex: blue, red, green)</p>
                </VTooltipContent>
              </VTooltip>
            </VTooltipProvider>
            <VButton @click="addMetadataFilter" size="sm" variant="secondary">+ Add</VButton>
          </div>
        </div>
        <p class="text-sm text-center text-neutral-500" v-if="selectedFilters.length == 0">
          -click add to insert metadata filter-
        </p>
        <div v-for="(filter, index) in selectedFilters" :key="index" class="w-full flex items-center gap-x-2 mb-2">
          <VInput v-model="filter.name" placeholder="Field name" />
          <VSelect v-model="filter.operator">
            <VSelectTrigger>
              <VSelectValue placeholder="Select a Filter" />
            </VSelectTrigger>
            <VSelectContent>
              <VSelectItem v-for="filter in availableFilters" :value="filter.code">
                {{ filter.label }}
              </VSelectItem>
            </VSelectContent>
          </VSelect>
          <VInput v-model="filter.value" placeholder="value" />
          <VButton @click="removeMetadataFilter(index)" size="icon-sm" variant="ghost">
            <XIcon />
          </VButton>
        </div>
      </div>

      <div class="flex items-center gap-x-2 mt-4 w-full">
        <VButton @click="clearFilter" variant="ghost" size="sm" class="w-1/2"> Clear All </VButton>
        <VButton @click="applyFilter" size="sm" class="w-1/2">Apply Filter</VButton>
      </div>
    </VPopoverContent>
  </VPopover>
</template>

<script setup lang="ts">
import { CircleQuestionMarkIcon, FilterIcon, XIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { GetAllGroupResponse } from "~/types/group/GetAllGroup";
import type { FilterSourceResponse } from "~/types/source/FilterSource";
import type { MetadataFilter, MetadataFilterOperator } from "~/types/ui/MetadataFilter";

defineProps<{
  isFilter: boolean;
}>();

const emits = defineEmits<{
  (e: "applied", payload: FilterSourceResponse[]): void;
  (e: "cleared"): void;
}>();

const { getAllGroup } = useGroupStore();
const { filterSource } = useSourceStore();

const selectableGroups = ref<GetAllGroupResponse[]>([]);
const selectedGroup = ref<number | null>(null);
const selectedFilters = ref<MetadataFilter[]>([]);

const open = ref(false);

const totalActiveFilter = computed(() => {
  let total = 0;
  if (selectedGroup.value != null) total++;
  if (selectedFilters.value.length > 0) total++;
  return total;
});

const availableFilters: { code: string; label: string }[] = [
  { code: "$eq", label: "is" },
  { code: "$ne", label: "is not" },
  { code: "$gt", label: "greater than" },
  { code: "$gte", label: "greater than equal" },
  { code: "$lt", label: "lower than" },
  { code: "$lte", label: "lower than equal" },
  { code: "$in", label: "in" },
  { code: "$nin", label: "not in" },
];

watch(open, async (val) => {
  if (val) {
    const res = await getAllGroup();
    if (res.success && res.data) {
      selectableGroups.value = res.data.items;
    }
  }
});

function addMetadataFilter() {
  selectedFilters.value.push({
    name: "",
    operator: "$eq",
    value: null,
  });
}

function removeMetadataFilter(index: number) {
  selectedFilters.value.splice(index, 1);
}

function clearFilter() {
  selectedGroup.value = null;
  selectedFilters.value = [];
  emits("cleared");
}

async function applyFilter() {
  const filter = selectedFilters.value.length > 0 ? filtersToObject(selectedFilters.value) : undefined;
  const groupId = selectedGroup.value != null ? selectedGroup.value : undefined;

  const filterSourceHandler = useApi(filterSource);
  const res = await filterSourceHandler(filter, groupId);
  if (res.success && res.data) {
    emits("applied", res.data);
  } else {
    toast.error(res.message);
  }
}

function filtersToObject(filters: MetadataFilter[]) {
  function getObjectValue(
    operator: MetadataFilterOperator,
    value: string | number | boolean
  ): string[] | string | number | boolean {
    if (typeof value == "string" && (operator == "$in" || operator == "$nin")) {
      return value.split(",");
    }
    if (typeof value == "string" && !isNaN(Number(value))) {
      return Number(value);
    }
    return value;
  }

  return filters.reduce<Record<string, Record<string, unknown>>>((acc, { name, operator, value }) => {
    acc[name] = { [operator]: getObjectValue(operator, value) };
    return acc;
  }, {});
}
</script>
