<template>
  <button class="theme-toggle" @click="toggle" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
    <svg class="toggle-icon" :class="{ 'is-dark': isDark }" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <!-- Sun core doubles as the moon disc; the mask slides in to carve the crescent. -->
      <mask id="moon-mask">
        <rect x="0" y="0" width="24" height="24" fill="white" />
        <circle class="mask-circle" cx="24" cy="10" r="6" fill="black" />
      </mask>
      <circle class="icon-core" cx="12" cy="12" r="5" mask="url(#moon-mask)" />
      <g class="icon-rays" stroke-linecap="round">
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
        <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
        <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
      </g>
    </svg>
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
  color: inherit;
  transition: border-color 150ms ease;
}

.theme-toggle:hover {
  border-color: rgba(128, 128, 128, 0.6);
}

.icon-core {
  fill: currentColor;
}

.icon-rays {
  stroke: currentColor;
  stroke-width: 1.6;
  transform-origin: center;
  transition: opacity 150ms ease, transform 150ms ease;
}

.mask-circle {
  transition: transform 150ms ease;
}

/* Dark mode: rays retract into the disc, mask slides over to cut a crescent.
   Keyed off the component's own state, not an ancestor class, because the
   theme class lives on <html> and scoped styles cannot reach it. */
.is-dark .icon-rays {
  opacity: 0;
  transform: scale(0.6);
}

.is-dark .mask-circle {
  transform: translate(-8px, 1px);
}

@media (prefers-reduced-motion: reduce) {
  .icon-rays,
  .mask-circle {
    transition-duration: 0ms;
  }
}
</style>
