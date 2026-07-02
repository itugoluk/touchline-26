import { TEAMS, GROUPS, VENUES, overall } from './data/teams.js'

export const FORMATIONS = {
  '4-3-3': { att: 1.06, def: 0.98, edgeOver: '4-4-2', desc: 'Width and front-foot pressure. Stretches flat midfields.' },
  '4-2-3-1': { att: 1.02, def: 1.02, edgeOver: '5-4-1', desc: 'A double pivot plus a free ten. Patient and balanced, unpicks low blocks.' },
  '4-4-2': { att: 1.04, def: 1.0, edgeOver: '4-2-3-1', desc: 'Two strikers, direct play. Overruns single-pivot systems.' },
  '3-5-2': { att: 1.03, def: 1.01, edgeOver: '4-3-3', desc: 'Midfield overload with wing-backs. Outnumbers a front three centrally.' },
  '5-4-1': { att: 0.9, def: 1.1, edgeOver: '3-5-2', desc: 'A fortress. Concedes territory, frustrates overloads, lives on counters.' },
}

export const MENTALITIES = {
  defensive: { fw: 0.8, ag: 0.8, label: 'Defensive', desc: 'Protect the result. Fewer chances at both ends.' },
  balanced: { fw: 1.0, ag: 1.0, label: 'Balanced', desc: 'Take the game as it comes.' },
  attacking: { fw: 1.18, ag: 1.2, label: 'Attacking', desc: 'Commit bodies forward. More chances, more exposure.' },
}

export const PRESSING = {
  low: { fw: 0.95, ag: 0.92, late: 1.0, label: 'Low Block', desc: 'Sit off, stay compact, deny space in behind.' },
  mid: { fw: 1.0, ag: 1.0, late: 1.0, label: 'Mid Press', desc: 'Standard engagement in the middle third.' },
  high: { fw: 1.08, ag: 1.0, late: 1.16, label: 'High Press', desc: 'Win the ball high. Costs legs after the 70th minute.' },
}

export const STYLES = {
  possession: { label: 'Possession', desc: 'Starve the opponent of the ball. Strongest with a superior midfield.' },
  counter: { label: 'Counter', desc: 'Absorb and break. Punishes teams that overcommit.' },
  direct: { label: 'Direct', desc: 'Fast, vertical, chaotic. Raises the tempo for both sides.' },
}

export const FOCUS = {
  talisman: { label: 'Through the talisman', desc: 'Everything runs through your star. He scores more and lifts the team against weaker sides, but stronger opponents will mark him out of it.' },
  collective: { label: 'Share the load', desc: 'No single reference point. Goals spread across the team, no swing either way.' },
}

export const DEFAULT_TACTICS = {
  formation: '4-3-3', mentality: 'balanced', pressing: 'mid', style: 'possession',
  focus: 'collective', taker: null,
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const rnd = () => Math.random()
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export function aiTactics(team, opp) {
  const mine = (team.att + team.mid + team.def) / 3
  const theirs = (opp.att + opp.mid + opp.def) / 3
  const gap = mine - theirs
  const focus = team.att >= team.mid + 3 ? 'talisman' : 'collective'
  if (gap > 6) return { formation: '4-3-3', mentality: 'attacking', pressing: 'high', style: 'possession', focus, taker: null }
  if (gap < -8) return { formation: '5-4-1', mentality: 'defensive', pressing: 'low', style: 'counter', focus, taker: null }
  if (gap < -3) return { formation: '4-2-3-1', mentality: 'balanced', pressing: 'low', style: 'counter', focus, taker: null }
  return { formation: pick(['4-3-3', '4-2-3-1', '3-5-2']), mentality: 'balanced', pressing: 'mid', style: pick(['possession', 'direct']), focus, taker: null }
}

// Expected goals per 90 for one side, given both teams and both tactic sets.
export function computeXg(team, opp, tac, oppTac) {
  const f = FORMATIONS[tac.formation]
  const of = FORMATIONS[oppTac.formation]
  const m = MENTALITIES[tac.mentality]
  const om = MENTALITIES[oppTac.mentality]
  const p = PRESSING[tac.pressing]
  const op = PRESSING[oppTac.pressing]

  const attackPower = (team.att * 0.62 + team.mid * 0.38) * f.att
  const defensePower = (opp.def * 0.62 + opp.mid * 0.38) * of.def

  let xg = 1.28 + (attackPower - defensePower) * 0.052
  xg = clamp(xg, 0.22, 3.8)

  xg *= m.fw * om.ag
  xg *= p.fw * op.ag

  if (f.edgeOver === oppTac.formation) xg *= 1.05
  if (of.edgeOver === tac.formation) xg *= 0.95

  if (tac.style === 'possession' && team.mid >= opp.mid) xg *= 1.04
  if (tac.style === 'counter') xg *= oppTac.mentality === 'attacking' ? 1.16 : 0.94
  if (tac.style === 'direct') xg *= 1.05
  if (oppTac.style === 'possession' && opp.mid >= team.mid) xg *= 0.88
  if (oppTac.style === 'direct') xg *= 1.04

  if (tac.focus === 'talisman') xg *= overall(team) >= overall(opp) ? 1.06 : 0.96

  return clamp(xg, 0.15, 4.2)
}

const fact = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r }
const poisson = (l, k) => Math.exp(-l) * Math.pow(l, k) / fact(k)

// Win/draw/loss probabilities from the same model the match runs on.
export function matchOdds(home, away, tacH, tacA) {
  const xh = computeXg(home, away, tacH, tacA)
  const xa = computeXg(away, home, tacA, tacH)
  let h = 0, d = 0, a = 0
  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j <= 9; j++) {
      const p = poisson(xh, i) * poisson(xa, j)
      if (i > j) h += p
      else if (i < j) a += p
      else d += p
    }
  }
  const total = h + d + a
  return { h: Math.round((h / total) * 100), d: Math.round((d / total) * 100), a: Math.round((a / total) * 100) }
}

// Board expectation tiers by squad strength across all 48.
export const STAGE_IDX = { GROUP: 0, R32: 1, R16: 2, QF: 3, SF: 4, F: 5, CHAMPION: 6 }
const STAGE_NAME = ['Group stage', 'Round of 32', 'Round of 16', 'Quarter-finals', 'Semi-finals', 'The final', 'World champions']

export function expectation(team) {
  const ranked = Object.values(TEAMS).map((t) => ({ id: t.id, ovr: overall(t) })).sort((x, y) => y.ovr - x.ovr)
  const pos = ranked.findIndex((t) => t.id === team.id) + 1
  let idx, label
  if (pos <= 4) { idx = 4; label = 'Semi-finals' }
  else if (pos <= 8) { idx = 3; label = 'Quarter-finals' }
  else if (pos <= 16) { idx = 2; label = 'Round of 16' }
  else if (pos <= 32) { idx = 1; label = 'Round of 32' }
  else { idx = 0; label = 'Group stage football' }
  return { pos, idx, label }
}

export function achievedIndex(userId, rounds, champion) {
  if (champion === userId) return 6
  let reached = 0
  const order = ['R32', 'R16', 'QF', 'SF', 'F']
  order.forEach((st, i) => {
    for (const t of rounds[st] || []) {
      if (t.home === userId || t.away === userId) reached = Math.max(reached, t.winner === userId ? i + 2 : i + 1)
    }
  })
  return reached
}

export function verdict(exp, achieved, userId) {
  const team = TEAMS[userId]
  if (achieved >= 6) return { tone: 'gold', text: `Nobody can argue with the trophy. ${team.name} expected ${exp.label.toLowerCase()} — you gave them history.` }
  if (achieved > exp.idx) return { tone: 'good', text: `The board expected ${exp.label.toLowerCase()}. Reaching the ${STAGE_NAME[achieved].toLowerCase()} means you leave with credit — and probably a pay rise.` }
  if (achieved === exp.idx) return { tone: 'even', text: `Par for the course. ${exp.label} was the target and that is exactly what you delivered. Solid, if not spectacular.` }
  return { tone: 'bad', text: `The target was ${exp.label.toLowerCase()} and you fell short. Expect awkward questions on the flight home.` }
}

const GOAL_FLAVOR = [
  'drills it low into the corner',
  'rises highest and heads it home',
  'curls one into the top corner',
  'finishes a sweeping team move',
  'pounces on a loose ball in the box',
  'converts from the penalty spot after a VAR review',
  'slots home one-on-one with the keeper',
  'lashes in a half-volley from the edge of the area',
]

const CHANCE_FLAVOR = [
  'forces a flying save at the near post',
  'drags a golden chance just wide',
  'rattles the crossbar from distance',
  'is denied by a last-ditch block',
  'heads over from six yards',
]

function scorerFor(team, tac) {
  const weights = team.players.map((pl) => {
    let w = pl.p === 'FW' ? 3 : pl.p === 'MF' ? 1.6 : 0.55
    if (tac && tac.focus === 'talisman' && pl.n === team.star) w *= 2.2
    return w
  })
  const total = weights.reduce((x, y) => x + y, 0)
  let r = rnd() * total
  for (let i = 0; i < team.players.length; i++) {
    r -= weights[i]
    if (r <= 0) return team.players[i].n
  }
  return team.players[0].n
}

// Simulate minutes (from, to] and return events. mods multiply each side's chance creation.
export function simulateSegment(home, away, tacH, tacA, from, to, mods = { h: 1, a: 1 }) {
  const events = []
  let xgH = 0
  let xgA = 0
  for (let min = from + 1; min <= to; min++) {
    for (const side of ['H', 'A']) {
      const team = side === 'H' ? home : away
      const opp = side === 'H' ? away : home
      const tac = side === 'H' ? tacH : tacA
      const oppTac = side === 'H' ? tacA : tacH
      let xg = computeXg(team, opp, tac, oppTac) * (side === 'H' ? mods.h : mods.a)
      if (min > 70 && PRESSING[oppTac.pressing].late > 1) xg *= PRESSING[oppTac.pressing].late
      const perMin = xg / 94
      if (side === 'H') xgH += perMin
      else xgA += perMin
      const roll = rnd()
      if (roll < perMin) {
        events.push({ min, side, type: 'goal', player: scorerFor(team, tac), text: pick(GOAL_FLAVOR) })
      } else if (roll < perMin * 2.6) {
        events.push({ min, side, type: 'chance', player: scorerFor(team, tac), text: pick(CHANCE_FLAVOR) })
      } else if (roll > 0.996) {
        events.push({ min, side, type: 'card', player: pick(team.players).n, text: 'goes into the book for a cynical foul' })
      }
    }
  }
  return { events, xgH, xgA }
}

export function shootout(home, away, tacH = null, tacA = null) {
  const kicks = []
  const takers = (t, tac) => {
    const sorted = [...t.players].sort((x, y) => (y.p === 'FW' ? 3 : y.p === 'MF' ? 2 : 1) - (x.p === 'FW' ? 3 : x.p === 'MF' ? 2 : 1))
    const first = (tac && tac.taker) || t.star
    return [first, ...sorted.map((p) => p.n).filter((n) => n !== first)]
  }
  const tH = takers(home, tacH)
  const tA = takers(away, tacA)
  const pFor = (t) => clamp(0.74 + (t.att - 76) * 0.004, 0.58, 0.9)
  let h = 0
  let a = 0
  let round = 0
  while (true) {
    round++
    const kH = { team: 'H', round, taker: tH[(round - 1) % tH.length], scored: rnd() < pFor(home) }
    if (kH.scored) h++
    kicks.push(kH)
    const kA = { team: 'A', round, taker: tA[(round - 1) % tA.length], scored: rnd() < pFor(away) }
    if (kA.scored) a++
    kicks.push(kA)
    if (round >= 5 && h !== a) break
    if (round < 5) {
      const rem = 5 - round
      if (h > a + rem || a > h + rem) break
    }
    if (round > 10) {
      if (h === a) { if (rnd() < 0.5) h++; else a++ }
      break
    }
  }
  return { h, a, kicks }
}

// Instant full match (for AI vs AI fixtures). Returns scorers for the golden boot race.
export function simulateMatch(homeId, awayId, knockout = false, tacHOverride = null, tacAOverride = null) {
  const home = TEAMS[homeId]
  const away = TEAMS[awayId]
  const tacH = tacHOverride || aiTactics(home, away)
  const tacA = tacAOverride || aiTactics(away, home)
  const allEvents = []
  const seg = simulateSegment(home, away, tacH, tacA, 0, 90)
  allEvents.push(...seg.events)
  let hs = seg.events.filter((e) => e.type === 'goal' && e.side === 'H').length
  let as = seg.events.filter((e) => e.type === 'goal' && e.side === 'A').length
  let pens = null
  let et = false
  if (knockout && hs === as) {
    et = true
    const extra = simulateSegment(home, away, tacH, tacA, 90, 120)
    allEvents.push(...extra.events)
    hs += extra.events.filter((e) => e.type === 'goal' && e.side === 'H').length
    as += extra.events.filter((e) => e.type === 'goal' && e.side === 'A').length
    if (hs === as) pens = shootout(home, away, tacH, tacA)
  }
  const winner = !knockout ? null : hs > as ? homeId : as > hs ? awayId : pens.h > pens.a ? homeId : awayId
  const scorers = allEvents
    .filter((e) => e.type === 'goal')
    .map((e) => ({ team: e.side === 'H' ? homeId : awayId, player: e.player }))
  return { hs, as, pens, winner, et, scorers }
}

export function addGoals(boot, scorers) {
  const next = { ...boot }
  for (const s of scorers) {
    const key = `${s.team}:${s.player}`
    next[key] = (next[key] || 0) + 1
  }
  return next
}

export function bootTable(boot, n = 8) {
  return Object.entries(boot)
    .map(([key, goals]) => {
      const [team, player] = [key.slice(0, 3), key.slice(4)]
      return { team, player, goals }
    })
    .sort((x, y) => y.goals - x.goals || x.player.localeCompare(y.player))
    .slice(0, n)
}

// ---------- Tournament structure ----------

export function buildGroupFixtures() {
  const fixtures = []
  let id = 0
  const pairs = [
    [[0, 1], [2, 3]],
    [[0, 2], [1, 3]],
    [[0, 3], [1, 2]],
  ]
  for (const [g, ids] of Object.entries(GROUPS)) {
    pairs.forEach((round, ri) => {
      for (const [a, b] of round) {
        fixtures.push({
          id: id++, group: g, round: ri + 1, home: ids[a], away: ids[b],
          played: false, hs: 0, as: 0, venue: VENUES[id % VENUES.length],
        })
      }
    })
  }
  return fixtures
}

// Simulate every unplayed fixture of one matchday. Returns scorers for the boot tally.
export function simulateGroupRound(fixtures, round) {
  const scorers = []
  const out = fixtures.map((f) => {
    if (f.round !== round || f.played) return f
    const r = simulateMatch(f.home, f.away, false)
    scorers.push(...r.scorers)
    return { ...f, played: true, hs: r.hs, as: r.as }
  })
  return { fixtures: out, scorers }
}

export function groupTable(g, fixtures) {
  const rows = GROUPS[g].map((id) => ({ id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }))
  const byId = Object.fromEntries(rows.map((r) => [r.id, r]))
  for (const f of fixtures) {
    if (f.group !== g || !f.played) continue
    const h = byId[f.home]
    const a = byId[f.away]
    h.p++; a.p++
    h.gf += f.hs; h.ga += f.as
    a.gf += f.as; a.ga += f.hs
    if (f.hs > f.as) { h.w++; a.l++; h.pts += 3 }
    else if (f.hs < f.as) { a.w++; h.l++; a.pts += 3 }
    else { h.d++; a.d++; h.pts++; a.pts++ }
  }
  return rows.sort((x, y) =>
    y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf || TEAMS[x.id].rank - TEAMS[y.id].rank)
}

export function qualifiers(fixtures) {
  const winners = {}
  const runners = {}
  const thirds = []
  for (const g of Object.keys(GROUPS)) {
    const t = groupTable(g, fixtures)
    winners[g] = t[0].id
    runners[g] = t[1].id
    thirds.push({ ...t[2], group: g })
  }
  thirds.sort((x, y) => y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf || TEAMS[x.id].rank - TEAMS[y.id].rank)
  return { winners, runners, thirds: thirds.slice(0, 8), allThirds: thirds }
}

export function buildR32({ winners, runners, thirds }) {
  const pool = [...thirds]
  const assigned = {}
  for (const g of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
    let idx = pool.findIndex((t) => t.group !== g)
    if (idx === -1) idx = 0
    assigned[g] = pool.splice(idx, 1)[0].id
  }
  const tie = (home, away) => ({ home, away, played: false, hs: 0, as: 0, pens: null, winner: null })
  return [
    tie(winners.A, assigned.A), tie(runners.A, runners.B),
    tie(winners.B, assigned.B), tie(runners.C, runners.D),
    tie(winners.C, assigned.C), tie(winners.I, runners.L),
    tie(winners.D, assigned.D), tie(runners.E, runners.F),
    tie(winners.E, assigned.E), tie(winners.J, runners.K),
    tie(winners.F, assigned.F), tie(runners.G, runners.H),
    tie(winners.G, assigned.G), tie(winners.K, runners.J),
    tie(winners.H, assigned.H), tie(winners.L, runners.I),
  ]
}

export const ROUND_ORDER = ['R32', 'R16', 'QF', 'SF', 'F']
export const ROUND_LABEL = { R32: 'Round of 32', R16: 'Round of 16', QF: 'Quarter-final', SF: 'Semi-final', F: 'Final' }

export function nextRoundFrom(ties) {
  const next = []
  for (let i = 0; i < ties.length; i += 2) {
    next.push({ home: ties[i].winner, away: ties[i + 1].winner, played: false, hs: 0, as: 0, pens: null, winner: null })
  }
  return next
}

export function simTie(t) {
  const r = simulateMatch(t.home, t.away, true)
  return {
    tie: { ...t, played: true, hs: r.hs, as: r.as, pens: r.pens ? { h: r.pens.h, a: r.pens.a } : null, winner: r.winner },
    scorers: r.scorers,
  }
}

// Simulate one whole knockout round (unplayed ties only).
export function simulateRound(ties) {
  const scorers = []
  const out = ties.map((t) => {
    if (t.played) return t
    const { tie, scorers: s } = simTie(t)
    scorers.push(...s)
    return tie
  })
  return { ties: out, scorers }
}

export function simulateKnockoutFrom(rounds, fromStage) {
  const out = { ...rounds }
  const scorers = []
  for (let idx = ROUND_ORDER.indexOf(fromStage); idx < ROUND_ORDER.length; idx++) {
    const st = ROUND_ORDER[idx]
    if (!out[st]) out[st] = nextRoundFrom(out[ROUND_ORDER[idx - 1]])
    const r = simulateRound(out[st])
    out[st] = r.ties
    scorers.push(...r.scorers)
  }
  return { rounds: out, scorers }
}

export function possessionEstimate(home, away, tacH, tacA) {
  let pos = 50 + (home.mid - away.mid) * 0.8
  if (tacH.style === 'possession') pos += 5
  if (tacH.style === 'counter') pos -= 5
  if (tacA.style === 'possession') pos -= 5
  if (tacA.style === 'counter') pos += 5
  return clamp(Math.round(pos), 28, 72)
}
