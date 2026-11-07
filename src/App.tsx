import { useCallback, useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import Lenis from 'lenis'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Doors } from './components/Doors'
import { Toolkit } from './components/Toolkit'
import { Story } from './components/Story'
import { Beyond, Certifications } from './components/Certifications'
import { CallToAction, ContactModal, Footer } from './components/Closing'
import { Loader } from './components/Loader'
import { Cursor } from './components/Cursor'
import { ProjectPage } from './components/ProjectPage'
import { ContactContext } from './components/ui'

const SEEN_KEY = 'rs-intro-seen'

// Hash routing keeps the site a static build (works on GitHub Pages at any path).
// '#/project/<slug>' shows a detail page; every other hash is a home-page anchor.
function projectSlugFromHash() {
  const m = window.location.hash.match(/^#\/project\/([\w-]+)$/)
  return m ? m[1] : null
}

function introSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [entered, setEntered] = useState(introSeen)
  const [contactOpen, setContactOpen] = useState(false)
  const [slug, setSlug] = useState<string | null>(projectSlugFromHash)
  const openContact = useCallback(() => setContactOpen(true), [])
  const closeContact = useCallback(() => setContactOpen(false), [])
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    document.body.style.overflow = entered ? '' : 'hidden'
  }, [entered])

  // Route changes: go to the top on a project page, or scroll to the anchor on the home page.
  useEffect(() => {
    const onHash = () => {
      const next = projectSlugFromHash()
      setSlug(next)
      if (next) {
        window.scrollTo(0, 0)
      } else {
        const id = window.location.hash.slice(1)
        const target = id ? document.getElementById(id) : null
        if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth' }))
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Lenis smooth scrolling on desktop (mouse) only, like the reference
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!mq.matches) return
    document.documentElement.style.scrollBehavior = 'auto'
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: 0 }, prevent: (node) => !!node.closest('[role=dialog], #site-menu') })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    // pause smooth scroll while the intro, menu or a modal locks the page
    const sync = () => (document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start())
    const mo = new MutationObserver(sync)
    mo.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    sync()
    return () => {
      mo.disconnect()
      cancelAnimationFrame(raf)
      lenis.destroy()
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  const enter = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* storage blocked: the gate shows again next visit, which is fine */
    }
    setEntered(true)
  }

  return (
    <ContactContext.Provider value={{ open: openContact }}>
      <div className="grain">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        {!entered && <Loader onEnter={enter} />}
        <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-ember" style={{ scaleX: scrollYProgress }} />
        <Cursor />
        <Header />
        <main id="main">
          {slug ? (
            <ProjectPage slug={slug} />
          ) : (
            <>
              <Hero entered={entered} />
              <Doors />
              <Toolkit />
              <Story />
              <Certifications />
              <Beyond />
              <CallToAction />
            </>
          )}
        </main>
        <Footer />
        <ContactModal isOpen={contactOpen} onClose={closeContact} />
      </div>
    </ContactContext.Provider>
  )
}
