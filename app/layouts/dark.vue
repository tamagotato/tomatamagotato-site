<template>
  <div>
    <SiteNav />
    <main>
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
// The theme class lives on <html>, set pre-paint by the inline script in
// nuxt.config.ts and kept in sync by useTheme(). No wrapper class here, or the
// SSR-rendered value would override it and cause a flash.
const { init } = useTheme()
onMounted(init)
</script>
