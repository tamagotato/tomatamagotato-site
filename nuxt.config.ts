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
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
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
