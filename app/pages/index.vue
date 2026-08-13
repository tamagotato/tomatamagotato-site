<template>
  <div class="home-page">
    <HomeStarField v-if="isDark" />
    <img src="/img/blueman_watermark.png" alt="" class="bg-watermark" aria-hidden="true">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-name">tomatamagotato.</h1>
        <p class="hero-text">i make things. some useful. some just weird. this is where all of it lives.</p>
      </div>
      <div class="hero-avatar">
        <img src="/img/bluman_2_copy.png" alt="tomatamagotato avatar">
      </div>
    </section>

    <!-- Art Gallery -->
    <p class="section-title reveal">art</p>
    <div class="reveal">
      <HomeFloatingGallery :images="artImages" />
    </div>

    <!-- Video -->
    <p class="section-title reveal">video</p>
    <section class="video-section reveal">
      <div class="video-main">
        <div class="video-embed">
          <iframe
            src="https://www.youtube.com/embed/z-xawoH8lSs"
            title="dumblore maneuver"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
        <p class="video-caption">dumblore maneuver</p>
      </div>
      <div class="video-illustration">
        <img src="/img/frogger_panel_5.png" alt="tomatamagotato gaming">
      </div>
    </section>

    <!-- Blog Preview -->
    <p class="section-title reveal">writing</p>
    <div class="reveal">
      <HomeWritingCarousel :posts="writingPosts" />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'tomatamagotato' })

const { isDark } = useTheme()
const { init: initReveal } = useScrollReveal('.reveal')

onMounted(() => {
  nextTick(() => initReveal())
})

const writingPosts = [
  {
    href: '/blogs/learning-instead-of-watching',
    date: 'August 6, 2026',
    title: 'They should be learning instead of watching',
    excerpt: 'What turns an ordinary person into a leader, why trust outlives rank, and what someone still owes the people who followed them when it all goes wrong.'
  },
  {
    href: '/blogs/remotion-llm-infographics',
    date: 'July 24, 2026',
    title: 'Using an LLM to Draft Static Infographics with Remotion',
    excerpt: 'A real worked example: turning a photographed community circular into a mobile-formatted poster — and the five specific ways this workflow actually breaks.'
  },
  {
    href: '/blogs/wfh-philippines',
    date: 'March 22, 2026',
    title: 'How Filipino Workers Lost WFH — and Who They Blame',
    excerpt: 'Sentiment analysis across Reddit, Twitter/X, Facebook, and TikTok. Covering PEZA policy, the BPO industry, Manila\'s commute crisis, and cultural fault lines.'
  }
]

const artImages = [
  { src: '/img/face.png', alt: 'face' },
  { src: '/img/lucy.png', alt: 'lucy' },
  { src: '/img/joblubber.png', alt: 'joblubber' },
  { src: '/img/bugsy_2.png', alt: 'bugsy' },
  { src: '/img/bugsy_3.png', alt: 'bugsy 3' },
  { src: '/img/bugsy_4.png', alt: 'bugsy 4' },
  { src: '/img/inktober_3_copy.png', alt: 'inktober' },
  { src: '/img/angry_emote.png', alt: 'angry emote' },
  { src: '/img/angry_emote_copy.png', alt: 'angry emote copy' },
  { src: '/img/blueman_watermark.png', alt: 'blueman' },
  { src: '/img/blueman_with_a_gun_vector.png', alt: 'blueman with a gun' },
  { src: '/img/kwini_copy.png', alt: 'kwini' },
  { src: '/img/idshonor_2.png', alt: 'idshonor' },
  { src: '/img/artwork_27493159.png', alt: 'artwork' },
  { src: '/img/artwork_41975146.png', alt: 'artwork 2' },
  { src: '/img/emote_2_112.png', alt: 'emote' },
  { src: '/img/tamago2026.png', alt: 'tamago' },
  { src: '/img/tato2026.png', alt: 'tato' },
  { src: '/img/toma_2026.png', alt: 'toma 2026' },
  { src: '/img/bluman.png', alt: 'bluman' },
  { src: '/img/bluman_2.png', alt: 'bluman 2' },
  { src: '/img/bluman3.png', alt: 'bluman 3' },
  { src: '/img/anton_1.png', alt: 'anton 1' },
  { src: '/img/anton_5.png', alt: 'anton 5' },
  { src: '/img/aaaass.png', alt: 'aaaass' },
  { src: '/img/dddsss.png', alt: 'dddsss' },
  { src: '/img/ssss.png', alt: 'ssss' },
  { src: '/img/evilz.png', alt: 'evilz' },
  { src: '/img/ems_copy.png', alt: 'ems copy' },
  { src: '/img/imouto.png', alt: 'imouto' },
  { src: '/img/kora.png', alt: 'kora' },
  { src: '/img/nadeshko.png', alt: 'nadeshko' },
]
</script>

<style src="~/assets/css/home.css"></style>
<style scoped>
.home-page {
  position: relative;
}

.bg-watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 3000px;
  height: 3000px;
  object-fit: contain;
  opacity: 0.04;
  pointer-events: none;
  z-index: 1;
}

.home-page :deep(section),
.home-page :deep(.video-section),
.home-page :deep(.section-title),
.home-page :deep(.reveal) {
  position: relative;
  z-index: 2;
}
</style>
