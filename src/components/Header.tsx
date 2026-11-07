import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { nav, profile } from '../data/profile'
import { EASE, GithubIcon, LinkedinIcon, LiveDot, useContact, useLocalTime } from './ui'

export function Header() {
  const time = useLocalTime()
  const { open: openContact } = useContact()
  const [menu, setMenu] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(v > 40)
    setHidden(v > 400 && v > prev && !menu)
  })

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div
          className={`transition-[background-color,backdrop-filter,border-color] duration-500 border-b ${
            scrolled && !menu ? 'bg-ink/70 backdrop-blur-xl border-line' : 'border-transparent'
          }`}
        >
          <div className="wrap flex h-[72px] items-center justify-between gap-6">
            <a href="#top" className="group flex items-center gap-3" data-cursor="hover" onClick={() => setMenu(false)}>
              <span className="grid size-9 place-items-center rounded-full bg-bone text-ink serif-accent text-lg transition-transform duration-500 group-hover:rotate-[-12deg]">
                RS
              </span>
              <span className="font-medium tracking-tight">{profile.name}</span>
            </a>

            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="group rounded-full px-4 py-2 text-sm text-mute transition-colors hover:text-bone"
                  data-cursor="hover"
                >
                  <span className="relative block overflow-hidden leading-5">
                    <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
                      {n.label}
                    </span>
                    <span
                      aria-hidden
                      className="absolute inset-0 translate-y-full text-bone transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0"
                    >
                      {n.label}
                    </span>
                  </span>
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-5">
              <p className="hidden items-center gap-2 font-mono text-xs text-mute md:flex" aria-label={`Local time in ${profile.city}`}>
                <span className="text-dim">{profile.city}</span>
                <span className="tabular-nums text-bone">{time}</span>
                <span className="text-dim">IST</span>
              </p>
              <button
                type="button"
                onClick={() => setMenu((m) => !m)}
                aria-expanded={menu}
                aria-controls="site-menu"
                className="flex items-center gap-3 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-bone/40"
                data-cursor="hover"
              >
                <span>{menu ? 'Close' : 'Menu'}</span>
                <span className="relative block h-2.5 w-4" aria-hidden>
                  <span
                    className={`absolute left-0 top-0 h-px w-full bg-bone transition-transform duration-500 ${menu ? 'translate-y-[5px] rotate-45' : ''}`}
                  />
                  <span
                    className={`absolute bottom-0 left-0 h-px w-full bg-bone transition-transform duration-500 ${menu ? '-translate-y-[4px] -rotate-45' : ''}`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="site-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink-2"
            initial={{ clipPath: 'circle(0% at calc(100% - 60px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 60px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 60px) 36px)' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="wrap flex flex-1 flex-col justify-between pb-10 pt-28">
              <ul className="space-y-1">
                {[{ label: 'Home', href: '#top' }, ...nav].map((n, i) => (
                  <li key={n.href} className="overflow-hidden">
                    <motion.a
                      href={n.href}
                      onClick={() => setMenu(false)}
                      className="group flex items-baseline gap-4 py-1"
                      initial={{ y: '100%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}
                      data-cursor="hover"
                    >
                      <span className="font-mono text-xs text-dim">0{i + 1}</span>
                      <span className="display text-[clamp(2.6rem,9vw,6rem)] transition-colors duration-300 group-hover:text-ember">
                        {n.label}
                      </span>
                    </motion.a>
                  </li>
                ))}
                <li className="overflow-hidden">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setMenu(false)
                      openContact()
                    }}
                    className="group flex items-baseline gap-4 py-1 text-left"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.15 + (nav.length + 1) * 0.05 }}
                    data-cursor="hover"
                  >
                    <span className="font-mono text-xs text-dim">0{nav.length + 2}</span>
                    <span className="display serif-accent text-[clamp(2.6rem,9vw,6rem)] text-ember">Contact</span>
                  </motion.button>
                </li>
              </ul>
              <motion.div
                className="mt-10 flex flex-col gap-6 border-t border-line pt-6 text-sm md:flex-row md:items-center md:justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="flex items-center gap-3 text-mute">
                  <LiveDot /> Eager to gain real-world experience
                </p>
                <div className="flex flex-wrap gap-5">
                  <a href={profile.github.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-ember" data-cursor="hover">
                    <GithubIcon /> GitHub <ArrowUpRight className="size-3.5" />
                  </a>
                  <a href={profile.linkedin.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-ember" data-cursor="hover">
                    <LinkedinIcon /> LinkedIn <ArrowUpRight className="size-3.5" />
                  </a>
                  <a href={`mailto:${profile.email}`} className="hover:text-ember" data-cursor="hover">
                    {profile.email}
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
