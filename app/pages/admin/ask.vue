<template>ask</template>

<script setup lang="ts">
import { RouteKey } from "~/const/RouteKey";

definePageMeta({
  name: RouteKey.ADMIN_ASK,
  layout: "admin",
  middleware: ["auth"],
});
</script>
