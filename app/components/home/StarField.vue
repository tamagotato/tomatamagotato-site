<!-- app/components/home/StarField.vue -->
<template>
  <canvas ref="canvasEl" class="star-field" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
interface Star {
  x: number
  y: number
  baseVx: number
  baseVy: number
  vx: number
  vy: number
  depth: number
  r: number
  alpha: number
  pulsePhase: number
}

const canvasEl = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let stars: Star[] = []
let rafId = 0
let width = 0
let height = 0
let pointerX = 0
let pointerY = 0
let pointerActive = false
let scrollY = 0
let reduceMotion = false

const STAR_COUNT = 46
const PULL_RADIUS = 90
const LINK_DIST = 130
const GRID_SPACING = 60
const PULL_DEPTH_THRESHOLD = 0.45
const PULSE_DEPTH_THRESHOLD = 0.6
const SCROLL_PARALLAX = 0.04

function resize() {
  if (!canvasEl.value) return
  width = window.innerWidth
  height = window.innerHeight
  canvasEl.value.width = width
  canvasEl.value.height = height
}

function makeStars() {
  stars = []
  for (let i = 0; i < STAR_COUNT; i++) {
    const depth = Math.random()
    const star: Star = {
      x: Math.random() * width,
      y: Math.random() * height,
      baseVx: (Math.random() - 0.5) * 0.06 * (0.5 + depth),
      baseVy: (Math.random() * 0.04 + 0.01) * (0.5 + depth),
      vx: 0,
      vy: 0,
      depth,
      r: 0.4 + depth * 1.3,
      alpha: 0.12 + depth * 0.35,
      pulsePhase: Math.random() * Math.PI * 2
    }
    star.vx = star.baseVx
    star.vy = star.baseVy
    stars.push(star)
  }
}

function onPointerMove(clientX: number, clientY: number) {
  pointerX = clientX
  pointerY = clientY - scrollY * SCROLL_PARALLAX
  pointerActive = true
}

function onMouseMove(e: MouseEvent) {
  onPointerMove(e.clientX, e.clientY)
}

function onTouchMove(e: TouchEvent) {
  const touch = e.touches[0]
  if (touch) onPointerMove(touch.clientX, touch.clientY)
}

function onPointerLeave() {
  pointerActive = false
}

function onScroll() {
  scrollY = window.scrollY
}

function onResize() {
  resize()
  makeStars()
}

function drawStatic() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  drawGrid()
  for (const s of stars) {
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fillStyle = s.depth > PULSE_DEPTH_THRESHOLD
      ? `rgba(210,230,238,${s.alpha})`
      : `rgba(240,236,228,${s.alpha})`
    ctx.fill()
  }
}

function drawGrid() {
  if (!ctx) return
  const offsetY = scrollY * SCROLL_PARALLAX
  ctx.strokeStyle = 'rgba(74,94,46,0.16)'
  ctx.lineWidth = 1
  for (let x = 0; x <= width; x += GRID_SPACING) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = -GRID_SPACING; y <= height + GRID_SPACING; y += GRID_SPACING) {
    const yy = ((y - offsetY) % (height + GRID_SPACING) + height + GRID_SPACING) % (height + GRID_SPACING) - GRID_SPACING
    ctx.beginPath()
    ctx.moveTo(0, yy)
    ctx.lineTo(width, yy)
    ctx.stroke()
  }
}

function draw(ts: number) {
  if (!ctx) return
  const t = ts * 0.001
  ctx.clearRect(0, 0, width, height)

  drawGrid()

  for (const s of stars) {
    let ax = 0
    let ay = 0
    if (pointerActive) {
      const dx = pointerX - s.x
      const dy = pointerY - s.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001
      if (dist < PULL_RADIUS) {
        const strength = (1 - dist / PULL_RADIUS) * 0.045
        ax += (dx / dist) * strength * 0.4
        ay += (dy / dist) * strength * 0.4
        ax += (-dy / dist) * strength * 0.3
        ay += (dx / dist) * strength * 0.3
      }
    }
    s.vx += (s.baseVx - s.vx) * 0.015 + ax
    s.vy += (s.baseVy - s.vy) * 0.015 + ay
    s.vx *= 0.97
    s.vy *= 0.97
    s.x += s.vx
    s.y += s.vy

    if (s.x < -5) s.x = width + 5
    if (s.x > width + 5) s.x = -5
    if (s.y > height + 5) { s.y = -5; s.x = Math.random() * width }
    if (s.y < -5) s.y = height + 5
  }

  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const a = stars[i]
      const b = stars[j]
      if (a.depth < PULL_DEPTH_THRESHOLD || b.depth < PULL_DEPTH_THRESHOLD) continue
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < LINK_DIST) {
        const lineAlpha = (1 - dist / LINK_DIST) * 0.12 * Math.min(a.depth, b.depth)
        ctx.strokeStyle = `rgba(138,170,85,${lineAlpha})`
        ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }

  if (pointerActive) {
    const grad = ctx.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, PULL_RADIUS)
    grad.addColorStop(0, 'rgba(62,198,240,0.10)')
    grad.addColorStop(1, 'rgba(62,198,240,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  }

  for (const s of stars) {
    let alpha = s.alpha
    let r = s.r
    if (s.depth > PULSE_DEPTH_THRESHOLD) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + s.pulsePhase)
      alpha += pulse * 0.15
      r += pulse * 0.4
      if (pulse > 0.85) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, r + 2.5, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(62,198,240,${(pulse - 0.85) * 1.2})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
    }
    ctx.beginPath()
    ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
    ctx.fillStyle = s.depth > PULSE_DEPTH_THRESHOLD
      ? `rgba(210,230,238,${alpha})`
      : `rgba(240,236,228,${alpha})`
    ctx.fill()
  }

  rafId = requestAnimationFrame(draw)
}

onMounted(() => {
  if (!canvasEl.value) return
  ctx = canvasEl.value.getContext('2d')
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  resize()
  makeStars()

  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })

  if (reduceMotion) {
    drawStatic()
    return
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('touchend', onPointerLeave)
  window.addEventListener('mouseleave', onPointerLeave)

  rafId = requestAnimationFrame(draw)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onPointerLeave)
  window.removeEventListener('mouseleave', onPointerLeave)
})
</script>

<style scoped>
.star-field {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}
</style>
