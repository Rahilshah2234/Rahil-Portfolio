import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import { AbilityCard } from './Loader'
import { Lamp } from './Lamp'
import { EASE, GithubIcon, LinkedinIcon, LiveDot, PillButton, SplitWords } from './ui'

// Social links shown under the hero buttons.
const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Rahilshah2234', icon: GithubIcon, external: true },
  { label: 'LinkedIn', href: profile.linkedin.href, icon: LinkedinIcon, external: true },
  { label: 'Email', href: 'mailto:shahrahil67790@gmail.com', icon: Mail, external: false },
] as const

const interests = [
  'Technology',
  'Software Development',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Data Analytics',
  'Problem Solving',
  'Innovation',
  'Building Solutions',
]

// Static heading text hover: the static words grow slightly and a thin red rule sweeps under them.
// The hover area wraps only the static words, so the rotating words are not included.
// The rule is absolutely positioned, so nothing in the layout moves.
const heroLine = 'block'
const heroStatic =
  'group relative inline-block origin-left transition-transform duration-500 ease-[var(--ease-out-expo)] hover:scale-[1.03]'
const heroLineRule =
  'pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-ember transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-x-100'

export function Hero({ entered }: { entered: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const yCard = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const [word, setWord] = useState(0)
  useEffect(() => {
    if (!entered) return
    const id = window.setInterval(() => setWord((w) => (w + 1) % interests.length), 2400)
    return () => window.clearInterval(id)
  }, [entered])

  const show = entered ? 'animate' : 'initial'

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[72px]">
      {/* soft red glow */}
      <div aria-hidden className="pointer-events-none absolute -right-[10vw] top-[5vh] size-[70vmax] rounded-full bg-ember/[0.13] blur-[140px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgb(237_230_220/0.05)_1px,transparent_1px)] [background-size:calc(100%/6)_100%] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />

      <motion.div style={{ opacity: fade }} className="wrap relative grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.6fr_1fr] lg:py-0">
        <motion.div style={{ y: yText }}>
          <motion.p
            className="eyebrow mb-8 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={show}
            variants={{ animate: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <span className="h-px w-8 bg-ember" aria-hidden />
            {profile.role}
          </motion.p>

          {entered && (
            <h1 className="display text-[clamp(2.8rem,6.2vw,6.6rem)]">
              <span className={heroLine}>
                <span className={heroStatic}>
                  <SplitWords text={`Hi, I'm ${profile.firstName}.`} animateNow delay={0.15} />
                  <span aria-hidden className={heroLineRule} />
                </span>
              </span>
              <span className={`${heroLine} text-mute`}>
                <span className={heroStatic}>
                  <SplitWords text="AI & Data Science" animateNow delay={0.35} />
                  <span aria-hidden className={heroLineRule} />
                </span>
              </span>
              <span className={`${heroLine} text-mute`}>
                <span className={heroStatic}>
                  <SplitWords text="student, drawn to" animateNow delay={0.5} />
                  <span aria-hidden className={heroLineRule} />
                </span>{' '}
                <span className="relative inline-flex overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={interests[word]}
                      className="serif-accent inline-block whitespace-nowrap pb-[0.12em] -mb-[0.12em] text-ember"
                      initial={{ y: '100%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '-100%' }}
                      transition={{ duration: 0.8, ease: EASE }}
                    >
                      {interests[word]}.
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </h1>
          )}

          <motion.p
            className="mt-8 max-w-xl text-lg leading-relaxed text-mute"
            initial={{ opacity: 0, y: 20 }}
            animate={show}
            variants={{ animate: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
          >
            {profile.summary}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={show}
            variants={{ animate: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}
          >
            <PillButton href="#contact-form">
              Get in touch <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
            </PillButton>
            <PillButton href="#work" variant="ghost">
              See my work <ArrowDown className="size-4" />
            </PillButton>
          </motion.div>

          <div className="mt-8 flex items-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon, external }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="grid size-10 place-items-center rounded-full border border-line text-mute transition-[transform,color,background-color] duration-500 ease-[var(--ease-out-expo)] hover:scale-110 hover:bg-bone hover:text-ink"
                data-cursor="hover"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ y: yCard }}
          className="flex justify-center lg:justify-end"
          initial={{ opacity: 0, y: 60, rotate: 6 }}
          animate={entered ? { opacity: 1, y: 0, rotate: -3 } : undefined}
          transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
        >
          <div style={{ perspective: 1200 }} className="relative">
            <AbilityCard compact />
            <Lamp className="left-full top-[30%] ml-5 hidden lg:flex" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="wrap relative pb-8"
        initial={{ opacity: 0 }}
        animate={show}
        variants={{ animate: { opacity: 1 } }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="flex flex-col gap-3 border-t border-line pt-5 text-sm text-mute sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3">
            <LiveDot /> Eager to gain real-world experience
          </p>
          <p className="hidden md:block">B.Tech · {profile.college} · {profile.batch}</p>
          <a href="#work" className="group flex items-center gap-2 text-bone" data-cursor="hover">
            Scroll to explore
            <ArrowDown className="size-4 transition-transform duration-500 group-hover:translate-y-1" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
