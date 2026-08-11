<template>
  <div class="video-tab-viewer">
    <div class="video-tabs" role="tablist">
      <button
        v-for="(clip, i) in clips"
        :key="clip.label"
        type="button"
        role="tab"
        :aria-selected="i === activeIndex"
        class="video-tab"
        :class="{ 'is-active': i === activeIndex }"
        @click="activeIndex = i"
      >
        {{ clip.label }}
      </button>
    </div>

    <p class="video-caption">{{ activeClip.caption }}</p>

    <div class="video-frame">
      <video
        :key="activeClip.src"
        :src="activeClip.src"
        autoplay
        loop
        muted
        playsinline
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Clip {
  label: string
  caption: string
  src: string
}

const props = defineProps<{ clips: Clip[] }>()

const activeIndex = ref(0)
const activeClip = computed(() => props.clips[activeIndex.value])
</script>

<style scoped>
.video-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.video-tab {
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 20px;
  border: 2px solid #1a1a1a;
  background: #fbf9f4;
  color: #1a1a1a;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}

.video-tab.is-active {
  background: #3ec6f0;
}

.video-caption {
  font-size: 0.93rem;
  color: #4a4a4a;
  line-height: 1.6;
  margin-bottom: 16px;
}

.video-frame {
  border: 2px solid #1a1a1a;
  border-radius: 14px;
  box-shadow: 5px 5px 0 #1a1a1a;
  overflow: hidden;
  background: #000;
}

.video-frame video {
  display: block;
  width: 100%;
  height: auto;
}

:global(.theme-dark) .video-tab {
  background: #17171a;
  border-color: #3a3a3a;
  color: #f0ece4;
}

:global(.theme-dark) .video-tab.is-active {
  background: #3ec6f0;
  color: #0f0f0f;
  border-color: #0f0f0f;
}

:global(.theme-dark) .video-caption {
  color: #a9a29a;
}

:global(.theme-dark) .video-frame {
  border-color: #3a3a3a;
  box-shadow: 5px 5px 0 #000;
}
</style>
