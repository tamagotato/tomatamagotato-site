<template>
  <div class="home-page">
    <img src="/img/blueman with a gun vector.png" alt="" class="bg-watermark" aria-hidden="true">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-name">tomatamagotato.</h1>
        <p class="hero-text">i make things. some useful. some just weird. this is where all of it lives.</p>
      </div>
      <div class="hero-avatar">
        <img src="/img/bluman 2 - Copy.png" alt="tomatamagotato avatar">
      </div>
    </section>

    <!-- Art Gallery -->
    <p class="section-title">art</p>
    <div class="art-gallery">
      <div v-for="img in artImages" :key="img.alt" class="art-item">
        <img :src="img.src" :alt="img.alt">
      </div>
    </div>

    <!-- Video -->
    <p class="section-title">video</p>
    <section class="video-section">
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
        <img src="/img/frogger panel 5.png" alt="tomatamagotato gaming">
      </div>
    </section>

    <!-- Blog Preview -->
    <p class="section-title">writing</p>
    <div class="blog-list">
      <a class="blog-card" href="/blogs/wfh-philippines">
        <div class="blog-date">March 22, 2026</div>
        <h3>How Filipino Workers Lost WFH — and Who They Blame</h3>
        <p>Sentiment analysis across Reddit, Twitter/X, Facebook, and TikTok. Covering PEZA policy, the BPO industry, Manila's commute crisis, and cultural fault lines.</p>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'tomatamagotato' })

const artImages = [
  { src: '/img/face.png', alt: 'face' },
  { src: '/img/lucy.png', alt: 'lucy' },
  { src: '/img/JOBLUBBER.png', alt: 'joblubber' },
  { src: '/img/bugsy -2.png', alt: 'bugsy' },
  { src: '/img/Inktober 3 - Copy.png', alt: 'inktober' },
  { src: '/img/angry emote.png', alt: 'angry emote' },
  { src: '/img/blueman with a gun vector.png', alt: 'blueman' },
  { src: '/img/kwini - Copy.png', alt: 'kwini' },
  { src: '/img/idshonor 2.png', alt: 'idshonor' },
  { src: '/img/27493159.png', alt: 'artwork' },
  { src: '/img/41975146.png', alt: 'artwork 2' },
  { src: '/img/emote 2_112.png', alt: 'emote' },
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
.home-page :deep(.art-gallery),
.home-page :deep(.video-section),
.home-page :deep(.blog-list),
.home-page :deep(.section-title) {
  position: relative;
  z-index: 2;
}
</style>
