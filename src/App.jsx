import { useReducer } from 'react'
import { TEAMS } from './data/teams'
import {
  DEFAULT_TACTICS, buildGroupFixtures, simulateGroupRound, qualifiers, buildR32,
  nextRoundFrom, simulateRound, simulateKnockoutFrom, addGoals,
  ROUND_ORDER, ROUND_LABEL,
} from './engine'
import { Flag } from './ui'
import NationSelect from './screens/NationSelect'
import Tactics from './screens/Tactics'
import Hub from './screens/Hub'
import Match from './screens/Match'
import Spectate from './screens/Spectate'
import End from './screens/End'

const initialState = () => ({
  phase: 'select',
  mode: 'manager',
  userId: null,
  tactics: DEFAULT_TACTICS,
  stage: 'GROUP',
  matchday: 1,
  groupFixtures: buildGroupFixtures(),
  rounds: { R32: null, R16: null, QF: null, SF: null, F: null },
  champion: null,
  pending: null,
  boot: {},
  latest: null, // { label, matches: [{home, away, hs, as, pens, group?}] }
  spectateStep: 'MD1',
})

function latestFromFixtures(fixtures, round) {
  return {
    label: `Matchday ${round} — around the groups`,
    matches: fixtures.filter((f) => f.round === round).map((f) => ({ ...f })),
  }
}

function latestFromTies(ties, stage) {
  return {
    label: `${ROUND_LABEL[stage]} — all results`,
    matches: ties.map((t) => ({ ...t })),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'PICK':
      return { ...state, userId: action.id, phase: 'tactics' }
    case 'SET_TACTICS':
      return { ...state, tactics: action.tactics }
    case 'START':
      return { ...state, phase: 'hub' }
    case 'SPECTATE':
      return { ...state, mode: 'spectate', phase: 'spectate' }
    case 'PLAY': {
      if (state.stage === 'GROUP') return { ...state, phase: 'match', pending: { ko: false, fixture: action.fixture } }
      const index = state.rounds[state.stage].findIndex(
        (t) => !t.played && (t.home === state.userId || t.away === state.userId),
      )
      return { ...state, phase: 'match', pending: { ko: true, index, fixture: state.rounds[state.stage][index] } }
    }
    case 'MATCH_DONE': {
      const { hs, as, pens, winner, scorers } = action.result
      let boot = addGoals(state.boot, scorers || [])

      if (!state.pending.ko) {
        let fixtures = state.groupFixtures.map((f) =>
          f.id === state.pending.fixture.id ? { ...f, played: true, hs, as } : f,
        )
        const sim = simulateGroupRound(fixtures, state.matchday)
        fixtures = sim.fixtures
        boot = addGoals(boot, sim.scorers)
        const latest = latestFromFixtures(fixtures, state.matchday)
        if (state.matchday < 3) {
          return { ...state, groupFixtures: fixtures, boot, latest, matchday: state.matchday + 1, phase: 'hub', pending: null }
        }
        const r32 = buildR32(qualifiers(fixtures))
        const userIn = r32.some((t) => t.home === state.userId || t.away === state.userId)
        let rounds = { ...state.rounds, R32: r32 }
        if (!userIn) {
          const done = simulateKnockoutFrom(rounds, 'R32')
          boot = addGoals(boot, done.scorers)
          return { ...state, groupFixtures: fixtures, boot, latest, rounds: done.rounds, champion: done.rounds.F[0].winner, phase: 'over', pending: null }
        }
        return { ...state, groupFixtures: fixtures, boot, latest, rounds, stage: 'R32', matchday: 4, phase: 'hub', pending: null }
      }

      let ties = state.rounds[state.stage].map((t, i) =>
        i === state.pending.index ? { ...t, played: true, hs, as, pens, winner } : t,
      )
      const simmed = simulateRound(ties)
      ties = simmed.ties
      boot = addGoals(boot, simmed.scorers)
      let rounds = { ...state.rounds, [state.stage]: ties }
      const latest = latestFromTies(ties, state.stage)
      const userWon = winner === state.userId

      if (state.stage === 'F') {
        return { ...state, rounds, boot, latest, champion: ties[0].winner, phase: 'over', pending: null }
      }
      const nextStage = ROUND_ORDER[ROUND_ORDER.indexOf(state.stage) + 1]
      rounds[nextStage] = nextRoundFrom(ties)
      if (!userWon) {
        const done = simulateKnockoutFrom(rounds, nextStage)
        boot = addGoals(boot, done.scorers)
        return { ...state, rounds: done.rounds, boot, latest, champion: done.rounds.F[0].winner, phase: 'over', pending: null }
      }
      return { ...state, rounds, boot, latest, stage: nextStage, phase: 'hub', pending: null }
    }
    case 'SPECTATE_STEP': {
      let s = state
      const step = s.spectateStep
      if (step === 'DONE') return s
      let boot = s.boot
      if (step.startsWith('MD')) {
        const round = Number(step[2])
        const sim = simulateGroupRound(s.groupFixtures, round)
        boot = addGoals(boot, sim.scorers)
        const latest = latestFromFixtures(sim.fixtures, round)
        if (round < 3) {
          return { ...s, groupFixtures: sim.fixtures, boot, latest, spectateStep: `MD${round + 1}` }
        }
        const r32 = buildR32(qualifiers(sim.fixtures))
        return {
          ...s, groupFixtures: sim.fixtures, boot, latest, stage: 'R32',
          rounds: { ...s.rounds, R32: r32 }, spectateStep: 'R32',
        }
      }
      const r = simulateRound(s.rounds[step])
      boot = addGoals(boot, r.scorers)
      let rounds = { ...s.rounds, [step]: r.ties }
      const latest = latestFromTies(r.ties, step)
      if (step === 'F') {
        return { ...s, rounds, boot, latest, champion: r.ties[0].winner, spectateStep: 'DONE' }
      }
      const nextStage = ROUND_ORDER[ROUND_ORDER.indexOf(step) + 1]
      rounds[nextStage] = nextRoundFrom(r.ties)
      return { ...s, rounds, boot, latest, stage: nextStage, spectateStep: nextStage }
    }
    case 'SPECTATE_ALL': {
      let s = state
      let guard = 0
      while (s.spectateStep !== 'DONE' && guard++ < 12) {
        s = reducer(s, { type: 'SPECTATE_STEP' })
      }
      return s
    }
    case 'RESTART':
      return initialState()
    default:
      return state
  }
}

function buildRun(state) {
  const run = []
  for (const f of state.groupFixtures) {
    if (!f.played || (f.home !== state.userId && f.away !== state.userId)) continue
    const isHome = f.home === state.userId
    const mine = isHome ? f.hs : f.as
    const theirs = isHome ? f.as : f.hs
    run.push({
      label: `Matchday ${f.round}`,
      opp: isHome ? f.away : f.home,
      mine, theirs, pens: null,
      result: mine > theirs ? 'W' : mine === theirs ? 'D' : 'L',
    })
  }
  for (const st of ROUND_ORDER) {
    for (const t of state.rounds[st] || []) {
      if (!t.played || (t.home !== state.userId && t.away !== state.userId)) continue
      const isHome = t.home === state.userId
      const mine = isHome ? t.hs : t.as
      const theirs = isHome ? t.as : t.hs
      run.push({
        label: ROUND_LABEL[st],
        opp: isHome ? t.away : t.home,
        mine, theirs,
        pens: t.pens ? { mine: isHome ? t.pens.h : t.pens.a, theirs: isHome ? t.pens.a : t.pens.h } : null,
        result: t.winner === state.userId ? 'W' : 'L',
      })
    }
  }
  return run
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const user = state.userId ? TEAMS[state.userId] : null

  return (
    <div className="min-h-[100dvh] bg-ink">
      <div className="grain" />
      <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 h-12 flex items-center justify-between">
          <button
            onClick={() => state.phase !== 'match' && dispatch({ type: 'RESTART' })}
            className="font-mono text-xs font-bold tracking-[0.25em] text-zinc-100 cursor-pointer"
          >
            TOUCHLINE<span className="text-gold">'26</span>
          </button>
          {user && (
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hidden sm:inline">Managing</span>
              <Flag team={user} className="w-6 h-4" />
              <span className="text-xs font-bold text-zinc-200">{user.name}</span>
            </div>
          )}
          {state.mode === 'spectate' && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Spectator mode</span>
          )}
        </div>
      </header>

      {state.phase === 'select' && (
        <NationSelect
          onConfirm={(id) => dispatch({ type: 'PICK', id })}
          onSpectate={() => dispatch({ type: 'SPECTATE' })}
        />
      )}
      {state.phase === 'tactics' && (
        <Tactics
          teamId={state.userId}
          tactics={state.tactics}
          setTactics={(t) => dispatch({ type: 'SET_TACTICS', tactics: t })}
          onConfirm={() => dispatch({ type: 'START' })}
        />
      )}
      {state.phase === 'hub' && <Hub state={state} onPlay={(fixture) => dispatch({ type: 'PLAY', fixture })} />}
      {state.phase === 'spectate' && (
        <Spectate
          state={state}
          onStep={() => dispatch({ type: 'SPECTATE_STEP' })}
          onFinish={() => dispatch({ type: 'SPECTATE_ALL' })}
          onRestart={() => dispatch({ type: 'RESTART' })}
        />
      )}
      {state.phase === 'match' && (
        <Match
          key={`${state.stage}-${state.matchday}-${state.pending?.fixture?.id ?? state.pending?.index}`}
          fixture={state.pending.fixture}
          stage={state.stage}
          userId={state.userId}
          initialTactics={state.tactics}
          onDone={(result) => dispatch({ type: 'MATCH_DONE', result })}
        />
      )}
      {state.phase === 'over' && (
        <End state={state} run={buildRun(state)} onRestart={() => dispatch({ type: 'RESTART' })} />
      )}
    </div>
  )
}
