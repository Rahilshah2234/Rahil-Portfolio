import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { profile } from '../data/profile'
import { EASE } from './ui'

/**
 * Intro gate: "Loading the card 0–100%", then the ability card with
 * "Click to enter". The gate is skipped on repeat visits in the same tab.
 */
export function Loader({ onEnter }: { onEnter: () => void }) {
  const [pct, setPct] = useState(0)
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let raf = 0
    let fontsDone = false
    document.fonts?.ready.then(() => (fontsDone = true))
    const start = performance.now()
    const tick = (t: number) => {
      const elapsed = t - start
      // eased progress over ~1.6s, holds at 92% until fonts are ready
      let p = Math.min(1, elapsed / 1600)
      p = 1 - Math.pow(1 - p, 3)
      let v = Math.round(p * 100)
      if (!fontsDone && v > 92) v = 92
      setPct(v)
      if (v >= 100) {
        setReady(true)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const enter = () => {
    if (!ready || leaving) return
    setLeaving(true)
    window.setTimeout(onEnter, 900)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') enter()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-ink px-4"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      animate={leaving ? { clipPath: 'inset(0 0 100% 0)' } : { clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 0.9, ease: EASE }}
      role="dialog"
      aria-label="Intro"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/20 blur-[120px]"
      />

      <AnimatePresence mode="wait">
        {!ready ? (
          <motion.div
            key="loading"
            className="relative flex flex-col items-center gap-6"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <p className="eyebrow">Loading the card</p>
            <p className="display font-mono text-[clamp(4rem,14vw,9rem)] tabular-nums">
              {String(pct).padStart(2, '0')}
              <span className="text-ember">%</span>
            </p>
            <div className="h-px w-56 overflow-hidden bg-line">
              <div className="h-full bg-ember transition-[width] duration-100" style={{ width: `${pct}%` }} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            className="relative flex flex-col items-center gap-10"
            initial={{ opacity: 0, y: 40, rotateX: 25 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, ease: EASE }}
            style={{ perspective: 1200 }}
          >
            <AbilityCard onClick={enter} />
            <button
              type="button"
              onClick={enter}
              className="eyebrow flex items-center gap-3 text-bone transition-colors hover:text-ember"
              data-cursor="hover"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-ember opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-ember" />
              </span>
              Click to enter
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function AbilityCard({ onClick, compact = false }: { onClick?: () => void; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 150, damping: 15 })
  const ry = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 150, damping: 15 })
  const glareX = useTransform(mx, [0, 1], ['0%', '100%'])
  const glareY = useTransform(my, [0, 1], ['0%', '100%'])
  const holoAngle = useTransform([mx, my] as never, ([x, y]: number[]) => `${Math.round((x * 0.6 + y * 0.4) * 360)}deg`)
  const glare = useTransform(
    [glareX, glareY] as never,
    ([x, y]: string[]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.18), transparent 55%)`,
  )

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onPointerMove={(e) => {
        if (!ref.current) return
        const r = ref.current.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width)
        my.set((e.clientY - r.top) / r.height)
      }}
      onPointerLeave={() => {
        mx.set(0.5)
        my.set(0.5)
      }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      className={`relative ${compact ? 'w-[min(78vw,300px)]' : 'w-[min(82vw,340px)]'} aspect-[5/7] select-none rounded-[22px] border border-line bg-gradient-to-br from-ink-3 via-ink-2 to-ink p-6 shadow-[0_40px_120px_-30px_rgba(255,90,54,0.45)] ${onClick ? 'cursor-pointer' : ''}`}
      data-cursor={onClick ? 'hover' : undefined}
    >
      <motion.div aria-hidden className="holo pointer-events-none absolute inset-0 rounded-[inherit] opacity-70" style={{ ['--holo-angle' as string]: holoAngle }} />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glare }} />
      <div className="flex h-full flex-col justify-between" style={{ transform: 'translateZ(40px)' }}>
        <div className="flex items-start justify-between">
          <p className="eyebrow">My ability card</p>
          <span className="eyebrow text-ember">No. 2023</span>
        </div>
        <div className="flex flex-col items-start gap-5">
          <div className="grid size-20 place-items-center rounded-full border border-line bg-ink text-3xl serif-accent text-bone">
            {profile.initials}
          </div>
          <div>
            <p className="display text-4xl">{profile.name}</p>
            <p className="mt-2 text-sm text-mute">{profile.role}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 border-t border-line pt-4 text-xs">
            <div>
              <p className="eyebrow !text-[0.6rem]">College</p>
              <p className="mt-1 text-bone">{profile.college}</p>
            </div>
            <div>
              <p className="eyebrow !text-[0.6rem]">Batch</p>
              <p className="mt-1 text-bone">{profile.batch}</p>
            </div>
          </div>
          <div aria-hidden className="flex h-7 items-end gap-[3px] opacity-60">
            {Array.from({ length: 38 }).map((_, i) => (
              <span
                key={i}
                className="bg-bone"
                style={{ width: i % 3 === 0 ? 3 : 1, height: `${55 + ((i * 37) % 45)}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
