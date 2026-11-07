import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { projects } from '../data/profile'
import { GithubIcon, PillButton, Reveal } from './ui'

export function ProjectPage({ slug }: { slug: string }) {
  const index = projects.findIndex((p) => p.slug === slug)
  const p = projects[index]

  if (!p) {
    return (
      <section className="wrap pb-32 pt-40">
        <p className="eyebrow">Project not found</p>
        <a href="#work" className="mt-6 inline-flex items-center gap-2 text-mute hover:text-bone">
          <ArrowLeft className="size-4" /> Back to all projects
        </a>
      </section>
    )
  }

  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  return (
    <article className="pb-24 pt-32 md:pt-40">
      <div className="wrap">
        <a
          href="#work"
          className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-bone"
          data-cursor="hover"
        >
          <ArrowLeft className="size-4" /> All projects
        </a>

        <header className="mt-12">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-ember" aria-hidden />
              <span className="text-ember">{p.index}</span> · {p.kind}
            </p>
          </Reveal>
          <h1 className="display mt-6 text-[clamp(2.8rem,8vw,7rem)]">{p.name}</h1>
          <p className="mt-6 max-w-2xl text-lg text-mute">{p.short}</p>
          {p.status && <p className="mt-4 max-w-2xl text-sm text-dim">{p.status}</p>}
        </header>

        <div className="mt-12 flex flex-wrap gap-4">
          <PillButton href={p.repo} external>
            <GithubIcon /> GitHub Repository <ArrowUpRight className="size-4" />
          </PillButton>
        </div>

        <dl className="mt-14 grid gap-6 border-y border-line py-6 sm:grid-cols-3">
          <div>
            <dt className="eyebrow">Category</dt>
            <dd className="mt-2">{p.category}</dd>
          </div>
          <div>
            <dt className="eyebrow">Type</dt>
            <dd className="mt-2">{p.kind}</dd>
          </div>
          <div>
            <dt className="eyebrow">Date</dt>
            <dd className="mt-2">{p.date}</dd>
          </div>
        </dl>

        <section className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="eyebrow">Overview</h2>
            <p className="mt-5 text-lg leading-relaxed">{p.overview}</p>
          </div>
          <div>
            <h2 className="eyebrow">Problem statement</h2>
            <p className="mt-5 text-lg leading-relaxed">{p.problem}</p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="eyebrow">{p.featuresHeading ?? 'Key features'}</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {p.features.map((f, i) => (
              <li key={f} className="flex gap-5 py-4 text-lg">
                <span className="font-mono text-xs text-dim pt-2">0{i + 1}</span>
                {f}
              </li>
            ))}
          </ul>
        </section>

        {p.tech.length > 0 && (
          <section className="mt-16">
            <h2 className="eyebrow">{p.techHeading ?? 'Technologies used'}</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <li key={t} className="rounded-full border border-line px-4 py-2 text-sm">
                  {t}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-16">
          <h2 className="eyebrow">My role</h2>
          <p className="mt-6 text-lg text-bone">{p.role}</p>
        </section>

        <nav className="mt-24 grid gap-4 border-t border-line pt-10 sm:grid-cols-2" aria-label="Other projects">
          <a href={`#/project/${prev.slug}`} className="group flex flex-col gap-2 rounded-2xl border border-line p-6 transition-colors hover:border-bone/40" data-cursor="hover">
            <span className="eyebrow flex items-center gap-2">
              <ArrowLeft className="size-3.5" /> Previous project
            </span>
            <span className="display text-2xl">{prev.name}</span>
          </a>
          <a href={`#/project/${next.slug}`} className="group flex flex-col items-end gap-2 rounded-2xl border border-line p-6 text-right transition-colors hover:border-bone/40" data-cursor="hover">
            <span className="eyebrow flex items-center gap-2">
              Next project <ArrowRight className="size-3.5" />
            </span>
            <span className="display text-2xl">{next.name}</span>
          </a>
        </nav>
      </div>
    </article>
  )
}
