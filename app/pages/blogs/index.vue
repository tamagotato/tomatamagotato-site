<template>
  <div class="blog-index">
    <h1>writing.</h1>
    <p class="blog-index-subtitle">whatever i feel like. no consistent theme. just honest pieces.</p>
    <ul class="blog-index-list">
      <li>
        <a class="blog-index-card" href="/blogs/stones-throw">
          <time>August 14, 2026</time>
          <h2>Stone's throw</h2>
          <p>English is my second language, and "earnest" always felt like a thin word to me. An evening spent working out what it actually asks of a person, and whether it fits.</p>
        </a>
      </li>
      <li>
        <a class="blog-index-card" href="/blogs/learning-instead-of-watching">
          <time>August 6, 2026</time>
          <h2>They should be learning instead of watching</h2>
          <p>What turns an ordinary person into a leader, why trust outlives rank, and what someone still owes the people who followed them when it all goes wrong.</p>
        </a>
      </li>
      <li>
        <a class="blog-index-card" href="/blogs/remotion-llm-infographics">
          <time>July 24, 2026</time>
          <h2>Using an LLM to draft static infographics with Remotion</h2>
          <p>A worked example: turning a photographed community circular into a mobile-formatted poster, plus the five specific ways this workflow breaks.</p>
        </a>
      </li>
      <li>
        <a class="blog-index-card" href="/blogs/wfh-philippines">
          <time>March 22, 2026</time>
          <h2>How Filipino Workers Lost WFH, and Who They Blame</h2>
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

useHead({ title: 'Writing | tomatamagotato' })
</script>

<style src="~/assets/css/post.css"></style>
