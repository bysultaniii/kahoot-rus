import { useEffect, useState } from 'react'

/** Сбрасывается через key при смене вопроса. Клик — пауза/продолжить. */
export function Timer({ seconds, running }: { seconds: number; running: boolean }) {
  const [left, setLeft] = useState(seconds)
  const [paused, setPaused] = useState(false)
  const active = running && !paused && left > 0

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000)
    return () => clearInterval(id)
  }, [active])

  const r = 26
  const c = 2 * Math.PI * r
  const done = left === 0
  const low = left <= 5 && !done
  const color = done ? '#D6857A' : low ? '#D9A55B' : '#6F9E8F'

  return (
    <button
      onClick={() => setPaused((p) => !p)}
      className={`relative grid size-16 place-items-center rounded-full ${!running ? 'opacity-40' : ''}`}
      title={paused ? 'Продолжить' : 'Пауза'}
      aria-label={`Осталось ${left} секунд`}
    >
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="#FFFDF9" stroke="#E7E1D7" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - left / seconds)}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <span className={`relative text-xl font-extrabold tabular-nums ${low ? 'animate-pulse' : ''}`} style={{ color }}>
        {paused ? '❚❚' : left}
      </span>
    </button>
  )
}
