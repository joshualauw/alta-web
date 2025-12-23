<template>
  <NuxtLayout name="default">
    <VSidebarProvider>
      <AdminSidebar />
      <VSidebarTrigger />
      <main class="px-4 py-8 w-full">
        <slot />
      </main>
    </VSidebarProvider>
  </NuxtLayout>
</template>
