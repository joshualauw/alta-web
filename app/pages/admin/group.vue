<template>group</template>

<script setup lang="ts">
import { RouteKey } from "~/const/RouteKey";

definePageMeta({
  name: RouteKey.ADMIN_GROUP,
  layout: "admin",
  middleware: ["auth"],
});
</script>
