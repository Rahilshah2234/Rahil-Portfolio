import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { profile, projects, type Project } from '../data/profile'
import { GithubIcon, Reveal, SectionHead } from './ui'

export function Doors() {
  const track = useRef<HTMLDivElement>(null)
  const { scrollXProgress } = useScroll({ container: track })
  const drag = useRef({ down: false, x: 0, left: 0, moved: false })

  const nudge = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(420, el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <section id="work" className="relative scroll-mt-20 py-28 md:py-40">
      <div className="wrap">
        <SectionHead
          eyebrow="My work, one door per project"
          title="Every build sits"
          accent="behind a door."
          aside={
            <div className="flex items-center gap-4">
              <p className="eyebrow hidden sm:block">Swipe along the wall</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Scroll doors left"
                  onClick={() => nudge(-1)}
                  className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:bg-bone hover:text-ink"
                  data-cursor="hover"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll doors right"
                  onClick={() => nudge(1)}
                  className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:bg-bone hover:text-ink"
                  data-cursor="hover"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          }
        />
      </div>

      <Reveal delay={0.1} y={60}>
        <div
          ref={track}
          className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(16px,4vw,48px)] pb-6 scroll-px-[clamp(16px,4vw,48px)] md:gap-7 xl:px-[max(48px,calc((100vw-1440px)/2+48px))] xl:scroll-px-[max(48px,calc((100vw-1440px)/2+48px))]"
          onPointerDown={(e) => {
            if (e.pointerType !== 'mouse' || !track.current) return
            drag.current = { down: true, x: e.clientX, left: track.current.scrollLeft, moved: false }
          }}
          onPointerMove={(e) => {
            const d = drag.current
            if (!d.down || !track.current) return
            const dx = e.clientX - d.x
            if (Math.abs(dx) > 5) d.moved = true
            track.current.scrollLeft = d.left - dx
          }}
          onPointerUp={() => (drag.current.down = false)}
          onPointerLeave={() => (drag.current.down = false)}
          onClickCapture={(e) => {
            if (drag.current.moved) {
              e.stopPropagation()
              e.preventDefault()
              drag.current.moved = false
            }
          }}
        >
          {projects.map((p) => (
            <Door key={p.slug} project={p} />
          ))}
          <GithubDoor />
        </div>
      </Reveal>

      <div className="wrap mt-6 flex items-center gap-4">
        <span className="font-mono text-xs text-dim">01</span>
        <div className="h-px flex-1 overflow-hidden bg-line">
          <motion.div className="h-full origin-left bg-ember" style={{ scaleX: scrollXProgress }} />
        </div>
        <span className="font-mono text-xs text-dim">0{projects.length + 1}</span>
      </div>
    </section>
  )
}

function Door({ project: p }: { project: Project }) {
  return (
    <a
      href={`#/project/${p.slug}`}
      className="group relative w-[78vw] max-w-[360px] shrink-0 snap-start text-left sm:w-[46vw] lg:w-[30vw]"
      style={{ perspective: 1600 }}
      data-cursor="open"
      aria-label={`View ${p.name} project details`}
    >
      {/* frame + inside of the room */}
      <div className="relative aspect-[3/4.6] overflow-hidden rounded-t-[999px] rounded-b-[14px] border border-line bg-ink-2">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: `radial-gradient(70% 55% at 50% 60%, ${p.hue}55, transparent 70%)` }}
        />
        <div className="absolute inset-0 flex flex-col justify-end gap-3 p-6">
          <p className="eyebrow !text-bone/80">{p.kind}</p>
          {!p.status && (
            <ul className="flex flex-wrap gap-1.5">
              {p.tech.slice(0, 4).map((t) => (
                <li key={t} className="rounded-full border border-bone/20 bg-ink/40 px-2.5 py-1 text-[0.7rem] backdrop-blur">
                  {t}
                </li>
              ))}
            </ul>
          )}
          <p className="flex items-center gap-2 text-sm">
            View project <ArrowUpRight className="size-4" />
          </p>
        </div>

        {/* the door leaf, hinged on the left */}
        <div
          className="absolute inset-0 origin-left rounded-[inherit] border border-line bg-gradient-to-b from-ink-3 to-ink-2 transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] [transform-style:preserve-3d] group-hover:[transform:rotateY(-72deg)] group-focus-visible:[transform:rotateY(-72deg)]"
          style={{ boxShadow: 'inset 0 0 0 1px rgb(237 230 220 / 0.04)' }}
        >
          <div className="absolute inset-4 rounded-t-[999px] rounded-b-[8px] border border-line" aria-hidden />
          <div className="absolute inset-0 flex flex-col items-center justify-between p-8 pt-16">
            <span className="font-mono text-sm text-ember">{p.index}</span>
            <span className="display text-center text-[clamp(1.9rem,3vw,2.6rem)] leading-[0.95]">{p.name}</span>
            <span className="eyebrow">{p.date}</span>
          </div>
          <span aria-hidden className="absolute right-6 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-bone/70 shadow-[0_0_12px_rgba(237,230,220,0.6)]" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="text-sm text-mute">{p.short}</p>
        <span className="font-mono text-xs text-dim">{p.year}</span>
      </div>
    </a>
  )
}

function GithubDoor() {
  return (
    <a
      href={profile.github.href}
      target="_blank"
      rel="noreferrer"
      className="group relative w-[78vw] max-w-[360px] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw]"
      data-cursor="hover"
    >
      <div className="relative flex aspect-[3/4.6] flex-col items-center justify-center gap-6 overflow-hidden rounded-t-[999px] rounded-b-[14px] border border-dashed border-bone/25 p-8 text-center transition-colors duration-500 group-hover:border-ember group-hover:bg-ember/5">
        <GithubIcon className="size-10 transition-transform duration-700 group-hover:scale-110" />
        <p className="display text-3xl">
          More on <span className="serif-accent text-ember">GitHub</span>
        </p>
        <p className="flex items-center gap-2 text-sm text-mute">
          Explore more projects <ArrowUpRight className="size-4" />
        </p>
      </div>
      <div className="mt-4 text-sm text-mute">{profile.github.label}</div>
    </a>
  )
}
