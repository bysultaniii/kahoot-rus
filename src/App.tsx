import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Final } from './components/Final'
import { ArrowLeft, ArrowRight, ExpandIcon, HomeIcon } from './components/Icons'
import { QuestionView } from './components/QuestionView'
import { RoundIntro } from './components/RoundIntro'
import { ScoreBar } from './components/ScoreBar'
import { Setup } from './components/Setup'
import { Theory } from './components/Theory'
import { Timer } from './components/Timer'
import { ROUNDS } from './data/rounds'
import { qKey, scores as calcScores, useGame, type GameState } from './game/state'

export default function App() {
  const [s, dispatch] = useGame()
  const round = ROUNDS[s.round]
  const question = round.questions[s.q]
  const scores = calcScores(s)
  const awarded = s.awards[qKey(s.round, s.q)] ?? []
  const awarding = s.phase === 'question' && s.revealed

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (s.phase === 'setup' || e.target instanceof HTMLInputElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      // иначе пробел/Enter ещё и «нажмёт» кнопку, на которой остался фокус
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
      if (e.code === 'ArrowRight' || e.code === 'Space' || e.code === 'Enter' || e.code === 'PageDown') {
        e.preventDefault()
        dispatch({ type: 'next' })
      } else if (e.code === 'ArrowLeft' || e.code === 'PageUp') {
        e.preventDefault()
        dispatch({ type: 'prev' })
      } else if (/^Digit[1-4]$/.test(e.code)) {
        dispatch({ type: 'toggleAward', team: Number(e.code.slice(5)) - 1 })
      } else if (e.code === 'KeyF') {
        toggleFullscreen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [s.phase, dispatch])

  if (s.phase === 'setup') {
    return (
      <Setup
        initialTeams={s.teams}
        initialTimer={s.timer}
        onStart={(teams, timer) => dispatch({ type: 'start', teams, timer })}
      />
    )
  }

  const screenKey =
    s.phase === 'question' ? `q-${s.round}-${s.q}` : s.phase === 'round' ? `r-${s.round}` : s.phase

  return (
    <div className="flex h-full flex-col">
      {/* верхняя панель */}
      <header className="flex h-24 shrink-0 items-center justify-between px-8 pt-2">
        <div className="flex w-72 items-center gap-3">
          <HomeButton onConfirm={() => dispatch({ type: 'restart' })} />
        </div>

        <Progress s={s} />

        <div className="flex w-72 items-center justify-end gap-3">
          {s.phase === 'question' && s.timer > 0 && (
            <Timer key={screenKey} seconds={s.timer} running={!s.revealed} />
          )}
          <IconButton onClick={toggleFullscreen} title="Во весь экран (F)">
            <ExpandIcon className="size-6" />
          </IconButton>
        </div>
      </header>

      {/* основной экран */}
      <main className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {s.phase === 'theory' && <Theory />}
            {s.phase === 'round' && <RoundIntro round={round} index={s.round} />}
            {s.phase === 'question' && (
              <QuestionView
                question={question}
                revealed={s.revealed}
                picked={s.picked}
                onPick={(index) => dispatch({ type: 'pick', index })}
              />
            )}
            {s.phase === 'final' && <Final teams={s.teams} scores={scores} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* нижняя панель */}
      <footer className="flex h-32 shrink-0 items-end justify-between gap-6 px-8 pb-6">
        <div className="w-56">
          <IconButton onClick={() => dispatch({ type: 'prev' })} title="Назад (←)">
            <ArrowLeft className="size-6" />
          </IconButton>
        </div>

        {s.phase !== 'final' ? (
          <ScoreBar
            teams={s.teams}
            scores={scores}
            awarding={awarding}
            awarded={awarded}
            points={round.points}
            onToggle={(team) => dispatch({ type: 'toggleAward', team })}
          />
        ) : (
          <div />
        )}

        <div className="flex w-56 justify-end">
          {s.phase === 'final' ? (
            <PrimaryButton onClick={() => dispatch({ type: 'restart' })}>Новая игра</PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => dispatch({ type: 'next' })} accent={s.phase === 'question' && !s.revealed}>
              {nextLabel(s)}
              <ArrowRight className="size-6" />
            </PrimaryButton>
          )}
        </div>
      </footer>
    </div>
  )
}

function nextLabel(s: GameState) {
  switch (s.phase) {
    case 'theory':
      return 'К игре'
    case 'round':
      return 'Начать'
    case 'question': {
      if (!s.revealed) return 'Ответ'
      const lastQ = s.q === ROUNDS[s.round].questions.length - 1
      if (lastQ && s.round === ROUNDS.length - 1) return 'Итоги'
      return 'Далее'
    }
    default:
      return 'Далее'
  }
}

function Progress({ s }: { s: GameState }) {
  if (s.phase === 'theory') return <div className="text-lg font-bold text-muted">Теория · Nazariya</div>
  if (s.phase === 'final') return <div className="text-lg font-bold text-muted">Итоги · Natijalar</div>

  const round = ROUNDS[s.round]
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg font-bold">
        <span className="text-muted">Раунд {s.round + 1} · </span>
        {round.title}
      </div>
      <div className="flex gap-1.5">
        {round.questions.map((_, i) => {
          const done = s.phase === 'question' && (i < s.q || (i === s.q && s.revealed))
          const current = s.phase === 'question' && i === s.q
          return (
            <motion.span
              key={i}
              animate={{ width: current ? 28 : 10 }}
              className="h-2.5 rounded-full"
              style={{ background: done ? '#6F9E8F' : current ? '#A9C7BD' : '#E7E1D7' }}
            />
          )
        })}
      </div>
    </div>
  )
}

function HomeButton({ onConfirm }: { onConfirm: () => void }) {
  const [ask, setAsk] = useState(false)
  useEffect(() => {
    if (!ask) return
    const t = setTimeout(() => setAsk(false), 3000)
    return () => clearTimeout(t)
  }, [ask])

  return (
    <div className="flex items-center gap-2">
      <IconButton onClick={() => (ask ? onConfirm() : setAsk(true))} title="В начало" active={ask}>
        <HomeIcon className="size-6" />
      </IconButton>
      <AnimatePresence>
        {ask && (
          <motion.button
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            onClick={onConfirm}
            className="rounded-full bg-[#F6E2DE] px-4 py-2 text-base font-bold text-[#A2554A]"
          >
            Начать заново? Счёт сбросится
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function IconButton({ children, onClick, title, active }: {
  children: React.ReactNode
  onClick: () => void
  title: string
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`grid size-14 place-items-center rounded-full shadow-sm transition-colors ${
        active ? 'bg-[#F6E2DE] text-[#A2554A]' : 'bg-surface text-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function PrimaryButton({ children, onClick, accent }: { children: React.ReactNode; onClick: () => void; accent?: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-full px-8 py-4 text-xl font-bold text-white transition-colors ${
        accent ? 'bg-[#D9A55B] shadow-[0_10px_28px_-10px_#B07F35]' : 'bg-primary shadow-[0_10px_28px_-10px_#4f7e70]'
      }`}
    >
      {children}
    </motion.button>
  )
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen()
  else document.documentElement.requestFullscreen?.().catch(() => {})
}
