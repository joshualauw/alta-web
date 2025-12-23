<template>
  {{ currentUser?.email }}
</template>

<script setup lang="ts">
import { RouteKey } from "~/const/RouteKey";

definePageMeta({
  name: RouteKey.ADMIN_DASHBOARD,
  layout: "admin",
  middleware: ["auth"],
});

const { currentUser } = useUserStore();
</script>
