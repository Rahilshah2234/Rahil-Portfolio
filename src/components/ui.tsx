import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { profile } from '../data/profile'

export const EASE = [0.16, 1, 0.3, 1] as const

/* ---------- contact modal context ---------- */
type ContactCtx = { open: () => void }
export const ContactContext = createContext<ContactCtx>({ open: () => {} })
export const useContact = () => useContext(ContactContext)

/* ---------- live local time (IST) ---------- */
export function useLocalTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone: profile.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

/* ---------- reveal on scroll ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- word-by-word masked headline ---------- */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  animateNow = false,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  animateNow?: boolean
}) {
  const words = text.split(' ')
  const trigger = animateNow
    ? { animate: { y: '0%' } }
    : { whileInView: { y: '0%' }, viewport: { once: true, margin: '-10% 0px' } }
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            {...trigger}
            transition={{ duration: 1, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* ---------- magnetic wrapper for buttons ---------- */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })
  return (
    <motion.span
      ref={ref}
      className="inline-block"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}

/* ---------- pill buttons ---------- */
const pillBase =
  'group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5 text-[0.95rem] font-medium transition-colors duration-500'

export function PillButton({
  children,
  onClick,
  href,
  variant = 'solid',
  external,
}: {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: 'solid' | 'ghost'
  external?: boolean
}) {
  const cls =
    variant === 'solid'
      ? `${pillBase} bg-bone text-ink hover:text-bone`
      : `${pillBase} border border-line text-bone hover:text-ink`
  const fill = variant === 'solid' ? 'bg-ember' : 'bg-bone'
  const inner = (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 ${fill} translate-y-[101%] rounded-[inherit] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0`}
      />
      <span className="relative flex items-center gap-2.5">{children}</span>
    </>
  )
  return (
    <Magnetic>
      {href ? (
        <a
          href={href}
          className={cls}
          data-cursor="hover"
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={cls} data-cursor="hover">
          {inner}
        </button>
      )}
    </Magnetic>
  )
}

/* ---------- status dot ---------- */
export function LiveDot() {
  return <span className="inline-block size-2 rounded-full bg-[#7fd68c] animate-pulse-dot" aria-hidden />
}

/* ---------- brand icons (lucide no longer ships brand marks) ---------- */
export function GithubIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

export function LinkedinIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

/* ---------- section heading block ---------- */
export function SectionHead({
  eyebrow,
  title,
  accent,
  aside,
}: {
  eyebrow: string
  title: string
  accent?: string
  aside?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <Reveal>
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-ember" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <h2 className="display text-[clamp(2.6rem,7vw,6.5rem)]">
          <SplitWords text={title} />
          {accent && (
            <>
              {' '}
              <span className="serif-accent text-ember">
                <SplitWords text={accent} delay={0.15} />
              </span>
            </>
          )}
        </h2>
      </div>
      {aside && <Reveal delay={0.2}>{aside}</Reveal>}
    </div>
  )
}
