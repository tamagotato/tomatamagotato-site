<template>
  <nav class="site-nav">
    <NuxtLink class="nav-logo" to="/">
      <div class="nav-logo-badge">
        <img src="/img/emote 2_112.png" alt="tomatamagotato">
      </div>
      <span class="nav-logo-name">tomatamagotato</span>
    </NuxtLink>
    <div class="nav-links">
      <NuxtLink class="nav-link" to="/">Home</NuxtLink>
      <NuxtLink class="nav-link" to="/work">Work</NuxtLink>
      <NuxtLink class="nav-link" to="/blogs">Blog</NuxtLink>
      <ThemeToggle />
    </div>
  </nav>
</template>
