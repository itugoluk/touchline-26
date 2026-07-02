import { motion } from 'framer-motion'
import { Play, FastForward, Trophy, ArrowCounterClockwise } from '@phosphor-icons/react'
import { TEAMS, GROUPS } from '../data/teams'
import { ROUND_LABEL } from '../engine'
import { Flag, Eyebrow, Btn, LatestResults, GoldenBoot } from '../ui'
import Bracket from './Bracket'
import { TableRows } from './Hub'

const STEP_LABEL = {
  MD1: 'Play Matchday 1', MD2: 'Play Matchday 2', MD3: 'Play Matchday 3',
  R32: 'Play the Round of 32', R16: 'Play the Round of 16', QF: 'Play the Quarter-finals',
  SF: 'Play the Semi-finals', F: 'Play the Final',
}

const STEP_STATUS = {
  MD1: 'Group stage · Matchday 1 of 3', MD2: 'Group stage · Matchday 2 of 3', MD3: 'Group stage · Matchday 3 of 3',
  R32: ROUND_LABEL.R32, R16: ROUND_LABEL.R16, QF: ROUND_LABEL.QF, SF: ROUND_LABEL.SF, F: ROUND_LABEL.F,
  DONE: 'Tournament complete',
}

export default function Spectate({ state, onStep, onFinish, onRestart }) {
  const { groupFixtures, rounds, latest, boot, spectateStep, champion } = state
  const inGroup = spectateStep.startsWith('MD')
  const done = spectateStep === 'DONE'
  const champ = champion ? TEAMS[champion] : null

  return (
    <div className="min-h-[100dvh] max-w-[1400px] mx-auto px-4 md:px-10 pt-10 md:pt-14 pb-24">
      <Eyebrow>Spectator mode · {STEP_STATUS[spectateStep]}</Eyebrow>
      <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tighter text-zinc-50">
        {done ? 'The story of the summer.' : 'The tournament runs itself.'}
      </h1>
      <p className="mt-3 text-base text-zinc-400 leading-relaxed max-w-[62ch]">
        {done
          ? 'One hundred and four matches, one champion. The full record is below.'
          : 'No dugout, no pressure. Step through the tournament one round at a time, or fast-forward straight to the final whistle in New Jersey.'}
      </p>

      {done && champ && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          className="mt-8 inline-flex items-center gap-4 border border-gold/30 rounded-xl px-6 py-4 bg-panel"
        >
          <Trophy size={28} weight="duotone" className="text-gold" />
          <Flag team={champ} className="w-9 h-6" />
          <div>
            <p className="text-xl font-black tracking-tight text-zinc-50">{champ.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">World champions · July 19 · MetLife Stadium</p>
          </div>
        </motion.div>
      )}

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-10 items-start">
        <div className="space-y-8">
          {!inGroup && (
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Knockout bracket</p>
              <Bracket rounds={rounds} userId={null} />
            </div>
          )}

          {latest && <LatestResults latest={latest} userId={null} />}

          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">
              {inGroup ? 'Group tables' : 'Group stage — final tables'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(GROUPS).map((g) => (
                <div key={g} className="border border-line rounded-lg overflow-hidden">
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600 px-3 pt-2.5">Group {g}</p>
                  <TableRows g={g} fixtures={groupFixtures} userId={null} compact />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-10 space-y-5">
          {!done ? (
            <div className="border border-gold/25 rounded-xl bg-panel p-6">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-gold mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold live-dot inline-block" />
                Up next
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                {inGroup
                  ? 'Twenty-four matches across twelve groups. Results, tables and the scorer race update as each round is played.'
                  : 'Knockout football. Level after extra time means penalties.'}
              </p>
              <Btn onClick={onStep} className="w-full">
                <Play size={15} weight="fill" />
                {STEP_LABEL[spectateStep]}
              </Btn>
              <Btn onClick={onFinish} variant="ghost" className="w-full mt-2.5">
                <FastForward size={15} weight="fill" />
                Sim to the final
              </Btn>
            </div>
          ) : (
            <div className="border border-line rounded-xl p-6 text-center">
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Fancy taking a team through it yourself next time?
              </p>
              <Btn onClick={onRestart} className="w-full">
                <ArrowCounterClockwise size={15} weight="bold" />
                Back to the start
              </Btn>
            </div>
          )}
          <GoldenBoot boot={boot} n={10} />
        </div>
      </div>
    </div>
  )
}
