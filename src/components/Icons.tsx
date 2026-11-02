import type { SVGProps } from 'react'
import type { StyleId } from '../data/styles'

type P = SVGProps<SVGSVGElement>

function Base({ children, ...p }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      {children}
    </svg>
  )
}

export const BookIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" />
    <path d="M9 8h7M9 11.5h5" />
  </Base>
)

export const DocIcon = (p: P) => (
  <Base {...p}>
    <path d="M6 2.5h8l4 4v15H6z" />
    <path d="M14 2.5v4h4" />
    <path d="M9 11h6M9 14.5h4" />
    <circle cx="15" cy="18" r="1.6" />
  </Base>
)

export const MegaphoneIcon = (p: P) => (
  <Base {...p}>
    <path d="M3.5 10v4H7l8 4.5v-13L7 10z" />
    <path d="M18.5 9a4 4 0 0 1 0 6" />
    <path d="M8 14.5l1.2 5" />
  </Base>
)

export const ChatIcon = (p: P) => (
  <Base {...p}>
    <path d="M3.5 5h11v8H8.5l-5 3.5z" />
    <path d="M14.5 9h6v10.5l-3.5-2.5h-6.5v-4" />
  </Base>
)

export const FeatherIcon = (p: P) => (
  <Base {...p}>
    <path d="M20 4C12 4 6 9.5 6 17.5V20" />
    <path d="M20 4c0 7.5-5.5 12.5-13 12.5" />
    <path d="M10 13h5.5" />
  </Base>
)

export const ArrowRight = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
)

export const ArrowLeft = (p: P) => (
  <Base {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Base>
)

export const ExpandIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </Base>
)

export const HomeIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 11 12 4l8 7" />
    <path d="M6 9.5V20h12V9.5" />
  </Base>
)

export const CheckIcon = (p: P) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Base>
)

export const ToothIcon = (p: P) => (
  <Base {...p}>
    <path d="M8 3.5c-2.8 0-4.5 2.2-4.5 5.3 0 3.7 2.2 5.2 2.8 9.4.3 2 1 3.3 2 3.3 1.5 0 1.6-3 2.1-5.4.3-1.4 1-2.2 1.6-2.2s1.3.8 1.6 2.2c.5 2.4.6 5.4 2.1 5.4 1 0 1.7-1.3 2-3.3.6-4.2 2.8-5.7 2.8-9.4 0-3.1-1.7-5.3-4.5-5.3-2 0-2.6 1-4 1s-2-1-4-1z" />
  </Base>
)

const STYLE_ICONS: Record<StyleId, (p: P) => React.JSX.Element> = {
  science: BookIcon,
  official: DocIcon,
  public: MegaphoneIcon,
  talk: ChatIcon,
  art: FeatherIcon,
}

export function StyleIcon({ id, ...p }: P & { id: StyleId }) {
  const Icon = STYLE_ICONS[id]
  return <Icon {...p} />
}
