<!-- app/components/home/WritingCarousel.vue -->
<template>
  <div
    class="writing-carousel"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <div class="carousel-stage">
      <transition :name="reduceMotion ? 'wc-fade' : 'wc-flip'" mode="out-in">
        <a
          :key="active.href"
          class="blog-card"
          :href="active.href"
        >
          <div class="blog-date">{{ active.date }}</div>
          <h3>{{ active.title }}</h3>
          <p>{{ active.excerpt }}</p>
        </a>
      </transition>
    </div>
    <div class="carousel-dots" role="tablist" aria-label="Writing posts">
      <button
        v-for="(post, i) in posts"
        :key="post.href"
        type="button"
        class="carousel-dot"
        :class="{ active: i === activeIndex }"
        :aria-current="i === activeIndex"
        :aria-label="`Show post: ${post.title}`"
        @click="select(i)"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Post {
  href: string
  date: string
  title: string
  excerpt: string
}

const props = defineProps<{ posts: Post[] }>()

const activeIndex = ref(0)
const active = computed(() => props.posts[activeIndex.value])
const reduceMotion = ref(false)

const ROTATE_MS = 3000
let timer: ReturnType<typeof setInterval> | null = null

function advance() {
  activeIndex.value = (activeIndex.value + 1) % props.posts.length
}

function select(i: number) {
  activeIndex.value = i
  restart()
}

function start() {
  if (reduceMotion.value || props.posts.length <= 1) return
  timer = setInterval(advance, ROTATE_MS)
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function restart() {
  stop()
  start()
}

function pause() {
  stop()
}

function resume() {
  restart()
}

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  start()
})

onUnmounted(() => {
  stop()
})
</script>

<style scoped>
.writing-carousel {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 24px 40px;
}

.carousel-stage {
  perspective: 1200px;
  position: relative;
  height: 220px;
}

.blog-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 24px 28px;
  background: #edeae0;
  border-radius: 10px;
  border: 1px solid #ddd;
  border-left: 3px solid #6b8c3e;
  text-decoration: none;
  color: #1a1a1a;
  box-shadow: 3px 3px 0 rgba(0,0,0,0.04);
  box-sizing: border-box;
  overflow: hidden;
}

.blog-card p {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.blog-card .blog-date {
  font-size: 0.75rem;
  color: #6b8c3e;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.blog-card p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.theme-dark .blog-card {
  background: #1a1a1a;
  border-color: #2a2a2a;
  border-left-color: #8aaa55;
  color: #f0ece4;
}

.theme-dark .blog-card .blog-date { color: #8aaa55; }
.theme-dark .blog-card p { color: #888; }

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: #ccc;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.carousel-dot:hover { transform: scale(1.2); }
.carousel-dot.active { background: #6b8c3e; }

.theme-dark .carousel-dot { background: #333; }
.theme-dark .carousel-dot.active { background: #8aaa55; }

/* Flip/rotate transition — the "paper spinning to reveal the next page" motion */
.wc-flip-enter-active,
.wc-flip-leave-active {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
  position: absolute;
  inset: 0;
}

.wc-flip-enter-from {
  transform: rotateY(90deg);
  opacity: 0;
}

.wc-flip-leave-to {
  transform: rotateY(-90deg);
  opacity: 0;
}

.wc-fade-enter-active,
.wc-fade-leave-active {
  transition: opacity 0.3s ease;
  position: absolute;
  inset: 0;
}

.wc-fade-enter-from,
.wc-fade-leave-to {
  opacity: 0;
}
</style>
