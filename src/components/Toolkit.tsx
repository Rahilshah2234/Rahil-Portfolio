import { Asterisk } from 'lucide-react'
import { projectTech, skillGroups } from '../data/profile'
import { Reveal, SectionHead } from './ui'

export function Toolkit() {
  const all = [...skillGroups.flatMap((g) => g.items), ...projectTech]
  const row = [...all, ...all]

  return (
    <section id="toolkit" className="relative scroll-mt-20 py-28 md:py-40">
      {/* marquee */}
      <div className="relative -rotate-[1.5deg] border-y border-line bg-ink-2 py-5 md:py-7" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
          {row.map((s, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span className={`display text-[clamp(2rem,5vw,4rem)] ${i % 2 ? 'serif-accent text-mute' : ''}`}>{s}</span>
              <Asterisk className="size-7 text-ember" />
            </span>
          ))}
        </div>
      </div>

      <div className="wrap mt-28">
        <SectionHead eyebrow="Skills & technologies" title="The toolkit" accent="I build with." />

        <div className="mt-16 grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, gi) => (
            <Reveal key={g.label} delay={gi * 0.08} y={20} className="h-full">
              <div className="group relative h-full bg-ink p-6 transition-colors duration-500 hover:bg-ink-2 md:p-6">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">{g.label}</p>
                  <span className="font-mono text-xs text-dim">0{gi + 1}</span>
                </div>
                <ul className="mt-8 space-y-1">
                  {g.items.map((s) => (
                    <li key={s} className="display origin-left text-[clamp(1.35rem,2.1vw,1.9rem)] leading-tight transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 hover:scale-[1.08]">
                      {s}
                    </li>
                  ))}
                </ul>
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-ember transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                />
              </div>
            </Reveal>
          ))}

          <Reveal delay={skillGroups.length * 0.08} y={20} className="h-full">
            <div className="group relative h-full bg-ink p-6 transition-colors duration-500 hover:bg-ink-2 md:p-6">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Also in my projects</p>
                <span className="font-mono text-xs text-dim">0{skillGroups.length + 1}</span>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2">
                {projectTech.map((t) => (
                  <li key={t} className="rounded-full border border-line px-3.5 py-1.5 text-sm text-mute transition-colors duration-500 group-hover:border-bone/30 group-hover:text-bone">
                    {t}
                  </li>
                ))}
              </ul>
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-ember transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
