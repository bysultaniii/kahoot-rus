import { motion } from 'motion/react'
import { useState } from 'react'
import { STYLE_ORDER, STYLES } from '../data/styles'
import { DEFAULT_TEAM_NAMES, TEAM_COLORS, type Team } from '../game/state'
import { ArrowRight, StyleIcon } from './Icons'

const TIMER_OPTIONS = [0, 20, 30, 45]

export function Setup({ initialTeams, initialTimer, onStart }: {
  initialTeams: Team[]
  initialTimer: number
  onStart: (teams: Team[], timer: number) => void
}) {
  const [names, setNames] = useState<string[]>(() => {
    const n = initialTeams.map((t) => t.name)
    return n.length >= 2 ? n : DEFAULT_TEAM_NAMES.slice(0, 3)
  })
  const [timer, setTimer] = useState(initialTimer)

  const setCount = (c: number) =>
    setNames((prev) => Array.from({ length: c }, (_, i) => prev[i] ?? DEFAULT_TEAM_NAMES[i]))

  const start = () =>
    onStart(
      names.map((n, i) => ({ name: n.trim() || DEFAULT_TEAM_NAMES[i], color: TEAM_COLORS[i] })),
      timer,
    )

  return (
    <div className="flex h-full items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center gap-3">
            {STYLE_ORDER.map((id, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="grid size-14 place-items-center rounded-2xl"
                style={{ background: STYLES[id].bg, color: STYLES[id].fg }}
              >
                <StyleIcon id={id} className="size-7" />
              </motion.div>
            ))}
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">Функциональные стили речи</h1>
          <p className="mt-3 text-xl text-muted">Nutqning funksional uslublari</p>
        </div>

        <div className="rounded-3xl bg-surface p-8 shadow-[0_1px_0_#e7e1d7,0_12px_40px_-20px_rgba(60,50,30,0.25)]">
          <Row label="Команды">
            <Segmented options={[2, 3, 4]} value={names.length} onChange={setCount} />
          </Row>

          <div className="mt-5 grid gap-3" style={{ gridTemplateColumns: `repeat(${names.length}, minmax(0, 1fr))` }}>
            {names.map((n, i) => (
              <label
                key={i}
                className="flex items-center gap-2 rounded-2xl border-2 px-4 py-3 transition-colors focus-within:bg-cream"
                style={{ borderColor: TEAM_COLORS[i] + '55' }}
              >
                <span className="size-3 shrink-0 rounded-full" style={{ background: TEAM_COLORS[i] }} />
                <input
                  value={n}
                  maxLength={16}
                  onChange={(e) => setNames((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
                  className="w-full min-w-0 bg-transparent text-lg font-bold outline-none"
                  aria-label={`Команда ${i + 1}`}
                />
              </label>
            ))}
          </div>

          <div className="my-7 h-px bg-line" />

          <Row label="Таймер">
            <Segmented
              options={TIMER_OPTIONS}
              value={timer}
              onChange={setTimer}
              format={(v) => (v === 0 ? 'выкл' : `${v} с`)}
            />
          </Row>
        </div>

        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={start}
            className="flex items-center gap-3 rounded-full bg-primary px-10 py-4 text-2xl font-bold text-white shadow-[0_10px_30px_-10px_#4f7e70]"
          >
            Начать
            <ArrowRight className="size-7" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-xl font-bold">{label}</span>
      {children}
    </div>
  )
}

function Segmented({ options, value, onChange, format = String }: {
  options: number[]
  value: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  return (
    <div className="flex rounded-full bg-cream p-1">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`relative min-w-16 rounded-full px-5 py-2 text-lg font-bold transition-colors ${
            o === value ? 'text-white' : 'text-muted hover:text-ink'
          }`}
        >
          {o === value && (
            <motion.span layoutId={`seg-${options.join()}`} className="absolute inset-0 rounded-full bg-primary" />
          )}
          <span className="relative">{format(o)}</span>
        </button>
      ))}
    </div>
  )
}
