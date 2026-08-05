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
// Theme class lives on <html>; see dark.vue for why it is not set here.
const { init } = useTheme()
onMounted(init)
</script>
