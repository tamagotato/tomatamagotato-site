<template>
  <div class="blog-index">
    <h1>writing.</h1>
    <p class="blog-index-subtitle">whatever i feel like. no consistent theme. just honest pieces.</p>
    <ul class="blog-index-list">
      <li>
        <a class="blog-index-card" href="/blogs/wfh-philippines">
          <time>March 22, 2026</time>
          <h2>How Filipino Workers Lost WFH — and Who They Blame</h2>
          <p>Sentiment analysis across Reddit, Twitter/X, Facebook, and TikTok. Covering PEZA policy, the BPO industry, Manila's commute crisis, and cultural fault lines.</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dark'
})

useHead({ title: 'Writing — tomatamagotato' })
</script>

<style src="~/assets/css/post.css"></style>
