import { AnimatePresence, motion } from 'motion/react'
import type { Team } from '../game/state'
import { CheckIcon } from './Icons'

export function ScoreBar({ teams, scores, awarding, awarded, points, onToggle }: {
  teams: Team[]
  scores: number[]
  /** режим «кто ответил верно?» — после показа ответа */
  awarding: boolean
  awarded: number[]
  points: number
  onToggle: (team: number) => void
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        animate={{ opacity: awarding ? 1 : 0 }}
        className="h-6 text-base font-bold text-muted"
        aria-hidden={!awarding}
      >
        Кто ответил верно?
      </motion.div>
      <div className="flex gap-3">
        {teams.map((t, i) => {
          const on = awarded.includes(i)
          return (
            <motion.button
              key={i}
              layout
              disabled={!awarding}
              onClick={() => onToggle(i)}
              whileTap={awarding ? { scale: 0.95 } : undefined}
              animate={awarding && !on ? { y: [0, -3, 0] } : { y: 0 }}
              transition={awarding && !on ? { repeat: Infinity, duration: 1.6, delay: i * 0.15 } : undefined}
              className={`relative flex items-center gap-3 rounded-full border-[3px] py-2 pr-2 pl-5 transition-colors disabled:cursor-default ${
                awarding ? 'shadow-md' : ''
              }`}
              style={{
                borderColor: awarding ? t.color : 'transparent',
                background: on ? t.color : '#FFFDF9',
                color: on ? '#fff' : undefined,
              }}
              title={awarding ? `Клавиша ${i + 1}` : undefined}
            >
              {awarding && (
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-full border-2"
                  style={{ borderColor: on ? '#fff' : t.color, background: on ? '#fff' : 'transparent' }}
                >
                  {on && <CheckIcon className="size-4" strokeWidth={3.5} style={{ color: t.color }} />}
                </span>
              )}
              {!awarding && <span className="size-3 shrink-0 rounded-full" style={{ background: t.color }} />}
              <span className="max-w-[11rem] truncate text-lg font-bold whitespace-nowrap">{t.name}</span>
              <span
                className="relative grid min-w-12 place-items-center overflow-hidden rounded-full px-3 py-1 text-xl font-extrabold tabular-nums"
                style={{ background: on ? 'rgba(255,255,255,0.25)' : t.color + '22', color: on ? '#fff' : t.color }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={scores[i]}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                  >
                    {scores[i]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <AnimatePresence>
                {on && (
                  <motion.span
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.9 }}
                    className="pointer-events-none absolute -top-2 right-4 text-2xl font-extrabold"
                    style={{ color: t.color }}
                  >
                    +{points}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
