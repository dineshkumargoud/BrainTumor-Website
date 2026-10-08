import { BrainCircuit, Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  ['Analysis', '#analysis'],
  ['How it works', '#workflow'],
  ['Model', '#model'],
  ['Research', '#research'],
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="page-shell flex h-16 items-center justify-between">
        <a className="flex items-center gap-3 text-slate-950" href="#home" aria-label="NeuroScope home">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-mint">
            <BrainCircuit size={21} aria-hidden="true" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">NeuroScope</span>
          <span className="hidden border-l border-slate-300 pl-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 sm:block">Research AI</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <a key={href} className="text-sm font-semibold text-slate-600 transition hover:text-teal" href={href}>{label}</a>
          ))}
          <a className="button-primary py-2.5" href="#analysis">Analyze MRI</a>
        </nav>

        <button className="grid h-10 w-10 place-items-center text-slate-700 md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="page-shell grid gap-1 border-t border-slate-200 py-3 md:hidden" aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <a key={href} className="rounded-lg px-3 py-3 font-semibold text-slate-700 hover:bg-slate-100" href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
      )}
    </header>
  )
}

