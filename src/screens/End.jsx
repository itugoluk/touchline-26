import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, ArrowCounterClockwise, CaretDown, CaretUp } from '@phosphor-icons/react'
import { TEAMS, GROUPS } from '../data/teams'
import { expectation, achievedIndex, verdict } from '../engine'
import { Flag, Eyebrow, Btn, GoldenBoot } from '../ui'
import Bracket from './Bracket'
import { TableRows } from './Hub'

export default function End({ state, run, onRestart }) {
  const { userId, champion, rounds, groupFixtures, boot } = state
  const user = TEAMS[userId]
  const champ = TEAMS[champion]
  const won = champion === userId
  const [showTables, setShowTables] = useState(false)

  const exp = expectation(user)
  const achieved = achievedIndex(userId, rounds, champion)
  const board = verdict(exp, achieved, userId)
  const verdictTone = { gold: 'border-gold/40 text-gold', good: 'border-win/40 text-win', even: 'border-white/20 text-zinc-300', bad: 'border-loss/40 text-loss' }[board.tone]

  return (
    <div className="min-h-[100dvh] max-w-[1100px] mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 18 }}
      >
        {won ? (
          <div className="relative">
            <div
              aria-hidden
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-[380px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(212,180,95,0.14), transparent 65%)' }}
            />
            <div className="relative text-center">
              <Trophy size={56} weight="duotone" className="text-gold mx-auto" />
              <Eyebrow className="mt-6">July 19, 2026 · MetLife Stadium</Eyebrow>
              <h1 className="mt-4 text-5xl md:text-7xl font-black tracking-tighter leading-none text-zinc-50">
                <span className="text-gold">{user.name}</span>
                <br />
                are world champions.
              </h1>
              <p className="mt-6 text-base text-zinc-400 leading-relaxed max-w-[52ch] mx-auto">
                Seven matches. Every tactical call was yours. The first 48-team World Cup
                belongs to {user.name} — and to the manager who never blinked.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Flag team={user} className="w-16 h-11 mx-auto" />
            <Eyebrow className="mt-6">Campaign over</Eyebrow>
            <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tighter leading-none text-zinc-50">
              The run ends here.
            </h1>
            <p className="mt-5 text-base text-zinc-400 leading-relaxed max-w-[52ch] mx-auto">
              {user.name} go home while the tournament rolls on. When the dust settled at
              MetLife on July 19, <span className="text-zinc-100 font-bold">{champ.name}</span> lifted the trophy.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 border border-line rounded-lg px-5 py-3">
              <Trophy size={18} className="text-gold" weight="fill" />
              <Flag team={champ} className="w-7 h-5" />
              <span className="font-bold text-zinc-100">{champ.name}</span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">Champions</span>
            </div>
          </div>
        )}

        <div className={`mt-10 max-w-[640px] mx-auto border rounded-xl px-6 py-5 ${verdictTone}`}>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2 opacity-80">The board's verdict</p>
          <p className="text-sm leading-relaxed text-zinc-300">{board.text}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-10 items-start">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Your campaign</p>
            <div className="border border-line rounded-xl divide-y divide-line overflow-hidden">
              {run.map((m, i) => {
                const opp = TEAMS[m.opp]
                const tone = m.result === 'W' ? 'text-win' : m.result === 'D' ? 'text-zinc-400' : 'text-loss'
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 120, damping: 20 }}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600 w-24 shrink-0">{m.label}</span>
                    <Flag team={opp} className="w-6 h-4" />
                    <span className="text-sm font-bold text-zinc-200 flex-1 truncate">{opp.name}</span>
                    <span className="font-mono text-sm text-zinc-100 tabular">
                      {m.mine}–{m.theirs}
                      {m.pens && <span className="text-[10px] text-zinc-500 ml-1">({m.pens.mine}–{m.pens.theirs} p)</span>}
                    </span>
                    <span className={`font-mono text-xs font-bold w-4 text-right ${tone}`}>{m.result}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
          <GoldenBoot boot={boot} n={10} title="Golden Boot — final standings" />
        </div>

        <div className="mt-14">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">How the tournament unfolded</p>
          <Bracket rounds={rounds} userId={userId} />
        </div>

        <button
          onClick={() => setShowTables((s) => !s)}
          className="mt-8 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 hover:text-gold transition-colors cursor-pointer"
        >
          {showTables ? <CaretUp size={12} /> : <CaretDown size={12} />}
          Group stage — final tables
        </button>
        {showTables && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {Object.keys(GROUPS).map((g) => (
              <div key={g} className="border border-line rounded-lg overflow-hidden">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600 px-3 pt-2.5">Group {g}</p>
                <TableRows g={g} fixtures={groupFixtures} userId={userId} compact />
              </div>
            ))}
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Btn onClick={onRestart} variant={won ? 'ghost' : 'primary'}>
            <ArrowCounterClockwise size={15} weight="bold" />
            Start another campaign
          </Btn>
        </div>
      </motion.div>
    </div>
  )
}
