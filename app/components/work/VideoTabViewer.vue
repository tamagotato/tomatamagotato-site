<template>
  <div class="video-tab-viewer">
    <div class="video-tabs">
      <button
        v-for="(clip, i) in clips"
        :key="clip.label"
        type="button"
        :aria-pressed="i === activeIndex"
        class="video-tab"
        :class="{ 'is-active': i === activeIndex, 'is-pending': i === pendingIndex }"
        @click="selectClip(i)"
      >
        {{ clip.label }}
      </button>
    </div>

    <template v-if="activeClip">
      <div class="video-frame">
        <Transition name="clip-fade" mode="out-in">
          <div v-if="isBuffering" key="buffering" class="video-buffering">
            <span class="buffering-spinner" aria-hidden="true" />
            <span class="buffering-text">Loading &ldquo;{{ pendingClip?.label }}&rdquo;&hellip;</span>
          </div>
          <video
            v-else
            ref="videoEl"
            :key="activeClip.src"
            :src="activeClip.src"
            :autoplay="!prefersReducedMotion"
            :loop="!prefersReducedMotion"
            :controls="prefersReducedMotion"
            muted
            playsinline
          />
        </Transition>
      </div>

      <Transition name="clip-fade" mode="out-in">
        <p class="video-caption" :key="activeClip.caption">{{ activeClip.caption }}</p>
      </Transition>
    </template>
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
const activeClip = computed(() => props.clips[activeIndex.value] ?? props.clips[0])

const videoEl = ref<HTMLVideoElement | null>(null)
const prefersReducedMotion = ref(false)
const isBuffering = ref(false)
const pendingIndex = ref<number | null>(null)
const pendingClip = computed(() => pendingIndex.value === null ? null : props.clips[pendingIndex.value])

let bufferTimeout: ReturnType<typeof setTimeout> | undefined

function selectClip(i: number) {
  if (i === activeIndex.value) return

  if (prefersReducedMotion.value) {
    activeIndex.value = i
    return
  }

  clearTimeout(bufferTimeout)
  isBuffering.value = true
  pendingIndex.value = i
  const delay = 50 + Math.random() * 950

  bufferTimeout = setTimeout(() => {
    activeIndex.value = i
    isBuffering.value = false
    pendingIndex.value = null
  }, delay)
}

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

onUnmounted(() => {
  clearTimeout(bufferTimeout)
})
</script>

<style scoped>
.video-tabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.video-tabs::-webkit-scrollbar {
  display: none;
}

.video-tab {
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 10px 18px 9px;
  border: 2px solid #1a1a1a;
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  background: #ece7db;
  color: #6a6458;
  cursor: pointer;
  position: relative;
  margin-right: -2px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 150ms ease, color 150ms ease;
}

.video-tab:last-child {
  margin-right: 0;
}

.video-tab:hover:not(.is-active) {
  background: #f5f2ea;
  color: #1a1a1a;
}

.video-tab:focus-visible {
  outline: 2px solid #3ec6f0;
  outline-offset: 2px;
  z-index: 2;
}

.video-tab.is-active {
  background: #fbf9f4;
  color: #1a1a1a;
  z-index: 1;
  /* Overlaps the video-frame's top border so the active tab reads as one
     continuous shape with the frame below it, like a folder tab. */
  margin-bottom: -2px;
  padding-bottom: 11px;
}

.video-tab.is-pending:not(.is-active) {
  color: #1a1a1a;
  background: #d8e9f0;
}

.video-frame {
  position: relative;
  border: 2px solid #1a1a1a;
  border-radius: 0 14px 14px 14px;
  box-shadow: 5px 5px 0 #1a1a1a;
  overflow: hidden;
  background: #000;
  z-index: 0;
}

.video-frame video {
  display: block;
  width: 100%;
  height: auto;
}

.video-buffering {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  aspect-ratio: 16 / 9;
  padding: 24px;
  text-align: center;
}

.buffering-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(240, 236, 228, 0.25);
  border-top-color: #3ec6f0;
  border-radius: 50%;
  animation: buffering-spin 800ms linear infinite;
}

.buffering-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: #f0ece4;
}

@keyframes buffering-spin {
  to { transform: rotate(360deg); }
}

.video-caption {
  font-size: 0.93rem;
  color: #4a4a4a;
  line-height: 1.6;
  margin-top: 16px;
}

.clip-fade-enter-active,
.clip-fade-leave-active {
  transition: opacity 200ms ease;
}

.clip-fade-enter-from,
.clip-fade-leave-to {
  opacity: 0;
}

:global(.theme-dark) .video-tab {
  background: #17171a;
  border-color: #3a3a3a;
  color: #7a746a;
}

:global(.theme-dark) .video-tab:hover:not(.is-active) {
  background: #1f1f22;
  color: #f0ece4;
}

:global(.theme-dark) .video-tab.is-active {
  background: #0f0f0f;
  color: #f0ece4;
  border-color: #3a3a3a;
}

:global(.theme-dark) .video-tab.is-pending:not(.is-active) {
  background: #1c3540;
  color: #f0ece4;
}

:global(.theme-dark) .video-frame {
  border-color: #3a3a3a;
  box-shadow: 5px 5px 0 #000;
}

:global(.theme-dark) .video-caption {
  color: #a9a29a;
}
</style>
