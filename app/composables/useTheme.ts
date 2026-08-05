export const useTheme = () => {
  const isDark = useState('theme-dark', () => false)

  // The inline script in nuxt.config.ts already stamped the class on <html>
  // before first paint. Keep that element as the single source of truth so the
  // pre-paint class and the reactive state can never disagree.
  const apply = () => {
    if (!import.meta.client) return
    const el = document.documentElement
    el.classList.toggle('theme-dark', isDark.value)
    el.classList.toggle('theme-light', !isDark.value)
  }

  const toggle = () => {
    isDark.value = !isDark.value
    if (import.meta.client) {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
      apply()
    }
  }

  const init = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme')
      if (saved) {
        isDark.value = saved === 'dark'
      } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      apply()
    }
  }

  const themeClass = computed(() => isDark.value ? 'theme-dark' : 'theme-light')

  return { isDark, toggle, init, themeClass }
}
