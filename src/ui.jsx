import { flagUrl } from './data/teams'

export function Flag({ team, className = 'w-8 h-6' }) {
  return (
    <img
      src={flagUrl(team)}
      alt={`${team.name} flag`}
      loading="lazy"
      className={`${className} object-cover rounded-[3px] ring-1 ring-white/15 shrink-0`}
    />
  )
}

export function Eyebrow({ children, className = '' }) {
  return (
    <p className={`font-mono text-[11px] tracking-[0.22em] uppercase text-gold ${className}`}>{children}</p>
  )
}

export function Btn({ children, onClick, variant = 'primary', className = '', disabled }) {
  const base =
    'inline-flex items-center justify-center gap-2 font-bold tracking-tight transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer'
  const variants = {
    primary: 'bg-gold text-ink hover:bg-[#e2c672] px-7 py-3.5 rounded-lg text-sm',
    ghost: 'border border-line text-zinc-300 hover:border-gold/60 hover:text-gold px-6 py-3 rounded-lg text-sm',
    subtle: 'text-zinc-400 hover:text-zinc-100 px-3 py-2 text-sm',
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

export function RatingBar({ label, value, accent = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 font-mono text-[11px] uppercase text-zinc-500">{label}</span>
      <div className="flex-1 h-[3px] bg-white/8 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${accent ? 'bg-gold' : 'bg-zinc-400'}`}
          style={{ width: `${Math.max(4, ((value - 55) / 45) * 100)}%` }}
        />
      </div>
      <span className="w-7 text-right font-mono text-xs text-zinc-300 tabular">{value}</span>
    </div>
  )
}

export function Segmented({ options, value, onChange, cols }) {
  return (
    <div className={`grid gap-1.5 ${cols || 'grid-cols-3'}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-2.5 rounded-md text-[13px] font-bold tracking-tight transition-all duration-200 active:scale-[0.98] cursor-pointer ${
            value === opt.value
              ? 'bg-gold text-ink'
              : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function PosBadge({ p }) {
  const tone = p === 'FW' ? 'text-gold border-gold/40' : p === 'MF' ? 'text-zinc-300 border-white/20' : 'text-zinc-500 border-white/12'
  return (
    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${tone}`}>{p}</span>
  )
}
