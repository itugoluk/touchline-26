import { TEAMS } from '../data/teams'
import { ROUND_ORDER, ROUND_LABEL } from '../engine'
import { Flag } from '../ui'

function TieCard({ tie, userId }) {
  if (!tie) {
    return <div className="border border-dashed border-white/10 rounded-md h-[62px] w-[168px]" />
  }
  const rows = [
    { id: tie.home, score: tie.hs, pens: tie.pens?.h },
    { id: tie.away, score: tie.as, pens: tie.pens?.a },
  ]
  const involved = tie.home === userId || tie.away === userId
  return (
    <div className={`border rounded-md w-[168px] divide-y divide-line overflow-hidden shrink-0 ${involved ? 'border-gold/50 bg-gold/5' : 'border-line bg-panel'}`}>
      {rows.map(({ id, score, pens }, i) => {
        const t = id ? TEAMS[id] : null
        const winner = tie.played && tie.winner === id
        const loser = tie.played && tie.winner && tie.winner !== id
        return (
          <div key={i} className="flex items-center gap-2 px-2.5 py-1.5">
            {t ? (
              <>
                <Flag team={t} className="w-5 h-3.5" />
                <span className={`text-xs font-bold flex-1 truncate ${id === userId ? 'text-gold' : loser ? 'text-zinc-600' : 'text-zinc-200'}`}>
                  {t.id}
                </span>
                <span className={`font-mono text-xs tabular ${winner ? 'text-gold font-bold' : 'text-zinc-500'}`}>
                  {tie.played ? score : ''}
                  {tie.played && pens != null ? <span className="text-[10px] text-zinc-600"> ({pens})</span> : ''}
                </span>
              </>
            ) : (
              <span className="text-xs text-zinc-700 font-mono">TBD</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Bracket({ rounds, userId }) {
  return (
    <div className="overflow-x-auto pb-3 -mx-1 px-1">
      <div className="flex gap-6 min-w-max">
        {ROUND_ORDER.map((r) => {
          const ties = rounds[r] || []
          const slots = { R32: 16, R16: 8, QF: 4, SF: 2, F: 1 }[r]
          return (
            <div key={r} className="flex flex-col">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600 mb-3">{ROUND_LABEL[r]}</p>
              <div className="flex flex-col justify-around gap-2 flex-1">
                {Array.from({ length: slots }).map((_, i) => (
                  <TieCard key={i} tie={ties[i]} userId={userId} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
