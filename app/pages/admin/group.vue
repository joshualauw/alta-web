<template>
  <div class="space-y-6">
    <div class="max-w-full flex justify-between items-center">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight">Groups</h1>
        </div>
        <p class="text-muted-foreground">Keep your documents organized</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="text-sm font-semibold mr-2">{{ groupCount }} Record(s)</div>
        <VButton variant="outline" size="icon" @click="refresh" :disabled="pending" title="Refresh sources">
          <RefreshCcw :class="['h-4 w-4', pending ? 'animate-spin' : '']" />
        </VButton>
        <VButton @click="addModalOpen = true" class="bg-primary text-primary-foreground">
          <Plus class="h-4 w-4" />
          Add Group
        </VButton>
      </div>
    </div>

    <div
      v-if="(groups?.data?.items ?? []).length === 0"
      class="flex min-h-100 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in zoom-in duration-300"
    >
      <VEmpty>
        <VEmptyHeader>
          <VEmptyMedia variant="icon">
            <Tag class="h-10 w-10 text-muted-foreground" />
          </VEmptyMedia>
          <VEmptyTitle>No Groups</VEmptyTitle>
          <VEmptyDescription> You haven't added any groups yet </VEmptyDescription>
        </VEmptyHeader>
        <VEmptyContent>
          <VButton @click="addModalOpen = true" class="gap-2">
            <Plus class="h-4 w-4" />
            Add your first group
          </VButton>
        </VEmptyContent>
      </VEmpty>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="group in groups?.data?.items ?? []"
        :key="group.id"
        class="rounded-xl border bg-card p-5 hover:border-border/80 transition-colors duration-200"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary/5">
              <Tag class="size-4 text-primary" />
            </div>
            <div>
              <h4 class="font-semibold text-sm text-foreground line-clamp-1">
                {{ group.name }}
              </h4>
              <p class="text-xs text-muted-foreground mt-0.5">ID: {{ group.id }}</p>
            </div>
          </div>

          <VDropdownMenu>
            <VDropdownMenuTrigger as-child>
              <VButton variant="ghost" size="icon" class="h-7 w-7">
                <MoreHorizontal class="size-4" />
              </VButton>
            </VDropdownMenuTrigger>
            <VDropdownMenuContent align="end" class="w-40">
              <VDropdownMenuItem @click="handleGetGroupDetail(group.id, 'edit')" class="text-sm">
                <Edit class="mr-1 size-3.5" />
                Edit
              </VDropdownMenuItem>
              <VDropdownMenuSeparator />
              <VDropdownMenuItem @click="handleGetGroupDetail(group.id, 'delete')" class="text-sm text-destructive">
                <Trash2 class="mr-1 size-3.5" />
                Delete
              </VDropdownMenuItem>
            </VDropdownMenuContent>
          </VDropdownMenu>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground">Color Code</span>
            <div class="text-sm font-medium text-foreground flex items-center">
              <div class="w-4 h-4 rounded-full border mr-1" :style="{ backgroundColor: group.colorCode }"></div>
              {{ group.colorCode }}
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground">Created</span>
            <div class="text-right">
              <div class="text-sm font-medium text-foreground">
                {{ dayjs(group.createdAt).format("MMM DD, YYYY") }}
              </div>
              <div class="text-xs text-muted-foreground">
                {{ dayjs(group.createdAt).format("HH:mm") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AdminGroupAdd @close="handleGroupChanged($event, 'add')" :open="addModalOpen" />
    <AdminGroupEdit @close="handleGroupChanged($event, 'edit')" :open="editModalOpen" :group="groupDetail" />
    <AdminGroupDelete @close="handleGroupChanged($event, 'delete')" :open="deleteModalOpen" :group="groupDetail" />
  </div>
</template>

<script setup lang="ts">
import { Edit, MoreHorizontal, Plus, RefreshCcw, Tag, Trash2 } from "lucide-vue-next";
import { RouteKey } from "~/const/RouteKey";
import dayjs from "dayjs";
import type { GetGroupDetailResponse } from "~/types/group/GetGroupDetail";

definePageMeta({
  name: RouteKey.ADMIN_GROUP,
  layout: "admin",
  middleware: ["auth"],
});

const groupDetail = ref<GetGroupDetailResponse | null>(null);

const editModalOpen = ref(false);
const deleteModalOpen = ref(false);
const addModalOpen = ref(false);

const { getAllGroup, getGroupDetail } = useGroupStore();
const { data: groups, pending, refresh } = await useAsyncData(() => getAllGroup());

const groupCount = computed(() => (groups.value?.data?.items ?? []).length);

async function handleGroupChanged(change: boolean, modal: "add" | "edit" | "delete") {
  if (modal === "add") {
    addModalOpen.value = false;
  } else if (modal === "edit") {
    editModalOpen.value = false;
  } else if (modal === "delete") {
    deleteModalOpen.value = false;
  }

  if (change) {
    await refresh();
  }
}

async function handleGetGroupDetail(groupId: number, modal: "detail" | "edit" | "delete") {
  const res = await getGroupDetail(groupId);

  if (res.success && res.data) {
    groupDetail.value = res.data;

    if (modal == "edit") {
      editModalOpen.value = true;
    } else {
      deleteModalOpen.value = true;
    }
  }
}
</script>
