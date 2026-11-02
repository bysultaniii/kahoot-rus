import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { correctIndex, type Hint, type Question } from '../data/rounds'
import { STYLE_ORDER, STYLES, type StyleId } from '../data/styles'
import { CheckIcon, StyleIcon } from './Icons'

type OptState = 'idle' | 'correct' | 'wrong' | 'faded'

interface Props {
  question: Question
  revealed: boolean
  picked: number | null
  onPick: (i: number) => void
}

export function QuestionView({ question, revealed, picked, onPick }: Props) {
  const [showHints, setShowHints] = useState(false)
  const correct = correctIndex(question, STYLE_ORDER)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyH' || e.code === 'KeyU') setShowHints((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const stateOf = (i: number): OptState => {
    if (!revealed) return 'idle'
    if (i === correct) return 'correct'
    if (i === picked) return 'wrong'
    return 'faded'
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-10">
      {question.kind === 'which-style' && <WhichStyle q={question} stateOf={stateOf} onPick={onPick} revealed={revealed} />}
      {question.kind === 'odd-one' && <OddOne q={question} stateOf={stateOf} onPick={onPick} />}
      {question.kind === 'pick-version' && <PickVersion q={question} stateOf={stateOf} onPick={onPick} revealed={revealed} />}

      <Hints hints={question.hints} open={showHints} onToggle={() => setShowHints((v) => !v)} />
    </div>
  )
}

/* ---------- Раунд 1: какой стиль? ---------- */

function WhichStyle({ q, stateOf, onPick, revealed }: {
  q: Extract<Question, { kind: 'which-style' }>
  stateOf: (i: number) => OptState
  onPick: (i: number) => void
  revealed: boolean
}) {
  const answer = STYLES[q.answer]
  return (
    <>
      <motion.blockquote
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-5xl rounded-[2rem] bg-surface px-14 py-10 text-center text-[2.5rem] leading-snug font-semibold whitespace-pre-line shadow-[0_1px_0_#e7e1d7,0_20px_50px_-28px_rgba(60,50,30,0.3)] transition-colors duration-500"
        style={revealed ? { background: answer.bg, color: answer.fg } : undefined}
      >
        {q.text}
      </motion.blockquote>

      <div className="grid w-full max-w-6xl grid-cols-5 gap-3">
        {STYLE_ORDER.map((id, i) => (
          <StyleOption key={id} id={id} state={stateOf(i)} onClick={() => onPick(i)} delay={i * 0.05} />
        ))}
      </div>

      <SignsRow style={q.answer} show={revealed} />
    </>
  )
}

function StyleOption({ id, state, onClick, delay }: { id: StyleId; state: OptState; onClick: () => void; delay: number }) {
  const s = STYLES[id]
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: state === 'faded' ? 0.35 : 1,
        y: 0,
        scale: state === 'correct' ? 1.06 : 1,
        x: state === 'wrong' ? [0, -8, 8, -5, 5, 0] : 0,
      }}
      transition={{ delay: state === 'idle' ? delay : 0, x: { duration: 0.4 } }}
      whileHover={state === 'idle' ? { y: -3 } : undefined}
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 rounded-2xl border-[3px] px-3 py-4"
      style={{
        background: s.bg,
        color: s.fg,
        borderColor: state === 'correct' ? s.fg : state === 'wrong' ? '#D6857A' : 'transparent',
      }}
    >
      <StyleIcon id={id} className="size-8" />
      <span className="text-lg leading-tight font-extrabold">{s.ru}</span>
      {state === 'correct' && <CorrectBadge color={s.fg} />}
    </motion.button>
  )
}

function SignsRow({ style, show }: { style: StyleId; show: boolean }) {
  const s = STYLES[style]
  return (
    <div className="flex h-12 items-center">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            {s.signs.map((sg) => (
              <span key={sg.ru} className="rounded-full px-4 py-2 text-lg font-bold" style={{ background: s.bg, color: s.fg }}>
                {sg.ru}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- Раунд 2: найди лишнее ---------- */

function OddOne({ q, stateOf, onPick }: {
  q: Extract<Question, { kind: 'odd-one' }>
  stateOf: (i: number) => OptState
  onPick: (i: number) => void
}) {
  const s = STYLES[q.style]
  const odd = STYLES[q.oddStyle]
  return (
    <>
      <StyleHeader id={q.style} />

      <div className="grid w-full max-w-5xl auto-rows-fr grid-cols-2 gap-5">
        {q.words.map((w, i) => {
          const st = stateOf(i)
          const isOdd = st === 'correct'
          return (
            <motion.button
              key={w}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: st === 'faded' ? 0.45 : 1,
                scale: isOdd ? 1.04 : 1,
                x: st === 'wrong' ? [0, -8, 8, -5, 5, 0] : 0,
              }}
              transition={{ delay: st === 'idle' ? i * 0.07 : 0, x: { duration: 0.4 } }}
              whileHover={st === 'idle' ? { y: -3 } : undefined}
              onClick={() => onPick(i)}
              className="relative flex min-h-32 flex-col items-center justify-center gap-3 rounded-[1.75rem] border-[3px] bg-surface px-6 py-6 text-[2.6rem] font-extrabold shadow-[0_1px_0_#e7e1d7,0_14px_36px_-24px_rgba(60,50,30,0.3)]"
              style={{
                borderColor: isOdd ? odd.fg : st === 'wrong' ? '#D6857A' : 'transparent',
                background: isOdd ? odd.bg : st === 'faded' ? s.bg : undefined,
                color: isOdd ? odd.fg : st === 'faded' ? s.fg : undefined,
              }}
            >
              {w}
              {isOdd && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-lg font-bold"
                >
                  <StyleIcon id={q.oddStyle} className="size-5" />
                  {odd.ru}
                </motion.span>
              )}
              {isOdd && <CorrectBadge color={odd.fg} />}
            </motion.button>
          )
        })}
      </div>
    </>
  )
}

/* ---------- Раунд 3: скажи иначе ---------- */

function PickVersion({ q, stateOf, onPick, revealed }: {
  q: Extract<Question, { kind: 'pick-version' }>
  stateOf: (i: number) => OptState
  onPick: (i: number) => void
  revealed: boolean
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xl font-bold text-muted">{q.topic}</span>
        <StyleHeader id={q.target} />
      </div>

      <div className="flex w-full max-w-5xl flex-col gap-3">
        {q.options.map((o, i) => {
          const st = stateOf(i)
          const os = STYLES[o.style]
          return (
            <motion.button
              key={o.text}
              initial={{ opacity: 0, x: -16 }}
              animate={{
                opacity: st === 'faded' ? 0.5 : 1,
                x: st === 'wrong' ? [0, -8, 8, -5, 5, 0] : 0,
                scale: st === 'correct' ? 1.02 : 1,
              }}
              transition={{ delay: st === 'idle' ? i * 0.08 : 0, x: { duration: 0.4 } }}
              whileHover={st === 'idle' ? { x: 4 } : undefined}
              onClick={() => onPick(i)}
              className="relative flex items-center gap-6 rounded-[1.75rem] border-[3px] bg-surface px-7 py-4 text-left shadow-[0_1px_0_#e7e1d7,0_14px_36px_-24px_rgba(60,50,30,0.3)]"
              style={{
                borderColor: st === 'correct' ? os.fg : st === 'wrong' ? '#D6857A' : 'transparent',
                background: st === 'correct' ? os.bg : undefined,
                color: st === 'correct' ? os.fg : undefined,
              }}
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-cream text-2xl font-extrabold text-muted">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-[1.9rem] leading-snug font-semibold">{o.text}</span>
              <AnimatePresence>
                {revealed && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-base font-bold"
                    style={{ background: st === 'correct' ? 'rgba(255,255,255,0.7)' : os.bg, color: os.fg }}
                  >
                    <StyleIcon id={o.style} className="size-5" />
                    {os.ru}
                  </motion.span>
                )}
              </AnimatePresence>
              {st === 'correct' && <CorrectBadge color={os.fg} />}
            </motion.button>
          )
        })}
      </div>
    </>
  )
}

/* ---------- общие элементы ---------- */

function StyleHeader({ id }: { id: StyleId }) {
  const s = STYLES[id]
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 rounded-full py-3 pr-8 pl-3"
      style={{ background: s.bg, color: s.fg }}
    >
      <span className="grid size-14 place-items-center rounded-full bg-white/60">
        <StyleIcon id={id} className="size-8" />
      </span>
      <span className="text-3xl font-extrabold">{s.ru} стиль</span>
    </motion.div>
  )
}

function CorrectBadge({ color }: { color: string }) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="absolute -top-3 -right-3 grid size-10 place-items-center rounded-full text-white shadow-md"
      style={{ background: color }}
    >
      <CheckIcon className="size-6" strokeWidth={3} />
    </motion.span>
  )
}

function Hints({ hints, open, onToggle }: { hints: Hint[]; open: boolean; onToggle: () => void }) {
  return (
    <div className="flex min-h-12 flex-wrap items-center justify-center gap-2">
      <button
        onClick={onToggle}
        className={`rounded-full px-4 py-2 text-base font-extrabold tracking-wide transition-colors ${
          open ? 'bg-ink text-white' : 'bg-surface text-muted shadow-sm hover:text-ink'
        }`}
        title="Подсказка на узбекском (H)"
      >
        UZ
      </button>
      <AnimatePresence>
        {open &&
          hints.map(([ru, uz], i) => (
            <motion.span
              key={ru}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-full bg-surface px-4 py-2 text-lg shadow-sm"
            >
              <span className="font-bold">{ru}</span>
              <span className="text-muted"> — {uz}</span>
            </motion.span>
          ))}
      </AnimatePresence>
    </div>
  )
}
