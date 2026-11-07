import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/** Dot + trailing ring. Grows over links, turns into an "Open" badge over doors. Fine pointers only. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<'default' | 'hover' | 'open'>('default')
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 })

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    document.body.classList.add('has-cursor')
    const modeAt = (el: Element | null) => {
      const t = el?.closest('[data-cursor], a, button, input, textarea') as HTMLElement | null
      const m = t?.dataset.cursor
      setMode(m === 'open' ? 'open' : t ? 'hover' : 'default')
    }
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      modeAt(e.target as Element | null)
    }
    // content moves under a still pointer while scrolling or when a modal closes
    const recheck = () => modeAt(document.elementFromPoint(x.get(), y.get()))
    window.addEventListener('scroll', recheck, { passive: true })
    const onClick = () => window.setTimeout(recheck, 50)
    window.addEventListener('click', onClick)
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', recheck)
      window.removeEventListener('click', onClick)
      document.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  const size = mode === 'open' ? 88 : mode === 'hover' ? 56 : 34

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] grid place-items-center rounded-full border mix-blend-difference"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: mode === 'open' ? 'rgba(237,230,220,1)' : 'rgba(237,230,220,0)',
          borderColor: 'rgba(237,230,220,0.6)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {mode === 'open' && <span className="eyebrow !text-ink !text-[0.65rem]">Open</span>}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] size-1.5 rounded-full bg-bone mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible && mode === 'default' ? 1 : 0 }}
      />
    </>
  )
}
