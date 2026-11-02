import confetti from 'canvas-confetti'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { TEAM_COLORS, type Team } from '../game/state'

export function Final({ teams, scores }: { teams: Team[]; scores: number[] }) {
  const ranked = teams
    .map((t, i) => ({ ...t, score: scores[i] }))
    .sort((a, b) => b.score - a.score)
  const max = Math.max(1, ...ranked.map((r) => r.score))
  // одинаковые баллы — одинаковое место
  const place = (score: number) => ranked.findIndex((r) => r.score === score) + 1
  const winners = ranked.filter((r) => r.score === ranked[0].score)

  useEffect(() => {
    const colors = [...TEAM_COLORS, '#F4E6C8', '#E4EDF5']
    const fire = (x: number) =>
      confetti({ particleCount: 70, spread: 70, startVelocity: 45, origin: { x, y: 0.7 }, colors, disableForReducedMotion: true })
    const t1 = setTimeout(() => fire(0.25), 600)
    const t2 = setTimeout(() => fire(0.75), 850)
    const t3 = setTimeout(() => fire(0.5), 1200)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-2 text-xl font-bold text-muted">
        {winners.length > 1 ? 'Ничья!' : 'Победитель'}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="mb-10 text-6xl font-extrabold"
      >
        {winners.map((w) => w.name).join(' и ')}
      </motion.h2>

      <div className="flex items-end gap-6">
        {ranked.map((r, i) => {
          const p = place(r.score)
          return (
            <div key={r.name + i} className="flex w-44 flex-col items-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="mb-3 text-center"
              >
                <div className="text-xl font-extrabold">{r.name}</div>
                <div className="text-4xl font-extrabold tabular-nums" style={{ color: r.color }}>
                  {r.score}
                </div>
              </motion.div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${4 + (r.score / max) * 11}rem` }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 80, damping: 14 }}
                className="flex w-full items-start justify-center rounded-t-3xl pt-4 text-4xl font-extrabold text-white"
                style={{ background: r.color }}
              >
                {p}
              </motion.div>
            </div>
          )
        })}
      </div>
      <div className="h-1 w-full max-w-3xl rounded-full bg-line" />
      <p className="mt-10 text-2xl font-bold text-muted">Спасибо за игру! · Rahmat!</p>
    </div>
  )
}
