import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Trophy, MapPin } from '@phosphor-icons/react'
import { TEAMS, GROUPS, overall } from '../data/teams'
import { Flag, Eyebrow, Btn, RatingBar } from '../ui'

const CITIES = [
  'New York', 'Los Angeles', 'Mexico City', 'Toronto', 'Dallas', 'Atlanta', 'Guadalajara',
  'Vancouver', 'Miami', 'Houston', 'Boston', 'Philadelphia', 'Seattle', 'San Francisco',
  'Kansas City', 'Monterrey',
]

function Marquee() {
  const items = [...CITIES, ...CITIES]
  return (
    <div className="relative overflow-hidden border-b border-line py-2.5 select-none">
      <div className="marquee-track gap-10">
        {items.map((c, i) => (
          <span key={i} className="flex items-center gap-10 font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-600 whitespace-nowrap">
            {c}
            <span className="w-1 h-1 rounded-full bg-gold/50 inline-block" />
          </span>
        ))}
      </div>
    </div>
  )
}

function GroupBlock({ letter, selected, onSelect, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.05 }}
    >
      <p className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 mb-2 uppercase">Group {letter}</p>
      <div className="border border-line rounded-lg divide-y divide-line overflow-hidden">
        {GROUPS[letter].map((id) => {
          const t = TEAMS[id]
          const active = selected === id
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-all duration-200 cursor-pointer ${
                active ? 'bg-gold/10 border-l-2 border-l-gold' : 'border-l-2 border-l-transparent hover:bg-white/[0.04]'
              }`}
            >
              <Flag team={t} className="w-7 h-5" />
              <span className={`flex-1 text-sm font-bold tracking-tight truncate ${active ? 'text-gold' : 'text-zinc-200'}`}>
                {t.name}
              </span>
              <span className="font-mono text-[11px] text-zinc-600 tabular">#{t.rank}</span>
              <span className={`font-mono text-xs tabular w-6 text-right ${active ? 'text-gold' : 'text-zinc-400'}`}>
                {overall(t)}
              </span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function NationSelect({ onConfirm }) {
  const [selected, setSelected] = useState(null)
  const team = selected ? TEAMS[selected] : null

  return (
    <div className="min-h-[100dvh]">
      <Marquee />
      <div className="relative max-w-[1400px] mx-auto px-4 md:px-10 pt-10 md:pt-16 pb-24">
        <span
          aria-hidden
          className="hidden lg:block absolute -top-6 right-0 font-black text-[22rem] leading-none tracking-tighter text-transparent select-none pointer-events-none"
          style={{ WebkitTextStroke: '1px rgba(212,180,95,0.09)' }}
        >
          26
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <Eyebrow>FIFA World Cup 2026 · Canada / Mexico / United States</Eyebrow>
            <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tighter leading-none text-zinc-50">
              Pick a nation.
              <br />
              <span className="text-gold">Run the summer.</span>
            </h1>
            <p className="mt-5 text-base text-zinc-400 leading-relaxed max-w-[52ch]">
              Forty-eight nations, twelve groups, one trophy in New Jersey on July 19.
              Take charge of any squad from the real 2026 draw and make every tactical
              call from the group stage to the final.
            </p>

            <div className="mt-10 min-h-[300px]">
              {!team ? (
                <div className="border border-dashed border-white/12 rounded-xl p-8 flex flex-col items-start gap-3">
                  <Trophy size={28} className="text-zinc-600" weight="duotone" />
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-[36ch]">
                    Select a nation from the draw to see their squad profile, world
                    ranking and route through the tournament.
                  </p>
                </div>
              ) : (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  className="border border-gold/25 rounded-xl p-6 md:p-7 bg-panel"
                >
                  <div className="flex items-center gap-4">
                    <Flag team={team} className="w-14 h-10" />
                    <div className="min-w-0">
                      <h2 className="text-2xl font-black tracking-tighter text-zinc-50 truncate">{team.name}</h2>
                      <p className="font-mono text-[11px] text-zinc-500 tracking-wider uppercase mt-0.5">
                        {team.confed} · World No. {team.rank} · Group {team.group}
                        {team.host ? ' · Host' : ''}
                      </p>
                    </div>
                    <span className="ml-auto font-mono text-3xl font-bold text-gold tabular">{overall(team)}</span>
                  </div>

                  <p className="mt-4 text-sm text-zinc-400 leading-relaxed">{team.style}</p>

                  <div className="mt-5 space-y-2.5">
                    <RatingBar label="ATT" value={team.att} accent />
                    <RatingBar label="MID" value={team.mid} />
                    <RatingBar label="DEF" value={team.def} />
                  </div>

                  <div className="mt-5 pt-4 border-t border-line flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-gold" />
                    <span className="text-zinc-500">Talisman</span>
                    <span className="font-bold text-zinc-200">{team.star}</span>
                  </div>

                  <Btn onClick={() => onConfirm(team.id)} className="mt-6 w-full">
                    Take charge of {team.name}
                    <ArrowRight size={16} weight="bold" />
                  </Btn>
                </motion.div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            {Object.keys(GROUPS).map((g, i) => (
              <GroupBlock key={g} letter={g} index={i} selected={selected} onSelect={setSelected} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
