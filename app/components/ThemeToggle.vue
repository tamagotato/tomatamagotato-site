<template>
  <button class="theme-toggle" @click="toggle" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
    <span class="toggle-icon">{{ isDark ? '☀️' : '🌙' }}</span>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggle } = useTheme()
</script>

<style scoped>
.theme-toggle {
  background: none;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
}

.theme-toggle:hover {
  transform: scale(1.1);
  border-color: rgba(128, 128, 128, 0.6);
}

.toggle-icon {
  font-size: 1.1rem;
  line-height: 1;
}
</style>
