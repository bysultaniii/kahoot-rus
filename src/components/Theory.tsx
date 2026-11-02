import { motion } from 'motion/react'
import { STYLE_ORDER, STYLES } from '../data/styles'
import { StyleIcon } from './Icons'

export function Theory() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 pb-6">
      <h2 className="mb-1 text-4xl font-extrabold">5 стилей речи</h2>
      <p className="mb-8 text-lg text-muted">Nutqning 5 uslubi</p>

      <div className="grid w-full max-w-7xl grid-cols-5 gap-4">
        {STYLE_ORDER.map((id, i) => {
          const s = STYLES[id]
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col rounded-3xl p-5"
              style={{ background: s.bg, color: s.fg }}
            >
              <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-white/60">
                <StyleIcon id={id} className="size-8" />
              </div>
              <div className="text-xl leading-tight font-extrabold">{s.ru}</div>
              <div className="mt-1 text-sm font-semibold opacity-70">{s.uz}</div>

              <div className="mt-5 flex flex-col gap-1">
                {s.where.map((w) => (
                  <div key={w.ru} className="text-base font-bold">
                    {w.ru} <span className="font-medium opacity-60">· {w.uz}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-1.5 pt-5">
                {s.signs.map((sg) => (
                  <div key={sg.ru} className="rounded-xl bg-white/55 px-3 py-1.5 text-sm">
                    <span className="font-bold">{sg.ru}</span>
                    <span className="block text-xs opacity-60">{sg.uz}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
