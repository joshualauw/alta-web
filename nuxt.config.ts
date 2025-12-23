import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["shadcn-nuxt"],
  shadcn: {
    prefix: "V",
    componentDir: "@/components/ui",
  },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  imports: {
    dirs: ["composables/**"],
  },
  runtimeConfig: {
    public: {
      baseUrl: "http://localhost:3000",
      apiUrl: "http://localhost:3001",
    },
  },
});
