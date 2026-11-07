import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Check, Copy, Mail, X } from 'lucide-react'
import { nav, profile, projects } from '../data/profile'
import { EASE, GithubIcon, LinkedinIcon, LiveDot, PillButton, SplitWords, useContact, useLocalTime } from './ui'

// Paste your Formspree form endpoint here, e.g. 'https://formspree.io/f/abcd1234'.
// Until it is set, the form shows an honest "not connected" message and sends nothing.
const FORM_ENDPOINT = 'https://formspree.io/f/mbggezky'

type Fields = { name: string; email: string; subject: string; message: string }
type FieldKey = keyof Fields
const emptyFields: Fields = { name: '', email: '', subject: '', message: '' }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(f: Fields): Partial<Record<FieldKey, string>> {
  const e: Partial<Record<FieldKey, string>> = {}
  if (!f.name.trim()) e.name = 'Please enter your name.'
  if (!f.email.trim()) e.email = 'Please enter your email address.'
  else if (!emailPattern.test(f.email.trim())) e.email = 'That email address does not look right.'
  if (!f.subject.trim()) e.subject = 'Please add a subject.'
  if (!f.message.trim()) e.message = 'Please write a message.'
  return e
}

const formField =
  'w-full border-b border-line bg-transparent py-3 text-lg text-bone placeholder:text-dim outline-none transition-colors focus:border-ember'

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(emptyFields)
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [notConnected, setNotConnected] = useState(false)
  const busy = useRef(false)

  const set = (k: FieldKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (busy.current) return
    const found = validate(fields)
    setErrors(found)
    if (Object.keys(found).length) return

    busy.current = true
    setStatus('sending')
    setNotConnected(false)
    try {
      if (!FORM_ENDPOINT) {
        setNotConnected(true)
        throw new Error('not-configured')
      }
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          subject: fields.subject.trim(),
          message: fields.message.trim(),
        }),
      })
      if (!res.ok) throw new Error(`status-${res.status}`)
      setFields(emptyFields)
      setStatus('sent')
    } catch {
      setStatus('error')
    } finally {
      busy.current = false
    }
  }

  const fieldError = (k: FieldKey) =>
    errors[k] ? (
      <p id={`contact-${k}-error`} className="mt-2 text-sm text-ember">
        {errors[k]}
      </p>
    ) : null

  return (
    <form id="contact-form" noValidate onSubmit={submit} className="mx-auto mb-[70vh] mt-16 max-w-xl scroll-mt-24 text-left" aria-label="Contact form">
      <div className="grid gap-7 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow">Name</span>
          <input
            name="name"
            autoComplete="name"
            placeholder="Your name"
            className={formField}
            value={fields.name}
            onChange={set('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
          />
          {fieldError('name')}
        </label>
        <label className="block">
          <span className="eyebrow">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={formField}
            value={fields.email}
            onChange={set('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
          />
          {fieldError('email')}
        </label>
      </div>
      <label className="mt-7 block">
        <span className="eyebrow">Subject</span>
        <input
          name="subject"
          placeholder="What is this about?"
          className={formField}
          value={fields.subject}
          onChange={set('subject')}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
        />
        {fieldError('subject')}
      </label>
      <label className="mt-7 block">
        <span className="eyebrow">Message</span>
        <textarea
          name="message"
          rows={4}
          placeholder="What would you like to talk about?"
          className={`${formField} resize-none`}
          value={fields.message}
          onChange={set('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {fieldError('message')}
      </label>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-bone py-4 font-medium text-ink transition-colors duration-500 hover:bg-ember disabled:cursor-wait disabled:opacity-60"
        data-cursor="hover"
      >
        {status === 'sending' ? (
          'Sending…'
        ) : (
          <>
            Send message <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
          </>
        )}
      </button>

      <div aria-live="polite" className="mt-5 text-center text-sm">
        {status === 'sent' && <p className="text-[#7fd68c]">Thanks, your message was sent.</p>}
        {status === 'error' && (
          <p className="text-ember">
            {notConnected ? 'The form is not connected yet, so nothing was sent. ' : 'Your message was not sent. Please try again. '}
            You can also write to{' '}
            <a href={`mailto:${profile.email}`} className="text-bone underline decoration-line underline-offset-4 hover:decoration-ember">
              {profile.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  )
}

export function CallToAction() {
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden py-32 md:py-48">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/15 blur-[140px]" />
      <div className="wrap relative text-center">
        <p className="eyebrow inline-flex items-center gap-3">
          <LiveDot /> Eager to gain real-world experience
        </p>
        <h2 className="display mt-8 text-[clamp(3rem,10vw,10rem)]">
          <span className="block">
            <SplitWords text="Got an opportunity?" />
          </span>
          <span className="serif-accent block text-ember">
            <SplitWords text="Let's build it together." delay={0.2} />
          </span>
        </h2>
        <p className="mx-auto mt-8 max-w-lg text-lg text-mute">
          Have a role, a project or a question about my work? Write to me, here or on LinkedIn.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <PillButton href="#contact-form">
            Start a conversation <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
          </PillButton>
          <PillButton href={profile.linkedin.href} variant="ghost" external>
            <LinkedinIcon /> LinkedIn
          </PillButton>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}

export function Footer() {
  const time = useLocalTime()
  const { open } = useContact()
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-line pt-20">
      <div className="wrap">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="display text-4xl" data-cursor="hover">
              {profile.name}
            </a>
            <p className="mt-4 max-w-xs text-mute">{profile.role} at {profile.college}.</p>
            <div className="mt-6 flex gap-2">
              <a href={profile.github.href} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:bg-bone hover:text-ink" data-cursor="hover">
                <GithubIcon />
              </a>
              <a href={profile.linkedin.href} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:bg-bone hover:text-ink" data-cursor="hover">
                <LinkedinIcon />
              </a>
              <a href={`mailto:${profile.email}`} aria-label="Email" className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:bg-bone hover:text-ink" data-cursor="hover">
                <Mail className="size-4" />
              </a>
            </div>
          </div>
          <FooterCol title="Work">
            {projects.map((p) => (
              <li key={p.slug}>
                <a href="#work" className="hover:text-ember" data-cursor="hover">{p.name}</a>
              </li>
            ))}
          </FooterCol>
          <FooterCol title="Navigate">
            <li><a href="#top" className="hover:text-ember" data-cursor="hover">Home</a></li>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-ember" data-cursor="hover">{n.label}</a>
              </li>
            ))}
            <li>
              <button type="button" onClick={open} className="hover:text-ember" data-cursor="hover">Contact</button>
            </li>
          </FooterCol>
          <FooterCol title="Status">
            <li className="flex items-center gap-2.5"><LiveDot /> Eager to learn</li>
            <li>B.Tech, {profile.batch}</li>
            <li className="font-mono text-sm tabular-nums">{profile.city} · {time} IST</li>
          </FooterCol>
        </div>

        <p aria-hidden className="display mt-24 select-none whitespace-nowrap text-center text-[clamp(4rem,19vw,19rem)] leading-[0.8] text-bone/[0.06]">
          Rahil Shah
        </p>

        <div className="flex flex-col gap-4 border-t border-line py-8 text-sm text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {profile.name}. All rights reserved.</p>
          <a href="#top" className="group flex items-center gap-2 text-bone" data-cursor="hover">
            Back to top <ArrowUp className="size-4 transition-transform duration-500 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow">{title}</h3>
      <ul className="mt-6 space-y-3">{children}</ul>
    </div>
  )
}

export function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [stage, setStage] = useState<'form' | 'sent'>('form')
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    if (!isOpen) return
    setStage('form')
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = `Hello Rahil, from ${form.name}`
    const body = `${form.message}\n\n${form.name}\n${form.email}`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStage('sent')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked: the address is visible on screen */
    }
  }

  const field =
    'w-full border-b border-line bg-transparent py-3 text-lg text-bone placeholder:text-dim outline-none transition-colors focus:border-ember'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-end justify-center md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
        >
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            className="relative max-h-[94svh] w-full max-w-xl overflow-y-auto rounded-t-[28px] border border-line bg-ink-2 p-6 sm:p-10 md:rounded-[28px]"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close contact form"
              className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-line transition-colors hover:bg-bone hover:text-ink"
              data-cursor="hover"
            >
              <X className="size-4" />
            </button>

            <AnimatePresence mode="wait">
              {stage === 'form' ? (
                <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
                  <p className="eyebrow">Contact</p>
                  <h2 id="contact-title" className="display mt-4 text-5xl">
                    Say <span className="serif-accent text-ember">hello.</span>
                  </h2>
                  <div className="mt-10 space-y-7">
                    <label className="block">
                      <span className="eyebrow">Name</span>
                      <input required autoFocus className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" autoComplete="name" />
                    </label>
                    <label className="block">
                      <span className="eyebrow">Email</span>
                      <input required type="email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" autoComplete="email" />
                    </label>
                    <label className="block">
                      <span className="eyebrow">Message</span>
                      <textarea required rows={4} className={`${field} resize-none`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What would you like to talk about?" />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="group mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-bone py-4 font-medium text-ink transition-colors duration-500 hover:bg-ember"
                    data-cursor="hover"
                  >
                    Write the email <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                  </button>
                  <p className="mt-5 text-center text-sm text-mute">
                    Or write directly to{' '}
                    <a href={`mailto:${profile.email}`} className="text-bone underline decoration-line underline-offset-4 hover:decoration-ember">
                      {profile.email}
                    </a>
                  </p>
                </motion.form>
              ) : (
                <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-6">
                  <div className="grid size-14 place-items-center rounded-full bg-ember text-ink">
                    <Mail className="size-6" />
                  </div>
                  <h2 id="contact-title" className="display mt-8 text-5xl">
                    Almost <span className="serif-accent text-ember">there.</span>
                  </h2>
                  <p className="mt-5 text-lg text-mute">
                    Your email app should have opened with the message ready. Hit send there and it reaches me.
                  </p>
                  <p className="mt-6 text-mute">Nothing opened? Copy the address instead:</p>
                  <button
                    type="button"
                    onClick={copy}
                    className="mt-3 flex w-full items-center justify-between rounded-2xl border border-line px-5 py-4 text-left transition-colors hover:border-bone/40"
                    data-cursor="hover"
                  >
                    <span className="truncate">{profile.email}</span>
                    {copied ? <Check className="size-4 text-[#7fd68c]" /> : <Copy className="size-4" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
