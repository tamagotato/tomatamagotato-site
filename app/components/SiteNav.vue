<template>
  <nav class="site-nav">
    <NuxtLink class="nav-logo" to="/"><img src="/favicon.png" alt="tomatamagotato" class="nav-logo-img"></NuxtLink>
    <div class="nav-links">
      <NuxtLink class="nav-link" to="/">Home</NuxtLink>
      <NuxtLink class="nav-link" to="/blogs">Blogs</NuxtLink>
      <ThemeToggle />
    </div>
  </nav>
</template>
