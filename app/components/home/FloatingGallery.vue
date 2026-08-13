<!-- app/components/home/FloatingGallery.vue -->
<template>
  <div
    ref="containerEl"
    class="floating-gallery"
    :class="{ 'reduce-motion': reduceMotion }"
    @mousemove="onContainerMouseMove"
    @mouseleave="onContainerMouseLeave"
  >
    <div
      v-for="(img, i) in images"
      :key="img.alt"
      ref="tileEls"
      class="floating-tile"
      :class="{ grabbed: grabbedIndex === i, loaded: loadedFlags[i] }"
      @mousedown="onGrabStart(i, $event)"
      @touchstart="onGrabStart(i, $event)"
    >
      <img :src="img.src" :alt="img.alt" draggable="false" @load="onTileLoaded(i)">
    </div>

    <Transition name="inspect-fade">
      <div v-if="inspectImage" class="inspect-overlay" @click="closeInspect">
        <button class="inspect-close" type="button" aria-label="Close" @click.stop="closeInspect">✕</button>
        <img class="inspect-image" :src="inspectImage.src" :alt="inspectImage.alt" @click.stop>
      </div>
    </Transition>

    <button
      v-if="showTiltPrompt"
      class="tilt-enable"
      type="button"
      aria-label="Enable tilt and shake motion"
      @click="enableTilt"
    >
      ↺ Motion
    </button>

    <div v-if="debugMotion" class="motion-debug">{{ debugMotion }}</div>
  </div>
</template>

<script setup lang="ts">
interface ImageItem {
  src: string
  alt: string
}

interface Tile {
  x: number
  y: number
  vx: number
  vy: number
  dirX: number
  dirY: number
  rot: number
  vrot: number
  w: number
  h: number
  z: number
}

const props = defineProps<{ images: ImageItem[] }>()

const containerEl = ref<HTMLElement | null>(null)
const tileEls = ref<HTMLElement[]>([])

const grabbedIndex = ref<number | null>(null)
const reduceMotion = ref(false)
const inspectImage = ref<ImageItem | null>(null)
const showTiltPrompt = ref(false)
const loadedFlags = ref<boolean[]>(props.images.map(() => false))
const debugMotion = ref('')

function onTileLoaded(i: number) {
  // Randomized delay instead of an instant flip — reveals land scattered
  // across the gallery rather than a mechanical top-to-bottom/DOM-order sweep.
  setTimeout(() => {
    loadedFlags.value[i] = true
  }, Math.random() * 400)
}

let tiles: Tile[] = []
let rafId = 0
let containerWidth = 0
let containerHeight = 0
let containerRectLeft = 0
let containerRectTop = 0

let pointerX = -1000
let pointerY = -1000
let prevPointerX = -1000
let prevPointerY = -1000

let grabOffsetX = 0
let grabOffsetY = 0
let grabPrevX = 0
let grabPrevY = 0
let grabVx = 0
let grabVy = 0
let grabStartX = 0
let grabStartY = 0
let grabStartTime = 0
let topZ = 1

const CLICK_MAX_MOVE = 6
const CLICK_MAX_DURATION = 300

const SPEED = 0.12
const ROT_SPEED = 0.015
const TILE_SIZE = 130
const PUSH_RADIUS = 80
const PUSH_STRENGTH = 0.05
const SETTLE_RATE = 0.006
const BOUNCE_SPIN_FACTOR = 1.2
const GRAB_SPIN_STOP_MS = 5000

// How fast a tile's ambient drift direction steers toward the tilt vector,
// and how far a phone must tilt (degrees) before it's treated as "downhill".
const TILT_STEER_RATE = 0.02
const TILT_DEADZONE_DEG = 4
const TILT_MAX_DEG = 30

let tiltX = 0
let tiltY = 0
let hasTiltSignal = false

// Shake detection: a spike in acceleration magnitude above SHAKE_THRESHOLD,
// with a cooldown so one shake gesture doesn't retrigger every frame.
const SHAKE_THRESHOLD = 22
const SHAKE_COOLDOWN_MS = 1000
const SHAKE_STOP_DURATION_MS = 900
let lastAccel = { x: 0, y: 0, z: 0 }
let lastShakeTime = 0
let shakeStopUntil = 0

function updateContainerRect() {
  if (!containerEl.value) return
  const rect = containerEl.value.getBoundingClientRect()
  containerRectLeft = rect.left
  containerRectTop = rect.top
}

function onContainerMouseMove(e: MouseEvent) {
  prevPointerX = pointerX
  prevPointerY = pointerY
  pointerX = e.clientX - containerRectLeft
  pointerY = e.clientY - containerRectTop
}

function onContainerMouseLeave() {
  pointerX = -1000
  pointerY = -1000
  prevPointerX = -1000
  prevPointerY = -1000
}

function pointFromEvent(e: MouseEvent | TouchEvent): { x: number, y: number } | null {
  if ('touches' in e) {
    const touch = e.touches[0] ?? e.changedTouches[0]
    if (!touch) return null
    return { x: touch.clientX, y: touch.clientY }
  }
  return { x: e.clientX, y: e.clientY }
}

function onGrabStart(i: number, e: MouseEvent | TouchEvent) {
  if (inspectImage.value) return
  const point = pointFromEvent(e)
  if (!point) return
  e.preventDefault()
  const t = tiles[i]
  if (!t) return
  updateContainerRect()
  grabbedIndex.value = i
  // Grabbing brings a tile to front and keeps it there after release, so it
  // doesn't get buried behind other tiles again once dropped.
  topZ += 1
  t.z = topZ
  const grabbedEl = tileEls.value[i]
  if (grabbedEl) grabbedEl.style.zIndex = String(t.z)
  const px = point.x - containerRectLeft
  const py = point.y - containerRectTop
  grabOffsetX = px - t.x
  grabOffsetY = py - t.y
  grabPrevX = px
  grabPrevY = py
  grabVx = 0
  grabVy = 0
  grabStartX = point.x
  grabStartY = point.y
  grabStartTime = performance.now()
  window.addEventListener('mousemove', onGrabMove)
  window.addEventListener('mouseup', onGrabEnd)
  window.addEventListener('touchmove', onGrabMove, { passive: false })
  window.addEventListener('touchend', onGrabEnd)
  window.addEventListener('touchcancel', onGrabEnd)
}

function onGrabMove(e: MouseEvent | TouchEvent) {
  if (grabbedIndex.value === null) return
  const t = tiles[grabbedIndex.value]
  if (!t) return
  const point = pointFromEvent(e)
  if (!point) return
  e.preventDefault()
  const px = point.x - containerRectLeft
  const py = point.y - containerRectTop

  t.x = Math.min(Math.max(px - grabOffsetX, 0), containerWidth - t.w)
  t.y = Math.min(Math.max(py - grabOffsetY, 0), containerHeight - t.h)

  grabVx = px - grabPrevX
  grabVy = py - grabPrevY
  grabPrevX = px
  grabPrevY = py
}

function onGrabEnd(e: MouseEvent | TouchEvent) {
  const wasIndex = grabbedIndex.value
  const point = pointFromEvent(e)
  if (wasIndex !== null && point) {
    const t = tiles[wasIndex]
    const moved = Math.hypot(point.x - grabStartX, point.y - grabStartY)
    const duration = performance.now() - grabStartTime
    const isClick = moved <= CLICK_MAX_MOVE && duration <= CLICK_MAX_DURATION

    if (isClick) {
      inspectImage.value = props.images[wasIndex] ?? null
    } else if (t) {
      t.vx = grabVx
      t.vy = grabVy
      const throwSpeed = Math.sqrt(grabVx * grabVx + grabVy * grabVy)
      if (throwSpeed > 0.01) {
        // The throw's direction becomes the tile's new resting drift direction;
        // SETTLE_RATE will decay its speed down to the ambient SPEED over time.
        t.dirX = grabVx / throwSpeed
        t.dirY = grabVy / throwSpeed
      }
    }
  }
  grabbedIndex.value = null
  window.removeEventListener('mousemove', onGrabMove)
  window.removeEventListener('mouseup', onGrabEnd)
  window.removeEventListener('touchmove', onGrabMove)
  window.removeEventListener('touchend', onGrabEnd)
  window.removeEventListener('touchcancel', onGrabEnd)
}

function closeInspect() {
  inspectImage.value = null
}

function onDeviceOrientation(e: DeviceOrientationEvent) {
  const beta = e.beta ?? 0 // front-back tilt
  const gamma = e.gamma ?? 0 // left-right tilt

  const clamp = (v: number) => Math.max(-TILT_MAX_DEG, Math.min(TILT_MAX_DEG, v))
  const gx = Math.abs(gamma) < TILT_DEADZONE_DEG ? 0 : clamp(gamma)
  const gy = Math.abs(beta) < TILT_DEADZONE_DEG ? 0 : clamp(beta)

  tiltX = gx / TILT_MAX_DEG
  tiltY = gy / TILT_MAX_DEG
  hasTiltSignal = tiltX !== 0 || tiltY !== 0

  debugMotion.value = `orient: beta=${beta.toFixed(1)} gamma=${gamma.toFixed(1)} | signal=${hasTiltSignal}`
}

function onDeviceMotion(e: DeviceMotionEvent) {
  const a = e.accelerationIncludingGravity
  if (!a || a.x === null || a.y === null || a.z === null) return

  const dx = a.x - lastAccel.x
  const dy = a.y - lastAccel.y
  const dz = a.z - lastAccel.z
  lastAccel = { x: a.x, y: a.y, z: a.z }

  const delta = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const now = performance.now()
  if (delta > SHAKE_THRESHOLD && now - lastShakeTime > SHAKE_COOLDOWN_MS) {
    lastShakeTime = now
    shakeStopUntil = now + SHAKE_STOP_DURATION_MS
  }
  debugMotion.value += ` | motion delta=${delta.toFixed(1)}`
}

function startTiltListening() {
  window.addEventListener('deviceorientation', onDeviceOrientation)
  window.addEventListener('devicemotion', onDeviceMotion)
}

// iOS 13+ requires DeviceOrientationEvent.requestPermission(), which can only
// be called from a user gesture — so we show a tap-to-enable button rather
// than requesting on mount. Android/other browsers don't need this and start
// listening immediately.
function maybeInitTilt() {
  const DOE = window.DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<'granted' | 'denied'>
  }
  if (typeof DOE?.requestPermission === 'function') {
    showTiltPrompt.value = true
    debugMotion.value = 'waiting: needs iOS permission tap'
  } else if ('DeviceOrientationEvent' in window) {
    startTiltListening()
    debugMotion.value = 'listening: no events yet'
  } else {
    debugMotion.value = 'unsupported: no DeviceOrientationEvent in window'
  }
}

async function enableTilt() {
  const DOE = window.DeviceOrientationEvent as unknown as {
    requestPermission: () => Promise<'granted' | 'denied'>
  }
  try {
    const result = await DOE.requestPermission()
    if (result === 'granted') startTiltListening()
  } catch {
    // Permission API unavailable or rejected — leave tilt inactive, mouse/touch still work.
  } finally {
    showTiltPrompt.value = false
  }
}

function layoutInit() {
  if (!containerEl.value) return
  containerWidth = containerEl.value.clientWidth
  containerHeight = containerEl.value.clientHeight
  updateContainerRect()

  tiles = props.images.map(() => {
    const w = TILE_SIZE
    const h = TILE_SIZE
    const angle = Math.random() * Math.PI * 2
    const dirX = Math.cos(angle)
    const dirY = Math.sin(angle)
    return {
      x: Math.random() * Math.max(containerWidth - w, 1),
      y: Math.random() * Math.max(containerHeight - h, 1),
      vx: dirX * SPEED,
      vy: dirY * SPEED,
      dirX,
      dirY,
      rot: (Math.random() - 0.5) * 10,
      vrot: (Math.random() - 0.5) * ROT_SPEED * 2,
      w,
      h,
      z: 1
    }
  })
  topZ = 1
}

function onResize() {
  if (!containerEl.value) return
  containerWidth = containerEl.value.clientWidth
  containerHeight = containerEl.value.clientHeight
  updateContainerRect()
  tiles.forEach((t) => {
    t.x = Math.min(t.x, Math.max(containerWidth - t.w, 0))
    t.y = Math.min(t.y, Math.max(containerHeight - t.h, 0))
  })
}

function tick() {
  const cursorMoving = pointerX > -999 && prevPointerX > -999
  const cursorDx = pointerX - prevPointerX
  const cursorDy = pointerY - prevPointerY

  tiles.forEach((t, i) => {
    if (grabbedIndex.value === i) {
      // Holding a spinning tile gradually kills its spin, but only fully stops it
      // after being held for GRAB_SPIN_STOP_MS — a quick grab barely slows it down.
      const heldMs = performance.now() - grabStartTime
      const stopProgress = Math.min(heldMs / GRAB_SPIN_STOP_MS, 1)
      t.vrot *= 1 - stopProgress * 0.06
      t.rot += t.vrot
      const el = tileEls.value[i]
      if (el) el.style.transform = `translate(${t.x}px, ${t.y}px) rotate(${t.rot}deg)`
      return
    }

    if (cursorMoving) {
      const cx = t.x + t.w / 2
      const cy = t.y + t.h / 2
      const dx = cx - pointerX
      const dy = cy - pointerY
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001
      if (dist < PUSH_RADIUS) {
        const falloff = 1 - dist / PUSH_RADIUS
        t.vx += (dx / dist) * falloff * PUSH_STRENGTH + cursorDx * falloff * 0.01
        t.vy += (dy / dist) * falloff * PUSH_STRENGTH + cursorDy * falloff * 0.01
      }
    }

    // Device tilt slowly steers the ambient drift direction itself, rather than
    // pushing velocity directly — same settle system below just chases a moving
    // target, so tilt and throws/pushes never fight each other.
    if (hasTiltSignal) {
      t.dirX += (tiltX - t.dirX) * TILT_STEER_RATE
      t.dirY += (tiltY - t.dirY) * TILT_STEER_RATE
      const dirLen = Math.hypot(t.dirX, t.dirY) || 1
      t.dirX /= dirLen
      t.dirY /= dirLen
    }

    // Ease actual velocity back toward the tile's constant ambient speed in its
    // current drift direction — never toward zero. This is what keeps pushes
    // and throws feeling like inertia decaying to a resting drift, not friction
    // stopping the tile dead like an air-hockey puck.
    const restVx = t.dirX * SPEED
    const restVy = t.dirY * SPEED
    t.vx += (restVx - t.vx) * SETTLE_RATE
    t.vy += (restVy - t.vy) * SETTLE_RATE

    if (performance.now() < shakeStopUntil) {
      // Shake damps spin toward zero rather than killing it instantly, so it
      // reads as a physical "settling" rather than a jarring stop. The window
      // auto-expires so bounces/throws after a shake can spin tiles again.
      t.vrot *= 0.9
      if (Math.abs(t.vrot) < 0.001) t.vrot = 0
    }

    t.x += t.vx
    t.y += t.vy
    t.rot += t.vrot

    // Bounce off a wall spins the tile a bit, harder for a faster impact —
    // sign alternates with impact direction so it doesn't always spin the same way.
    if (t.x <= 0) { t.x = 0; t.dirX = Math.abs(t.dirX); t.vx = Math.abs(t.vx); t.vrot -= t.vy * BOUNCE_SPIN_FACTOR }
    if (t.x + t.w >= containerWidth) { t.x = containerWidth - t.w; t.dirX = -Math.abs(t.dirX); t.vx = -Math.abs(t.vx); t.vrot += t.vy * BOUNCE_SPIN_FACTOR }
    if (t.y <= 0) { t.y = 0; t.dirY = Math.abs(t.dirY); t.vy = Math.abs(t.vy); t.vrot += t.vx * BOUNCE_SPIN_FACTOR }
    if (t.y + t.h >= containerHeight) { t.y = containerHeight - t.h; t.dirY = -Math.abs(t.dirY); t.vy = -Math.abs(t.vy); t.vrot -= t.vx * BOUNCE_SPIN_FACTOR }

    const el = tileEls.value[i]
    if (el) {
      el.style.transform = `translate(${t.x}px, ${t.y}px) rotate(${t.rot}deg)`
    }
  })

  prevPointerX = pointerX
  prevPointerY = pointerY

  rafId = requestAnimationFrame(tick)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && inspectImage.value) {
    closeInspect()
  }
}

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('keydown', onKeydown)
  nextTick(() => {
    layoutInit()
    window.addEventListener('resize', onResize)
    if (!reduceMotion.value) {
      rafId = requestAnimationFrame(tick)
      maybeInitTilt()
    }
    // Cached images can finish loading before the @load listener attaches —
    // catch those via `complete` so their tiles aren't stuck hidden.
    tileEls.value.forEach((el, i) => {
      const imgEl = el?.querySelector('img')
      if (imgEl?.complete && !loadedFlags.value[i]) onTileLoaded(i)
    })
  })
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('mousemove', onGrabMove)
  window.removeEventListener('mouseup', onGrabEnd)
  window.removeEventListener('touchmove', onGrabMove)
  window.removeEventListener('touchend', onGrabEnd)
  window.removeEventListener('touchcancel', onGrabEnd)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('deviceorientation', onDeviceOrientation)
  window.removeEventListener('devicemotion', onDeviceMotion)
})
</script>

<style scoped>
.floating-gallery {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  height: 70vh;
  min-height: 420px;
  padding: 0 24px;
  overflow: hidden;
}

.floating-tile {
  position: absolute;
  top: 0;
  left: 0;
  width: 130px;
  height: 130px;
  border-radius: 10px;
  overflow: hidden;
  background: #edeae0;
  border: 1px solid #ddd;
  cursor: grab;
  will-change: transform;
  transition: box-shadow 0.2s, border-color 0.2s, opacity 0.35s ease, scale 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  touch-action: none;
  opacity: 0;
  scale: 0.85;
}

.floating-tile.loaded {
  opacity: 1;
  scale: 1;
}

.floating-tile.grabbed {
  cursor: grabbing;
  box-shadow: 0 0 0 3px rgba(62, 198, 240, 0.5), 0 8px 28px rgba(62, 198, 240, 0.4);
  border-color: #3ec6f0;
}

.floating-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.theme-dark .floating-tile {
  background: #1a1a1a;
  border-color: #2a2a2a;
}

.theme-dark .floating-tile.grabbed {
  box-shadow: 0 0 0 3px rgba(62, 198, 240, 0.5), 0 8px 28px rgba(62, 198, 240, 0.45);
  border-color: #3ec6f0;
}

/* Reduced motion: fall back to a static grid, no drift */
.floating-gallery.reduce-motion {
  width: 100%;
  margin-left: 0;
  height: auto;
  min-height: 0;
  max-width: 960px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.floating-gallery.reduce-motion .floating-tile {
  position: static;
  width: auto;
  height: auto;
  aspect-ratio: 1;
  cursor: default;
  transform: none !important;
  opacity: 1;
  scale: 1;
  transition: none;
}

@media (max-width: 768px) {
  .floating-gallery { height: 60vh; min-height: 320px; }
}

.motion-debug {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  padding: 6px 10px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.75);
  color: #7fffd4;
  font-size: 0.7rem;
  font-family: monospace;
  pointer-events: none;
  max-width: 90%;
}

.tilt-enable {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(62, 198, 240, 0.5);
  background: rgba(245, 242, 234, 0.9);
  color: #333;
  font-size: 0.85rem;
  cursor: pointer;
  backdrop-filter: blur(4px);
}

.theme-dark .tilt-enable {
  background: rgba(15, 15, 15, 0.85);
  color: #f0ece4;
}

/* ── Inspect overlay ── */
.inspect-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  cursor: zoom-out;
}

.inspect-image {
  max-width: min(80vw, 640px);
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 0 0 1px rgba(62, 198, 240, 0.4), 0 20px 60px rgba(0, 0, 0, 0.5);
  cursor: default;
}

.inspect-close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
  color: #f0ece4;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.inspect-close:hover {
  background: rgba(255, 255, 255, 0.18);
}

.inspect-fade-enter-active,
.inspect-fade-leave-active {
  transition: opacity 0.25s ease;
}

.inspect-fade-enter-from,
.inspect-fade-leave-to {
  opacity: 0;
}

.inspect-fade-enter-active .inspect-image,
.inspect-fade-leave-active .inspect-image {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.inspect-fade-enter-from .inspect-image,
.inspect-fade-leave-to .inspect-image {
  transform: scale(0.85);
  opacity: 0;
}
</style>
