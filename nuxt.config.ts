// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  nitro: {
    preset: 'github-pages'
  },
  css: ['~/assets/css/global.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'tomatamagotato',
      meta: [
        { name: 'description', content: 'Research, analysis, and creative work by tomatamagotato.' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Roboto+Mono:wght@500&family=Kalam:wght@400&display=swap' }
      ],
      script: [
        {
          // Resolves the theme before first paint so dark-mode users never see
          // a light flash. useTheme().init() reads the same key on mount.
          innerHTML: `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.add(d?'theme-dark':'theme-light')}catch(e){}})()`
        }
      ]
    }
  }
})
