import { useEffect, useReducer } from 'react'
import { ROUNDS } from '../data/rounds'

export type Phase = 'setup' | 'theory' | 'round' | 'question' | 'final'

export interface Team {
  name: string
  color: string
}

export interface GameState {
  phase: Phase
  teams: Team[]
  round: number
  q: number
  revealed: boolean
  /** вариант, на который нажал преподаватель (ответ команды) */
  picked: number | null
  /** `${round}-${q}` → индексы команд, ответивших верно */
  awards: Record<string, number[]>
  /** секунд на вопрос, 0 — без таймера */
  timer: number
}

export const TEAM_COLORS = ['#6F9E8F', '#D9A55B', '#8E86C4', '#D6857A']
export const DEFAULT_TEAM_NAMES = ['Эмаль', 'Дентин', 'Пульпа', 'Коронка']

export const initialState: GameState = {
  phase: 'setup',
  teams: DEFAULT_TEAM_NAMES.slice(0, 3).map((name, i) => ({ name, color: TEAM_COLORS[i] })),
  round: 0,
  q: 0,
  revealed: false,
  picked: null,
  awards: {},
  timer: 30,
}

export type Action =
  | { type: 'start'; teams: Team[]; timer: number }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'pick'; index: number }
  | { type: 'toggleAward'; team: number }
  | { type: 'restart' }

export const qKey = (round: number, q: number) => `${round}-${q}`

const lastQ = (round: number) => ROUNDS[round].questions.length - 1

function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case 'start':
      return { ...initialState, teams: a.teams, timer: a.timer, phase: 'theory' }

    case 'restart':
      return { ...initialState, teams: s.teams, timer: s.timer }

    case 'pick':
      if (s.phase !== 'question' || s.revealed) return s
      return { ...s, picked: a.index, revealed: true }

    case 'toggleAward': {
      if (s.phase !== 'question' || !s.revealed || a.team >= s.teams.length) return s
      const key = qKey(s.round, s.q)
      const cur = s.awards[key] ?? []
      const next = cur.includes(a.team) ? cur.filter((t) => t !== a.team) : [...cur, a.team]
      return { ...s, awards: { ...s.awards, [key]: next } }
    }

    case 'next':
      switch (s.phase) {
        case 'setup':
          return s
        case 'theory':
          return { ...s, phase: 'round', round: 0, q: 0 }
        case 'round':
          return { ...s, phase: 'question', q: 0, revealed: false, picked: null }
        case 'question':
          if (!s.revealed) return { ...s, revealed: true }
          if (s.q < lastQ(s.round)) return { ...s, q: s.q + 1, revealed: false, picked: null }
          if (s.round < ROUNDS.length - 1) return { ...s, phase: 'round', round: s.round + 1, q: 0 }
          return { ...s, phase: 'final' }
        case 'final':
          return s
      }
      return s

    case 'prev':
      switch (s.phase) {
        case 'setup':
          return s
        case 'theory':
          return { ...s, phase: 'setup' }
        case 'round':
          if (s.round === 0) return { ...s, phase: 'theory' }
          return { ...s, phase: 'question', round: s.round - 1, q: lastQ(s.round - 1), revealed: true, picked: null }
        case 'question':
          if (s.q > 0) return { ...s, q: s.q - 1, revealed: true, picked: null }
          return { ...s, phase: 'round' }
        case 'final': {
          const r = ROUNDS.length - 1
          return { ...s, phase: 'question', round: r, q: lastQ(r), revealed: true, picked: null }
        }
      }
      return s
  }
}

export function scores(s: GameState): number[] {
  const out = s.teams.map(() => 0)
  for (const [key, teams] of Object.entries(s.awards)) {
    const round = Number(key.split('-')[0])
    const pts = ROUNDS[round]?.points ?? 0
    for (const t of teams) if (t < out.length) out[t] += pts
  }
  return out
}

const STORAGE_KEY = 'stili-rechi-quiz-v1'

function load(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const saved = JSON.parse(raw) as GameState
    // защита от устаревшего сохранения после изменения вопросов
    if (!ROUNDS[saved.round] || saved.q > lastQ(saved.round) || !Array.isArray(saved.teams)) return initialState
    return { ...initialState, ...saved }
  } catch {
    return initialState
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])
  return [state, dispatch] as const
}
