<template>preset</template>

<script setup lang="ts">
import { RouteKey } from "~/const/RouteKey";

definePageMeta({
  name: RouteKey.ADMIN_PRESET,
  layout: "admin",
  middleware: ["auth"],
});
</script>
