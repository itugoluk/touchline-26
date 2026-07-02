import { TEAMS, flagUrl } from './data/teams'
import { bootTable } from './engine'

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

export function OddsBar({ odds, home, away }) {
  return (
    <div>
      <div className="flex h-[6px] rounded-full overflow-hidden gap-px">
        <div className="bg-gold/80 rounded-l-full" style={{ width: `${odds.h}%` }} />
        <div className="bg-zinc-600" style={{ width: `${odds.d}%` }} />
        <div className="bg-zinc-400 rounded-r-full" style={{ width: `${odds.a}%` }} />
      </div>
      <div className="flex justify-between mt-1.5 font-mono text-[10px] text-zinc-500 tabular">
        <span><span className="text-gold">{home.id}</span> {odds.h}%</span>
        <span>Draw {odds.d}%</span>
        <span>{away.id} {odds.a}%</span>
      </div>
    </div>
  )
}

export function ResultRow({ m, userId, dense = false }) {
  const h = TEAMS[m.home]
  const a = TEAMS[m.away]
  return (
    <div className={`flex items-center gap-2 ${dense ? 'py-1.5' : 'px-3 py-2'} ${m.home === userId || m.away === userId ? 'bg-gold/6' : ''}`}>
      <span className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
        <span className={`text-xs font-bold ${m.home === userId ? 'text-gold' : m.winner && m.winner !== m.home ? 'text-zinc-500' : 'text-zinc-300'}`}>{h.id}</span>
        <Flag team={h} className="w-5 h-3.5" />
      </span>
      <span className="font-mono text-xs tabular text-center shrink-0 w-14 text-zinc-100 font-bold">
        {m.hs}–{m.as}
        {m.pens && <span className="text-[9px] text-zinc-500 block leading-tight">{m.pens.h}–{m.pens.a} pens</span>}
      </span>
      <span className="flex items-center gap-1.5 flex-1 min-w-0">
        <Flag team={a} className="w-5 h-3.5" />
        <span className={`text-xs font-bold ${m.away === userId ? 'text-gold' : m.winner && m.winner !== m.away ? 'text-zinc-500' : 'text-zinc-300'}`}>{a.id}</span>
      </span>
    </div>
  )
}

export function LatestResults({ latest, userId }) {
  if (!latest || latest.matches.length === 0) return null
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">{latest.label}</p>
      <div className="border border-line rounded-lg divide-y divide-line overflow-hidden grid grid-cols-1 sm:grid-cols-2 sm:divide-y-0">
        {latest.matches.map((m, i) => (
          <div key={i} className="sm:border-b sm:border-line flex items-center">
            {m.group && <span className="font-mono text-[10px] text-zinc-600 pl-3 w-7 shrink-0">{m.group}</span>}
            <div className="flex-1"><ResultRow m={m} userId={userId} /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function GoldenBoot({ boot, n = 8, title = 'Golden Boot race' }) {
  const rows = bootTable(boot, n)
  if (rows.length === 0) {
    return (
      <div className="border border-dashed border-white/12 rounded-xl p-5">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-2">{title}</p>
        <p className="text-xs text-zinc-600 leading-relaxed">No goals yet. The race starts with the first whistle.</p>
      </div>
    )
  }
  return (
    <div className="border border-line rounded-xl p-5 bg-panel">
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">{title}</p>
      <div className="divide-y divide-line">
        {rows.map((r, i) => (
          <div key={`${r.team}:${r.player}`} className="flex items-center gap-2.5 py-2">
            <span className="font-mono text-[10px] text-zinc-600 w-4 tabular">{i + 1}</span>
            <Flag team={TEAMS[r.team]} className="w-5 h-3.5" />
            <span className="text-[13px] font-bold text-zinc-200 flex-1 truncate">{r.player}</span>
            <span className={`font-mono text-sm tabular font-bold ${i === 0 ? 'text-gold' : 'text-zinc-400'}`}>{r.goals}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
