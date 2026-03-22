<template>
  <div :class="themeClass">
    <SiteNav />
    <main>
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const { themeClass, init } = useTheme()
onMounted(init)
</script>
