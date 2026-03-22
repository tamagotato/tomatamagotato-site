<template>
  <div class="blog-index">
    <h1>blogs</h1>
    <ul class="blog-index-list">
      <li>
        <a class="blog-index-card" href="/blogs/wfh-philippines">
          <h2>How Filipino Workers Lost WFH — and Who They Blame</h2>
          <time>March 22, 2026</time>
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

useHead({ title: 'Blogs — tomatamagotato' })
</script>

<style src="~/assets/css/post.css"></style>
