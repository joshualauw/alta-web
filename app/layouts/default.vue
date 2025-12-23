<template>
  <div class="w-screen h-screen bg-slate-50">
    <slot />
    <Toaster rich-colors />
  </div>
</template>

<script setup lang="ts">
import "vue-sonner/style.css";
import { Toaster } from "@/components/ui/sonner";
</script>
