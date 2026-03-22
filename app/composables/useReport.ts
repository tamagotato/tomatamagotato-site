export const useReport = () => {
  const tocScrolled = ref(false)
  const activeSection = ref('')

  const initScrollReveal = () => {
    if (!import.meta.client) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.report-section').forEach((el) => {
      observer.observe(el)
    })
  }

  const initTocTracking = () => {
    if (!import.meta.client) return
    const sections = document.querySelectorAll('.report-section[id]')

    const onScroll = () => {
      tocScrolled.value = window.scrollY > 100

      let current = ''
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight / 2) {
          current = section.id
        }
      })
      activeSection.value = current
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  const initAnimatedBars = () => {
    if (!import.meta.client) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated')
        }
      })
    }, { threshold: 0.3 })

    document.querySelectorAll('.report-bar-track, .report-ranked-bar').forEach((el) => {
      observer.observe(el)
    })
  }

  const toggleItem = (event: Event) => {
    const target = (event.currentTarget as HTMLElement)
    target.classList.toggle('open')
  }

  const toggleExpand = (event: Event) => {
    const target = (event.currentTarget as HTMLElement)
    target.classList.toggle('expanded')
  }

  const initAll = () => {
    nextTick(() => {
      initScrollReveal()
      initTocTracking()
      initAnimatedBars()
    })
  }

  return {
    tocScrolled,
    activeSection,
    toggleItem,
    toggleExpand,
    initAll
  }
}
