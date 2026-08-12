export const useScrollReveal = (selector: string) => {
  const init = () => {
    if (!import.meta.client) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = document.querySelectorAll(selector)

    if (reduceMotion) {
      elements.forEach((el) => el.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    elements.forEach((el) => observer.observe(el))
  }

  return { init }
}
