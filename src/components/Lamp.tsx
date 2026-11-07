import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls } from 'framer-motion'

// Pull-cord light switch. The cord hangs from the top edge of the hero section and
// bends like a flexible string. Drag the bulb and the cord follows; let go and it
// whips back, then settles. Past the halfway point on release, the page flips theme.
const CORD_REST = 130 // px from the anchor point to the bulb's rest position
const PULL_MAX = 120 // px the bulb can be dragged down
const FLIP_AT = PULL_MAX * 0.5
const CORD_W = 40 // svg width; the cord runs down its centre
const CX = CORD_W / 2

export function Lamp({ className = '' }: { className?: string }) {
  const [light, setLight] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const anchor = useMotionValue(0) // px from the lamp's root up to the top of the section
  const pull = useMotionValue(0) // how far the bulb is dragged down
  const bend = useMotionValue(0) // sideways bend of the cord, in px
  const idle = useRef<AnimationPlaybackControls | null>(null)

  const cordLen = useTransform([anchor, pull], ([a, p]: number[]) => a + CORD_REST + p)
  const cordTop = useTransform(anchor, (a) => -a)
  const cordPath = useTransform([cordLen, bend], ([len, b]: number[]) => {
    const third = len / 3
    return `M ${CX} 0 C ${CX + b} ${third}, ${CX - b} ${third * 2}, ${CX} ${len}`
  })

  useLayoutEffect(() => {
    const measure = () => {
      const root = rootRef.current
      const section = root?.closest('section')
      if (!root || !section) return
      // Layout offsets, not getBoundingClientRect, so transforms from the entrance animation don't skew it.
      let y = 0
      let el: HTMLElement | null = root
      while (el && el !== section) {
        y += el.offsetTop
        el = el.offsetParent as HTMLElement | null
      }
      anchor.set(y)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [anchor])

  // Gentle idle drift so the cord never sits perfectly still.
  useEffect(() => {
    idle.current = animate(bend, [0, 3, 0, -3, 0], { duration: 4.5, repeat: Infinity, ease: 'easeInOut' })
    return () => idle.current?.stop()
  }, [bend])

  useEffect(() => {
    document.documentElement.dataset.theme = light ? 'light' : 'dark'
  }, [light])

  return (
    <motion.div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-label="Pull to switch light and dark theme"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setLight((v) => !v)
        }
      }}
      className={`absolute z-20 h-0 w-6 ${className}`}
    >
      <motion.svg
        aria-hidden
        width={CORD_W}
        height="100%"
        overflow="visible"
        className="pointer-events-none absolute"
        style={{ top: cordTop, left: 12 - CX, height: cordLen, width: CORD_W, overflow: 'visible' }}
      >
        <motion.path d={cordPath} fill="none" stroke="rgb(237 230 220 / 0.6)" strokeWidth={2} strokeLinecap="round" />
      </motion.svg>
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: PULL_MAX }}
        dragElastic={0.04}
        dragSnapToOrigin
        dragMomentum={false}
        onDragStart={() => {
          idle.current?.stop()
        }}
        onDrag={(_, info) => bend.set(Math.max(-26, Math.min(26, info.offset.x * 0.6)))}
        onDragEnd={() => {
          if (pull.get() > FLIP_AT) setLight((v) => !v)
          // Whip back and forth, then let the idle drift take over.
          animate(bend, [18, -14, 9, -5, 2, 0], { duration: 1.8, ease: 'easeOut' }).then(() => {
            idle.current = animate(bend, [0, 3, 0, -3, 0], { duration: 4.5, repeat: Infinity, ease: 'easeInOut' })
          })
        }}
        style={{ y: pull, top: CORD_REST }}
        className="absolute left-1/2 -translate-x-1/2 cursor-grab touch-none active:cursor-grabbing"
        data-cursor="hover"
      >
        <div
          className="h-[30px] w-[22px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)]"
          style={{ background: 'radial-gradient(circle at 35% 30%, #b98456, #6b3f1e 70%)' }}
        />
      </motion.div>
    </motion.div>
  )
}
