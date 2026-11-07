import { motion } from 'framer-motion'
import { Award, Car, Gamepad2, Laptop } from 'lucide-react'
import { certifications, interests } from '../data/profile'
import { EASE, Reveal, SectionHead } from './ui'

export function Certifications() {
  return (
    <section id="certifications" className="relative scroll-mt-20 py-28 md:py-40">
      <div className="wrap">
        <SectionHead eyebrow="Certifications" title="Learning," accent="on the record." />

        <ul className="mt-16 border-t border-line">
          {certifications.map((c, i) => (
            <motion.li
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.06 }}
              className="group relative overflow-hidden border-b border-line"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
              />
              <div className="relative grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 py-7 transition-colors duration-500 group-hover:text-ink md:grid-cols-[4rem_1.6fr_1fr_auto] md:py-9">
                <span className="font-mono text-xs text-dim group-hover:text-ink/60">0{i + 1}</span>
                <h3 className="display text-[clamp(1.6rem,3.2vw,2.8rem)] transition-transform duration-700 ease-[var(--ease-out-expo)] md:group-hover:translate-x-3">
                  {c.title}
                </h3>
                <p className="col-start-2 text-mute group-hover:text-ink/70 md:col-start-auto">{c.topic}</p>
                <p className="col-start-2 eyebrow group-hover:!text-ink md:col-start-auto md:text-right">
                  {c.issuer || 'Certification'}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const interestIcons = { car: Car, gamepad: Gamepad2, laptop: Laptop } as const

export function Beyond() {
  return (
    <section className="relative py-16 md:py-24" aria-labelledby="beyond-title">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-ink-2 p-8 md:p-14">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-ember/15 blur-[90px]" />
            <div className="relative">
              <div className="max-w-3xl">
                <p className="eyebrow flex items-center gap-3">
                  <Award className="size-4 text-ember" /> Interests
                </p>
                <h2 id="beyond-title" className="display mt-6 text-[clamp(2.4rem,6vw,5rem)]">
                  Beyond the <span className="serif-accent text-ember">Code</span>
                </h2>
                <p className="mt-6 text-lg text-mute">
                  A glimpse into the interests and passions that keep me inspired, curious, and balanced beyond development.
                </p>
              </div>
              <ul className="mt-12 grid gap-6 lg:grid-cols-3">
                {interests.map((item) => {
                  const Icon = interestIcons[item.icon]
                  return (
                    <li
                      key={item.title}
                      className="flex h-full flex-col gap-6 rounded-[22px] border border-line bg-ink/40 p-8 transition-colors duration-500 hover:border-bone/40"
                    >
                      <span className="grid size-12 place-items-center rounded-full border border-line text-ember">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <h3 className="display text-3xl">{item.title}</h3>
                      <p className="text-mute">{item.description}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
