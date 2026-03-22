export const useTheme = () => {
  const isDark = useState('theme-dark', () => false)

  const toggle = () => {
    isDark.value = !isDark.value
    if (import.meta.client) {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
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
    }
  }

  const themeClass = computed(() => isDark.value ? 'theme-dark' : 'theme-light')

  return { isDark, toggle, init, themeClass }
}
