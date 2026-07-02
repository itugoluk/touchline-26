import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SoccerBall, Target, Cards, FastForward, Play, Timer } from '@phosphor-icons/react'
import { TEAMS, VENUES, FINAL_VENUE } from '../data/teams'
import {
  simulateSegment, shootout, aiTactics, possessionEstimate,
  FORMATIONS, MENTALITIES, PRESSING, STYLES, ROUND_LABEL,
} from '../engine'
import { Flag, Eyebrow, Btn, Segmented } from '../ui'

const TICK_MS = 95

function aiInMatch(opp, user, oppScore, userScore, minute) {
  const base = aiTactics(opp, user)
  if (minute >= 45 && oppScore < userScore) return { ...base, mentality: 'attacking', pressing: 'high' }
  if (minute >= 60 && oppScore - userScore >= 2) return { ...base, mentality: 'defensive', pressing: 'low', style: 'counter' }
  return base
}

function EventIcon({ type }) {
  if (type === 'goal') return <SoccerBall size={14} weight="fill" className="text-gold" />
  if (type === 'chance') return <Target size={14} className="text-zinc-400" />
  if (type === 'card') return <Cards size={14} weight="fill" className="text-[#d4c05f]" />
  return <Timer size={14} className="text-zinc-500" />
}

function TacticsAdjust({ tactics, setTactics }) {
  const set = (k) => (v) => setTactics({ ...tactics, [k]: v })
  return (
    <div className="space-y-4 text-left">
      {[
        ['formation', 'Formation', Object.keys(FORMATIONS).map((f) => ({ value: f, label: f })), 'grid-cols-5'],
        ['mentality', 'Mentality', Object.entries(MENTALITIES).map(([v, m]) => ({ value: v, label: m.label })), 'grid-cols-3'],
        ['pressing', 'Pressing', Object.entries(PRESSING).map(([v, m]) => ({ value: v, label: m.label })), 'grid-cols-3'],
        ['style', 'Style', Object.entries(STYLES).map(([v, m]) => ({ value: v, label: m.label })), 'grid-cols-3'],
      ].map(([key, label, options, cols]) => (
        <div key={key}>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-1.5">{label}</p>
          <Segmented options={options} value={tactics[key]} onChange={set(key)} cols={cols} />
        </div>
      ))}
    </div>
  )
}

export default function Match({ fixture, stage, userId, initialTactics, onDone }) {
  const home = TEAMS[fixture.home]
  const away = TEAMS[fixture.away]
  const userIsHome = fixture.home === userId
  const user = userIsHome ? home : away
  const opp = userIsHome ? away : home
  const knockout = stage !== 'GROUP'
  const venueRef = useRef(stage === 'F' ? FINAL_VENUE : fixture.venue || VENUES[Math.floor(Math.random() * VENUES.length)])

  const [phase, setPhase] = useState('pre')
  const [clock, setClock] = useState(0)
  const [score, setScore] = useState({ h: 0, a: 0 })
  const [feed, setFeed] = useState([])
  const [tactics, setTactics] = useState(initialTactics)
  const [momentum, setMomentum] = useState(0)
  const [pen, setPen] = useState(null)
  const [penShown, setPenShown] = useState(0)

  const scoreRef = useRef({ h: 0, a: 0 })
  const clockRef = useRef(0)
  const xgRef = useRef({ h: 0, a: 0 })
  const shotsRef = useRef({ h: 0, a: 0 })
  const queueRef = useRef([])
  const segEndRef = useRef(0)
  const timerRef = useRef(null)
  const tacticsRef = useRef(initialTactics)
  tacticsRef.current = tactics

  useEffect(() => () => clearInterval(timerRef.current), [])

  const flushEvent = (e) => {
    if (e.type === 'goal') {
      scoreRef.current = { ...scoreRef.current, [e.side === 'H' ? 'h' : 'a']: scoreRef.current[e.side === 'H' ? 'h' : 'a'] + 1 }
      setScore(scoreRef.current)
      setMomentum((m) => Math.max(-100, Math.min(100, m + (e.side === 'H' ? 34 : -34))))
    }
    if (e.type === 'chance') setMomentum((m) => Math.max(-100, Math.min(100, m + (e.side === 'H' ? 13 : -13))))
    if (e.type === 'goal' || e.type === 'chance') shotsRef.current[e.side === 'H' ? 'h' : 'a']++
    setFeed((f) => [{ ...e, key: `${e.min}-${e.side}-${e.type}-${f.length}` }, ...f])
  }

  const startSegment = (from, to) => {
    const userScore = userIsHome ? scoreRef.current.h : scoreRef.current.a
    const oppScore = userIsHome ? scoreRef.current.a : scoreRef.current.h
    const oppTac = aiInMatch(opp, user, oppScore, userScore, from)
    const tacH = userIsHome ? tacticsRef.current : oppTac
    const tacA = userIsHome ? oppTac : tacticsRef.current
    const seg = simulateSegment(home, away, tacH, tacA, from, to)
    xgRef.current = { h: xgRef.current.h + seg.xgH, a: xgRef.current.a + seg.xgA }
    queueRef.current = [...seg.events]
    segEndRef.current = to
    setPhase('live')
    clockRef.current = from
    setClock(from)
    const startTs = Date.now()
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const target = Math.min(to, from + Math.floor((Date.now() - startTs) / TICK_MS))
      if (target === clockRef.current) return
      const steps = target - clockRef.current
      clockRef.current = target
      while (queueRef.current.length && queueRef.current[0].min <= target) {
        flushEvent(queueRef.current.shift())
      }
      setMomentum((m) => m * Math.pow(0.965, steps))
      setClock(target)
      if (target >= to) {
        clearInterval(timerRef.current)
        setTimeout(() => onSegmentEnd(to), 350)
      }
    }, 50)
  }

  const skip = () => {
    clearInterval(timerRef.current)
    while (queueRef.current.length) flushEvent(queueRef.current.shift())
    clockRef.current = segEndRef.current
    setClock(segEndRef.current)
    onSegmentEnd(segEndRef.current)
  }

  const onSegmentEnd = (end) => {
    const { h, a } = scoreRef.current
    if (end === 45) { setPhase('ht'); return }
    if (end === 70) { setPhase('tac70'); return }
    if (end === 90) {
      if (!knockout || h !== a) { setPhase('ft'); return }
      setPhase('etBreak')
      return
    }
    if (end === 120) {
      if (h !== a) { setPhase('ft'); return }
      const p = shootout(home, away)
      setPen(p)
      setPenShown(0)
      setPhase('shootout')
      let i = 0
      timerRef.current = setInterval(() => {
        i++
        setPenShown(i)
        if (i >= p.kicks.length) {
          clearInterval(timerRef.current)
          setTimeout(() => setPhase('ft'), 900)
        }
      }, 750)
    }
  }

  const winnerId = () => {
    const { h, a } = scoreRef.current
    if (!knockout) return null
    if (h !== a) return h > a ? home.id : away.id
    return pen && pen.h > pen.a ? home.id : away.id
  }

  const finish = () => {
    onDone({
      hs: scoreRef.current.h,
      as: scoreRef.current.a,
      pens: pen ? { h: pen.h, a: pen.a } : null,
      winner: winnerId(),
    })
  }

  const pos = possessionEstimate(home, away, userIsHome ? tactics : aiTactics(home, away), userIsHome ? aiTactics(away, home) : tactics)
  const roundLabel = knockout ? ROUND_LABEL[stage] : `Group ${user.group} · Matchday ${fixture.round}`
  const isLive = phase === 'live'
  const displayMin = clock > 90 ? `${Math.min(clock, 120)}'` : `${Math.min(clock, 90)}'`

  return (
    <div className="min-h-[100dvh] max-w-[1100px] mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-20">
      <div className="text-center">
        <Eyebrow className="!text-zinc-500">{roundLabel} · {venueRef.current}</Eyebrow>
      </div>

      <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
        <div className="flex flex-col items-center md:items-end gap-2 min-w-0">
          <Flag team={home} className="w-14 h-10 md:w-16 md:h-11" />
          <p className={`text-base md:text-xl font-black tracking-tight truncate max-w-full ${home.id === userId ? 'text-gold' : 'text-zinc-100'}`}>{home.name}</p>
        </div>
        <div className="text-center px-2">
          <p className="font-mono text-5xl md:text-7xl font-bold text-zinc-50 tabular whitespace-nowrap">
            {score.h}<span className="text-zinc-600 mx-2">–</span>{score.a}
          </p>
          <p className="mt-2 font-mono text-sm tracking-widest h-5">
            {isLive && (
              <span className="text-gold flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold live-dot inline-block" />
                {displayMin}
              </span>
            )}
            {phase === 'ht' && <span className="text-zinc-400">HALF-TIME</span>}
            {phase === 'tac70' && <span className="text-zinc-400">70' — TACTICS PAUSE</span>}
            {phase === 'etBreak' && <span className="text-zinc-400">FULL-TIME — EXTRA TIME NEXT</span>}
            {phase === 'shootout' && <span className="text-gold">PENALTIES</span>}
            {phase === 'ft' && <span className="text-zinc-400">FULL-TIME{pen ? ` · ${pen.h}–${pen.a} PENS` : ''}</span>}
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start gap-2 min-w-0">
          <Flag team={away} className="w-14 h-10 md:w-16 md:h-11" />
          <p className={`text-base md:text-xl font-black tracking-tight truncate max-w-full ${away.id === userId ? 'text-gold' : 'text-zinc-100'}`}>{away.name}</p>
        </div>
      </div>

      {(isLive || phase === 'ht' || phase === 'tac70') && (
        <div className="mt-8 max-w-[560px] mx-auto">
          <div className="relative h-[3px] bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 bottom-0 bg-gold rounded-full"
              animate={{
                left: momentum >= 0 ? '50%' : `${50 + momentum / 2}%`,
                right: momentum >= 0 ? `${50 - momentum / 2}%` : '50%',
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 26 }}
            />
          </div>
          <div className="flex justify-between mt-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            <span>{home.id} momentum</span>
            <span>{away.id} momentum</span>
          </div>
        </div>
      )}

      <div className="mt-10">
        {phase === 'pre' && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="max-w-[480px] mx-auto text-center">
            <p className="text-sm text-zinc-400 leading-relaxed">
              {opp.name} are expected to line up in a <span className="font-mono text-zinc-200">{aiTactics(opp, user).formation}</span>.
              Your plan: <span className="font-mono text-zinc-200">{tactics.formation}</span>, {MENTALITIES[tactics.mentality].label.toLowerCase()},
              {' '}{PRESSING[tactics.pressing].label.toLowerCase()}, {STYLES[tactics.style].label.toLowerCase()} football.
            </p>
            <Btn onClick={() => startSegment(0, 45)} className="mt-6">
              <Play size={15} weight="fill" /> Kick off
            </Btn>
          </motion.div>
        )}

        {(phase === 'ht' || phase === 'tac70') && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 110, damping: 20 }}
            className="max-w-[520px] mx-auto border border-gold/25 rounded-xl bg-panel p-6"
          >
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-gold mb-4">
              {phase === 'ht' ? 'Half-time team talk' : 'Final half-hour — adjust or hold'}
            </p>
            <TacticsAdjust tactics={tactics} setTactics={setTactics} />
            <Btn onClick={() => startSegment(phase === 'ht' ? 45 : 70, phase === 'ht' ? 70 : 90)} className="mt-6 w-full">
              Send them back out
            </Btn>
          </motion.div>
        )}

        {phase === 'etBreak' && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="max-w-[520px] mx-auto border border-gold/25 rounded-xl bg-panel p-6 text-center">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-gold mb-3">Level after ninety</p>
            <p className="text-sm text-zinc-400 leading-relaxed mb-5">
              Thirty more minutes. Tired legs everywhere — one mistake or one moment wins it.
            </p>
            <TacticsAdjust tactics={tactics} setTactics={setTactics} />
            <Btn onClick={() => startSegment(90, 120)} className="mt-6 w-full">Play extra time</Btn>
          </motion.div>
        )}

        {phase === 'shootout' && pen && (
          <div className="max-w-[520px] mx-auto text-center">
            <div className="space-y-3">
              {['H', 'A'].map((side) => {
                const t = side === 'H' ? home : away
                const shown = pen.kicks.slice(0, penShown).filter((k) => k.team === side)
                return (
                  <div key={side} className="flex items-center gap-3">
                    <Flag team={t} className="w-6 h-4" />
                    <span className="font-mono text-xs text-zinc-400 w-8 text-left">{t.id}</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {shown.map((k, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                          className={`w-3.5 h-3.5 rounded-full ${k.scored ? 'bg-win' : 'bg-loss'}`}
                          title={k.taker}
                        />
                      ))}
                    </div>
                    <span className="ml-auto font-mono text-lg font-bold text-zinc-100 tabular">
                      {shown.filter((k) => k.scored).length}
                    </span>
                  </div>
                )
              })}
            </div>
            {penShown > 0 && penShown <= pen.kicks.length && (
              <p className="mt-4 font-mono text-xs text-zinc-500">
                {pen.kicks[penShown - 1].taker} — {pen.kicks[penShown - 1].scored ? 'scores' : 'MISSES'}
              </p>
            )}
          </div>
        )}

        {phase === 'ft' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-[640px] mx-auto">
            <div className="border border-line rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 gap-y-3 px-6 py-5 text-center bg-panel">
                <p className="font-mono text-sm text-zinc-100 tabular">{xgRef.current.h.toFixed(2)}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 self-center">Expected goals</p>
                <p className="font-mono text-sm text-zinc-100 tabular">{xgRef.current.a.toFixed(2)}</p>
                <p className="font-mono text-sm text-zinc-100 tabular">{shotsRef.current.h}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 self-center">Shots</p>
                <p className="font-mono text-sm text-zinc-100 tabular">{shotsRef.current.a}</p>
                <p className="font-mono text-sm text-zinc-100 tabular">{pos}%</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 self-center">Possession</p>
                <p className="font-mono text-sm text-zinc-100 tabular">{100 - pos}%</p>
              </div>
            </div>
            <div className="text-center">
              <Btn onClick={finish} className="mt-6">Continue</Btn>
            </div>
          </motion.div>
        )}
      </div>

      {(isLive || phase === 'ht' || phase === 'tac70' || phase === 'ft' || phase === 'etBreak') && feed.length > 0 && (
        <div className="mt-10 max-w-[640px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500">Match feed</p>
            {isLive && (
              <button onClick={skip} className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500 hover:text-gold transition-colors cursor-pointer">
                <FastForward size={12} weight="fill" /> Skip
              </button>
            )}
          </div>
          <div className="border-l border-line pl-4 space-y-2.5 max-h-[340px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {feed.map((e) => (
                <motion.div
                  key={e.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                  className="flex items-start gap-2.5 text-[13px]"
                >
                  <span className="font-mono text-[11px] text-zinc-600 w-7 shrink-0 tabular pt-0.5">{e.min}'</span>
                  <span className="pt-0.5 shrink-0"><EventIcon type={e.type} /></span>
                  <span className="text-zinc-400 leading-snug">
                    {e.type === 'goal' && <span className="font-black text-zinc-100 uppercase mr-1.5">Goal!</span>}
                    <span className={`font-bold ${e.side === 'H' ? (home.id === userId ? 'text-gold' : 'text-zinc-200') : (away.id === userId ? 'text-gold' : 'text-zinc-200')}`}>
                      {e.player}
                    </span>{' '}
                    {e.text} <span className="font-mono text-[10px] text-zinc-600">({e.side === 'H' ? home.id : away.id})</span>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
