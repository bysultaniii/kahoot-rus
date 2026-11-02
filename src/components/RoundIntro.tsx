import { motion } from 'motion/react'
import type { Round } from '../data/rounds'

export function RoundIntro({ round, index }: { round: Round; index: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="mb-8 grid size-28 place-items-center rounded-full bg-primary text-6xl font-extrabold text-white shadow-[0_16px_40px_-14px_#4f7e70]"
      >
        {index + 1}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="text-lg font-bold tracking-widest text-muted uppercase">Раунд {index + 1}</div>
        <h2 className="mt-2 text-6xl font-extrabold">{round.title}</h2>
        <p className="mt-3 text-2xl text-muted">{round.uz}</p>
        <p className="mt-10 text-2xl">{round.rule}</p>
        <div className="mt-6 flex justify-center gap-3 text-lg font-bold">
          <span className="rounded-full bg-surface px-5 py-2 shadow-sm">{round.questions.length} вопросов</span>
          <span className="rounded-full bg-[#F4E6C8] px-5 py-2 text-[#8A6420] shadow-sm">
            +{round.points} {round.points === 1 ? 'балл' : 'балла'}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
