import { motion } from 'framer-motion'
import { ArrowRight, Star } from '@phosphor-icons/react'
import { TEAMS, overall } from '../data/teams'
import { FORMATIONS, MENTALITIES, PRESSING, STYLES } from '../engine'
import { Flag, Eyebrow, Btn, Segmented, PosBadge } from '../ui'

const COORDS = {
  '4-3-3': [
    [50, 93], [15, 76], [38, 79], [62, 79], [85, 76],
    [30, 56], [50, 62], [70, 56], [18, 30], [50, 23], [82, 30],
  ],
  '4-2-3-1': [
    [50, 93], [15, 76], [38, 79], [62, 79], [85, 76],
    [38, 63], [62, 63], [22, 42], [50, 39], [78, 42], [50, 21],
  ],
  '4-4-2': [
    [50, 93], [15, 76], [38, 79], [62, 79], [85, 76],
    [14, 52], [38, 57], [62, 57], [86, 52], [38, 27], [62, 27],
  ],
  '3-5-2': [
    [50, 93], [28, 79], [50, 82], [72, 79],
    [9, 54], [91, 54], [32, 58], [50, 63], [68, 58], [40, 26], [60, 26],
  ],
  '5-4-1': [
    [50, 93], [10, 71], [30, 80], [50, 82], [70, 80], [90, 71],
    [20, 54], [40, 59], [60, 59], [80, 54], [50, 28],
  ],
}

function Pitch({ formation }) {
  const dots = COORDS[formation]
  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[380px] mx-auto" aria-label={`${formation} formation`}>
      <rect x="1" y="1" width="98" height="98" rx="2" fill="rgba(212,180,95,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />
      <line x1="1" y1="50" x2="99" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />
      <circle cx="50" cy="50" r="9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />
      <rect x="28" y="1" width="44" height="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />
      <rect x="28" y="85" width="44" height="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />
      <rect x="39" y="1" width="22" height="5.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
      <rect x="39" y="93.5" width="22" height="5.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
      {dots.map(([x, y], i) => (
        <motion.circle
          key={i}
          animate={{ cx: x, cy: y }}
          initial={false}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          r={i === 0 ? 2.2 : 2.6}
          fill={i === 0 ? '#3f3f46' : '#d4b45f'}
          stroke="#0b0b0e"
          strokeWidth="0.7"
        />
      ))}
    </svg>
  )
}

function ControlRow({ title, desc, children }) {
  return (
    <div className="py-5 border-t border-line first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <h3 className="text-sm font-black tracking-tight text-zinc-100 uppercase">{title}</h3>
        <p className="text-xs text-zinc-500 text-right leading-snug max-w-[34ch]">{desc}</p>
      </div>
      {children}
    </div>
  )
}

export default function Tactics({ teamId, tactics, setTactics, onConfirm }) {
  const team = TEAMS[teamId]
  const set = (k) => (v) => setTactics({ ...tactics, [k]: v })

  return (
    <div className="min-h-[100dvh] max-w-[1400px] mx-auto px-4 md:px-10 pt-10 md:pt-14 pb-24">
      <Eyebrow>Pre-tournament briefing</Eyebrow>
      <div className="mt-3 flex items-center gap-4 flex-wrap">
        <Flag team={team} className="w-10 h-7" />
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-50">Set up {team.name}.</h1>
      </div>
      <p className="mt-3 text-base text-zinc-400 leading-relaxed max-w-[62ch]">
        This is your default game plan. You can adjust everything at half-time and
        again around the 70th minute of every match, so pick a shape your squad can trust.
      </p>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[4fr_5fr_3fr] gap-10 lg:gap-12 items-start">
        <div className="order-2 lg:order-1">
          <Pitch formation={tactics.formation} />
          <p className="text-center font-mono text-xs text-zinc-500 mt-3 tracking-widest">{tactics.formation}</p>
        </div>

        <div className="order-1 lg:order-2">
          <ControlRow title="Formation" desc={FORMATIONS[tactics.formation].desc}>
            <Segmented
              cols="grid-cols-3 sm:grid-cols-5"
              options={Object.keys(FORMATIONS).map((f) => ({ value: f, label: f }))}
              value={tactics.formation}
              onChange={set('formation')}
            />
          </ControlRow>
          <ControlRow title="Mentality" desc={MENTALITIES[tactics.mentality].desc}>
            <Segmented
              options={Object.entries(MENTALITIES).map(([v, m]) => ({ value: v, label: m.label }))}
              value={tactics.mentality}
              onChange={set('mentality')}
            />
          </ControlRow>
          <ControlRow title="Pressing" desc={PRESSING[tactics.pressing].desc}>
            <Segmented
              options={Object.entries(PRESSING).map(([v, m]) => ({ value: v, label: m.label }))}
              value={tactics.pressing}
              onChange={set('pressing')}
            />
          </ControlRow>
          <ControlRow title="Style" desc={STYLES[tactics.style].desc}>
            <Segmented
              options={Object.entries(STYLES).map(([v, m]) => ({ value: v, label: m.label }))}
              value={tactics.style}
              onChange={set('style')}
            />
          </ControlRow>

          <Btn onClick={onConfirm} className="mt-8 w-full sm:w-auto">
            Confirm and enter the tournament
            <ArrowRight size={16} weight="bold" />
          </Btn>
        </div>

        <div className="order-3 border border-line rounded-xl p-5 bg-panel">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-4">Key players</p>
          <div className="divide-y divide-line">
            {team.players.map((pl) => (
              <div key={pl.n} className="flex items-center gap-3 py-2.5">
                <PosBadge p={pl.p} />
                <span className="text-sm font-bold text-zinc-200 truncate">{pl.n}</span>
                {pl.n === team.star && <Star size={13} weight="fill" className="text-gold ml-auto shrink-0" />}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-line flex justify-between font-mono text-xs text-zinc-500">
            <span>SQUAD RATING</span>
            <span className="text-gold tabular">{overall(team)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
