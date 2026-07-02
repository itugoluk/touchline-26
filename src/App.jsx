import { useReducer } from 'react'
import { TEAMS } from './data/teams'
import {
  DEFAULT_TACTICS, buildGroupFixtures, simulateMatch, qualifiers, buildR32,
  nextRoundFrom, simulateKnockoutFrom, ROUND_ORDER, ROUND_LABEL,
} from './engine'
import { Flag } from './ui'
import NationSelect from './screens/NationSelect'
import Tactics from './screens/Tactics'
import Hub from './screens/Hub'
import Match from './screens/Match'
import End from './screens/End'

const initialState = () => ({
  phase: 'select',
  userId: null,
  tactics: DEFAULT_TACTICS,
  stage: 'GROUP',
  matchday: 1,
  groupFixtures: buildGroupFixtures(),
  rounds: { R32: null, R16: null, QF: null, SF: null, F: null },
  champion: null,
  pending: null,
})

function simTie(t) {
  const r = simulateMatch(t.home, t.away, true)
  return { ...t, played: true, hs: r.hs, as: r.as, pens: r.pens ? { h: r.pens.h, a: r.pens.a } : null, winner: r.winner }
}

function reducer(state, action) {
  switch (action.type) {
    case 'PICK':
      return { ...state, userId: action.id, phase: 'tactics' }
    case 'SET_TACTICS':
      return { ...state, tactics: action.tactics }
    case 'START':
      return { ...state, phase: 'hub' }
    case 'PLAY': {
      if (state.stage === 'GROUP') return { ...state, phase: 'match', pending: { ko: false, fixture: action.fixture } }
      const index = state.rounds[state.stage].findIndex(
        (t) => !t.played && (t.home === state.userId || t.away === state.userId),
      )
      return { ...state, phase: 'match', pending: { ko: true, index, fixture: state.rounds[state.stage][index] } }
    }
    case 'MATCH_DONE': {
      const { hs, as, pens, winner } = action.result
      if (!state.pending.ko) {
        let fixtures = state.groupFixtures.map((f) =>
          f.id === state.pending.fixture.id ? { ...f, played: true, hs, as } : f,
        )
        fixtures = fixtures.map((f) => {
          if (f.round !== state.matchday || f.played) return f
          const r = simulateMatch(f.home, f.away, false)
          return { ...f, played: true, hs: r.hs, as: r.as }
        })
        if (state.matchday < 3) {
          return { ...state, groupFixtures: fixtures, matchday: state.matchday + 1, phase: 'hub', pending: null }
        }
        const r32 = buildR32(qualifiers(fixtures))
        const userIn = r32.some((t) => t.home === state.userId || t.away === state.userId)
        let rounds = { ...state.rounds, R32: r32 }
        if (!userIn) {
          rounds = simulateKnockoutFrom(rounds, 'R32')
          return { ...state, groupFixtures: fixtures, rounds, champion: rounds.F[0].winner, phase: 'over', pending: null }
        }
        return { ...state, groupFixtures: fixtures, rounds, stage: 'R32', matchday: 4, phase: 'hub', pending: null }
      }

      let ties = state.rounds[state.stage].map((t, i) =>
        i === state.pending.index ? { ...t, played: true, hs, as, pens, winner } : t,
      )
      ties = ties.map((t) => (t.played ? t : simTie(t)))
      let rounds = { ...state.rounds, [state.stage]: ties }
      const userWon = winner === state.userId

      if (state.stage === 'F') {
        return { ...state, rounds, champion: ties[0].winner, phase: 'over', pending: null }
      }
      const nextStage = ROUND_ORDER[ROUND_ORDER.indexOf(state.stage) + 1]
      rounds[nextStage] = nextRoundFrom(ties)
      if (!userWon) {
        rounds = simulateKnockoutFrom(rounds, nextStage)
        return { ...state, rounds, champion: rounds.F[0].winner, phase: 'over', pending: null }
      }
      return { ...state, rounds, stage: nextStage, phase: 'hub', pending: null }
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
        </div>
      </header>

      {state.phase === 'select' && <NationSelect onConfirm={(id) => dispatch({ type: 'PICK', id })} />}
      {state.phase === 'tactics' && (
        <Tactics
          teamId={state.userId}
          tactics={state.tactics}
          setTactics={(t) => dispatch({ type: 'SET_TACTICS', tactics: t })}
          onConfirm={() => dispatch({ type: 'START' })}
        />
      )}
      {state.phase === 'hub' && <Hub state={state} onPlay={(fixture) => dispatch({ type: 'PLAY', fixture })} />}
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
        <End
          userId={state.userId}
          champion={state.champion}
          run={buildRun(state)}
          onRestart={() => dispatch({ type: 'RESTART' })}
        />
      )}
    </div>
  )
}
