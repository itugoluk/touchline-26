import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, CaretDown, CaretUp } from '@phosphor-icons/react'
import { TEAMS, GROUPS, overall } from '../data/teams'
import { groupTable, ROUND_LABEL, aiTactics } from '../engine'
import { Flag, Eyebrow, Btn, RatingBar } from '../ui'
import Bracket from './Bracket'

function TableRows({ g, fixtures, userId, compact = false }) {
  const rows = groupTable(g, fixtures)
  return (
    <div className="divide-y divide-line">
      <div className={`grid ${compact ? 'grid-cols-[1fr_repeat(3,1.6rem)]' : 'grid-cols-[1.4rem_1fr_repeat(5,2rem)_2.4rem]'} gap-1 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600`}>
        {!compact && <span />}
        <span>Team</span>
        {!compact && <span className="text-center">P</span>}
        {!compact && <span className="text-center">W</span>}
        {!compact && <span className="text-center">D</span>}
        {!compact && <span className="text-center">L</span>}
        {compact && <span className="text-center">P</span>}
        <span className="text-center">GD</span>
        <span className="text-center">Pts</span>
      </div>
      {rows.map((r, i) => {
        const t = TEAMS[r.id]
        const mine = r.id === userId
        return (
          <div
            key={r.id}
            className={`grid ${compact ? 'grid-cols-[1fr_repeat(3,1.6rem)]' : 'grid-cols-[1.4rem_1fr_repeat(5,2rem)_2.4rem]'} gap-1 items-center px-3 py-2 ${mine ? 'bg-gold/8' : ''}`}
          >
            {!compact && <span className={`font-mono text-[11px] tabular ${i < 2 ? 'text-gold' : 'text-zinc-600'}`}>{i + 1}</span>}
            <span className="flex items-center gap-2 min-w-0">
              <Flag team={t} className={compact ? 'w-5 h-3.5' : 'w-6 h-4'} />
              <span className={`truncate font-bold ${compact ? 'text-xs' : 'text-sm'} ${mine ? 'text-gold' : 'text-zinc-200'}`}>
                {compact ? t.id : t.name}
              </span>
            </span>
            {!compact && <span className="text-center font-mono text-xs text-zinc-400 tabular">{r.p}</span>}
            {!compact && <span className="text-center font-mono text-xs text-zinc-400 tabular">{r.w}</span>}
            {!compact && <span className="text-center font-mono text-xs text-zinc-400 tabular">{r.d}</span>}
            {!compact && <span className="text-center font-mono text-xs text-zinc-400 tabular">{r.l}</span>}
            {compact && <span className="text-center font-mono text-xs text-zinc-400 tabular">{r.p}</span>}
            <span className="text-center font-mono text-xs text-zinc-400 tabular">{r.gf - r.ga > 0 ? '+' : ''}{r.gf - r.ga}</span>
            <span className="text-center font-mono text-xs font-bold text-zinc-100 tabular">{r.pts}</span>
          </div>
        )
      })}
    </div>
  )
}

function FixtureRow({ f, userId }) {
  const h = TEAMS[f.home]
  const a = TEAMS[f.away]
  const involved = f.home === userId || f.away === userId
  return (
    <div className={`flex items-center gap-2 px-3 py-2.5 ${involved ? 'bg-gold/6' : ''}`}>
      <span className="font-mono text-[10px] text-zinc-600 w-8 shrink-0">MD{f.round}</span>
      <span className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
        <span className={`text-[13px] font-bold truncate ${f.home === userId ? 'text-gold' : 'text-zinc-300'}`}>{h.id}</span>
        <Flag team={h} className="w-5 h-3.5" />
      </span>
      <span className="font-mono text-xs tabular w-12 text-center shrink-0">
        {f.played ? <span className="text-zinc-100 font-bold">{f.hs}–{f.as}</span> : <span className="text-zinc-600">vs</span>}
      </span>
      <span className="flex items-center gap-1.5 flex-1 min-w-0">
        <Flag team={a} className="w-5 h-3.5" />
        <span className={`text-[13px] font-bold truncate ${f.away === userId ? 'text-gold' : 'text-zinc-300'}`}>{a.id}</span>
      </span>
    </div>
  )
}

function Scouting({ opp, user }) {
  const oppTac = aiTactics(opp, user)
  return (
    <div>
      <div className="flex items-center gap-3">
        <Flag team={opp} className="w-10 h-7" />
        <div className="min-w-0">
          <p className="text-lg font-black tracking-tight text-zinc-50 truncate">{opp.name}</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            World No. {opp.rank} · OVR {overall(opp)}
          </p>
        </div>
      </div>
      <p className="mt-3 text-[13px] text-zinc-400 leading-relaxed">{opp.style}</p>
      <div className="mt-4 space-y-2">
        <RatingBar label="ATT" value={opp.att} />
        <RatingBar label="MID" value={opp.mid} />
        <RatingBar label="DEF" value={opp.def} />
      </div>
      <div className="mt-4 pt-3 border-t border-line grid grid-cols-2 gap-y-1.5 text-xs">
        <span className="text-zinc-500">Danger man</span>
        <span className="text-zinc-200 font-bold text-right truncate">{opp.star}</span>
        <span className="text-zinc-500">Likely shape</span>
        <span className="font-mono text-zinc-200 text-right">{oppTac.formation}</span>
        <span className="text-zinc-500">Likely approach</span>
        <span className="text-zinc-200 font-bold text-right capitalize">{oppTac.mentality}</span>
      </div>
    </div>
  )
}

export default function Hub({ state, onPlay }) {
  const { userId, stage, matchday, groupFixtures, rounds } = state
  const user = TEAMS[userId]
  const [showGroups, setShowGroups] = useState(false)
  const inGroup = stage === 'GROUP'

  let nextFixture = null
  let opp = null
  if (inGroup) {
    nextFixture = groupFixtures.find(
      (f) => f.round === matchday && !f.played && (f.home === userId || f.away === userId),
    )
  } else {
    nextFixture = rounds[stage]?.find((t) => !t.played && (t.home === userId || t.away === userId))
  }
  if (nextFixture) opp = TEAMS[nextFixture.home === userId ? nextFixture.away : nextFixture.home]

  const record = { w: 0, d: 0, l: 0 }
  for (const f of groupFixtures) {
    if (!f.played || (f.home !== userId && f.away !== userId)) continue
    const mine = f.home === userId ? f.hs : f.as
    const theirs = f.home === userId ? f.as : f.hs
    if (mine > theirs) record.w++
    else if (mine === theirs) record.d++
    else record.l++
  }
  for (const r of Object.values(rounds)) {
    for (const t of r || []) {
      if (!t.played || (t.home !== userId && t.away !== userId)) continue
      if (t.winner === userId) record.w++
      else record.l++
    }
  }

  return (
    <div className="min-h-[100dvh] max-w-[1400px] mx-auto px-4 md:px-10 pt-10 md:pt-14 pb-24">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <Eyebrow>{inGroup ? `Group ${user.group} · Matchday ${matchday} of 3` : ROUND_LABEL[stage]}</Eyebrow>
          <div className="mt-3 flex items-center gap-4">
            <Flag team={user} className="w-11 h-8" />
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-50">{user.name}</h1>
          </div>
        </div>
        <p className="font-mono text-xs text-zinc-500 tracking-wider">
          CAMPAIGN <span className="text-win">{record.w}W</span> · <span className="text-zinc-300">{record.d}D</span> · <span className="text-loss">{record.l}L</span>
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-10 items-start">
        <div>
          {inGroup ? (
            <>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Group {user.group} standings</p>
              <div className="border border-line rounded-lg overflow-hidden">
                <TableRows g={user.group} fixtures={groupFixtures} userId={userId} />
              </div>
              <p className="mt-2 font-mono text-[10px] text-zinc-600">
                Top two qualify. The eight best third-placed sides also reach the round of 32.
              </p>

              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mt-8 mb-3">Group {user.group} fixtures</p>
              <div className="border border-line rounded-lg divide-y divide-line overflow-hidden">
                {groupFixtures.filter((f) => f.group === user.group).map((f) => (
                  <FixtureRow key={f.id} f={f} userId={userId} />
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Knockout bracket</p>
              <Bracket rounds={rounds} userId={userId} />
            </>
          )}

          <button
            onClick={() => setShowGroups((s) => !s)}
            className="mt-8 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 hover:text-gold transition-colors cursor-pointer"
          >
            {showGroups ? <CaretUp size={12} /> : <CaretDown size={12} />}
            {inGroup ? 'Around the tournament — all groups' : 'Group stage — final tables'}
          </button>
          {showGroups && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {Object.keys(GROUPS).map((g) => (
                <div key={g} className="border border-line rounded-lg overflow-hidden">
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600 px-3 pt-2.5">Group {g}</p>
                  <TableRows g={g} fixtures={groupFixtures} userId={userId} compact />
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="lg:sticky lg:top-10">
          {nextFixture && opp ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 110, damping: 20 }}
              className="border border-gold/25 rounded-xl bg-panel p-6"
            >
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-gold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold live-dot inline-block" />
                Next match · {inGroup ? `Matchday ${matchday}` : ROUND_LABEL[stage]}
              </p>
              <Scouting opp={opp} user={user} />
              <Btn onClick={() => onPlay(nextFixture)} className="mt-6 w-full">
                <Play size={15} weight="fill" />
                Go to the touchline
              </Btn>
            </motion.div>
          ) : (
            <div className="border border-dashed border-white/12 rounded-xl p-6 text-sm text-zinc-500">
              No fixture scheduled. Advance the tournament from the main panel.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
