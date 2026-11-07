import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { story } from '../data/profile'
import { Reveal, SectionHead } from './ui'

const years = Array.from(new Set(story.map((s) => s.year)))

/**
 * "Let's go back in time." Desktop: the section pins and the timeline slides
 * sideways as you scroll, with a year strip and a 01/06 counter.
 * Mobile: a plain vertical timeline.
 */
export function Story() {
  const pin = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${((story.length - 1) / story.length) * 100}%`])
  const [idx, setIdx] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setIdx(Math.min(story.length - 1, Math.max(0, Math.round(v * (story.length - 1)))))
  })
  const activeYear = story[idx].year

  return (
    <section id="story" className="relative scroll-mt-20 pt-28 md:pt-40">
      <div className="wrap">
        <SectionHead
          eyebrow="My story"
          title="My"
          accent="Journey"
          aside={
            <p className="max-w-xs text-mute">
              From school in Chandwad to engineering at KKWIEER, and the projects built along the way.
            </p>
          }
        />
      </div>

      {/* desktop: pinned horizontal timeline */}
      <div ref={pin} className="relative hidden md:block" style={{ height: `${story.length * 70}vh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div className="wrap">
            <div className="flex items-end justify-between border-b border-line pb-6">
              <div className="flex gap-[clamp(1rem,3vw,3rem)]" aria-hidden>
                {years.map((y) => (
                  <span
                    key={y}
                    className={`display font-mono text-[clamp(2rem,4.5vw,4.5rem)] tabular-nums transition-colors duration-500 ${
                      y === activeYear ? 'text-bone' : 'text-bone/10'
                    }`}
                  >
                    {y}
                  </span>
                ))}
              </div>
              <p className="font-mono text-sm tabular-nums">
                <span className="text-ember">{story[idx].index}</span>
                <span className="text-dim">/ {String(story.length).padStart(2, '0')}</span>
              </p>
            </div>
          </div>

          <div className="mt-14 overflow-visible">
            <motion.ol
              className="flex"
              style={{ x, width: `${story.length * 100}%` }}
            >
              {story.map((s, i) => (
                <li key={s.index} className="shrink-0" style={{ width: `${100 / story.length}%` }}>
                  <div className="wrap"><div
                    className={`grid grid-cols-[auto_1fr] gap-x-10 transition-opacity duration-500 ${i === idx ? 'opacity-100' : 'opacity-25'}`}
                  >
                    <span className="font-mono text-sm text-ember">{s.index}</span>
                    <div>
                      <p className="eyebrow">{s.date}</p>
                      <h3 className="display mt-5 max-w-4xl text-[clamp(2.6rem,5.5vw,5.5rem)]">{s.title}</h3>
                      <p className="serif-accent mt-5 text-[clamp(1.4rem,2.2vw,2rem)] text-mute">{s.place}</p>
                      {s.detail.map((d) => (
                        <p key={d} className="mt-6 max-w-xl text-lg text-bone/80">
                          {d}
                        </p>
                      ))}
                    </div>
                  </div></div>
                </li>
              ))}
            </motion.ol>
          </div>

          <div className="wrap mt-14">
            <div className="h-px w-full bg-line">
              <motion.div className="h-px origin-left bg-ember" style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        </div>
      </div>

      {/* mobile: vertical timeline */}
      <ol className="wrap mt-14 md:hidden">
        {story.map((s) => (
          <li key={s.index} className="relative border-l border-line pb-12 pl-7 last:pb-0">
            <span className="absolute -left-[5px] top-1.5 size-[9px] rounded-full bg-ember" aria-hidden />
            <Reveal y={20}>
              <p className="eyebrow">
                <span className="text-ember">{s.index}</span> · {s.date}
              </p>
              <h3 className="display mt-3 text-[2.1rem]">{s.title}</h3>
              <p className="serif-accent mt-2 text-xl text-mute">{s.place}</p>
              {s.detail.map((d) => (
                <p key={d} className="mt-3 text-bone/80">
                  {d}
                </p>
              ))}
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
