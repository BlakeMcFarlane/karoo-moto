import type { ArtKind } from '../../data/types'

// Technical, blueprint-style line illustrations that stand in for studio
// product photography. Brushed-steel linework with a single bronze accent,
// framed by registration marks and dimension ticks. Replace with real
// photography at launch (see README).

const STEEL = '#b4afa6'
const BRONZE = '#b3763f'
const DIM = '#6c6760'

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* registration corners */}
      <g stroke={DIM} strokeWidth="1" fill="none" opacity="0.7">
        <path d="M18 30 L18 18 L30 18" />
        <path d="M382 30 L382 18 L370 18" />
        <path d="M18 270 L18 282 L30 282" />
        <path d="M382 270 L382 282 L370 282" />
      </g>
      {/* centre crosshair */}
      <g stroke={DIM} strokeWidth="0.75" opacity="0.35">
        <line x1="200" y1="40" x2="200" y2="60" />
        <line x1="200" y1="240" x2="200" y2="260" />
        <line x1="40" y1="150" x2="60" y2="150" />
        <line x1="340" y1="150" x2="360" y2="150" />
      </g>
      {children}
      {/* watermark */}
      <text
        x="200"
        y="288"
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize="8"
        letterSpacing="3"
        fill={DIM}
        opacity="0.6"
      >
        KAROO MOTO · SPEC
      </text>
    </svg>
  )
}

function Tower() {
  return (
    <Frame>
      <g fill="none" stroke={STEEL} strokeWidth="2.2" strokeLinejoin="round">
        <path d="M150 240 L150 110 L200 78 L250 110 L250 240" />
        <path d="M150 150 L250 150" />
        <path d="M150 195 L250 195" />
        <path d="M130 240 L270 240" />
        <path d="M170 110 L170 240 M230 110 L230 240" opacity="0.5" />
      </g>
      {/* mounting plate + device window (bronze accent) */}
      <rect x="168" y="92" width="64" height="42" rx="3" fill="none" stroke={BRONZE} strokeWidth="2.4" />
      <line x1="200" y1="66" x2="200" y2="78" stroke={BRONZE} strokeWidth="2.4" />
      {/* bolt points */}
      <g fill={STEEL}>
        <circle cx="150" cy="150" r="3" />
        <circle cx="250" cy="150" r="3" />
        <circle cx="150" cy="195" r="3" />
        <circle cx="250" cy="195" r="3" />
      </g>
      {/* dimension line */}
      <g stroke={DIM} strokeWidth="1">
        <line x1="130" y1="256" x2="270" y2="256" />
        <line x1="130" y1="252" x2="130" y2="260" />
        <line x1="270" y1="252" x2="270" y2="260" />
      </g>
    </Frame>
  )
}

function Dash() {
  return (
    <Frame>
      <g fill="none" stroke={STEEL} strokeWidth="2.4" strokeLinejoin="round">
        <rect x="110" y="96" width="180" height="108" rx="6" />
        <rect x="126" y="112" width="86" height="76" rx="3" />
      </g>
      {/* roadbook window (bronze) */}
      <rect x="224" y="112" width="52" height="76" rx="3" fill="none" stroke={BRONZE} strokeWidth="2.6" />
      <g stroke={BRONZE} strokeWidth="2">
        <line x1="234" y1="126" x2="266" y2="126" />
        <line x1="234" y1="150" x2="266" y2="150" />
        <line x1="234" y1="174" x2="266" y2="174" />
      </g>
      {/* mount rails */}
      <g stroke={STEEL} strokeWidth="2">
        <line x1="90" y1="150" x2="110" y2="150" />
        <line x1="290" y1="150" x2="310" y2="150" />
        <circle cx="90" cy="150" r="4" fill="none" />
        <circle cx="310" cy="150" r="4" fill="none" />
      </g>
    </Frame>
  )
}

function SkidPlate() {
  return (
    <Frame>
      <path
        d="M96 120 C 140 108, 260 108, 304 120 L296 176 C 268 202, 132 202, 104 176 Z"
        fill="none"
        stroke={STEEL}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M120 132 C 160 124, 240 124, 280 132"
        fill="none"
        stroke={DIM}
        strokeWidth="1.4"
        opacity="0.7"
      />
      {/* drainage + accent ridge */}
      <path d="M170 180 L230 180" stroke={BRONZE} strokeWidth="2.6" />
      <g fill={STEEL}>
        <circle cx="118" cy="128" r="3.4" />
        <circle cx="282" cy="128" r="3.4" />
        <circle cx="128" cy="182" r="3.4" />
        <circle cx="272" cy="182" r="3.4" />
      </g>
    </Frame>
  )
}

function Rack() {
  return (
    <Frame>
      <g fill="none" stroke={STEEL} strokeWidth="2.4" strokeLinejoin="round">
        <rect x="120" y="112" width="160" height="76" rx="10" />
        <line x1="120" y1="138" x2="280" y2="138" />
        <line x1="120" y1="162" x2="280" y2="162" />
        <line x1="160" y1="112" x2="160" y2="188" />
        <line x1="200" y1="112" x2="200" y2="188" />
        <line x1="240" y1="112" x2="240" y2="188" />
      </g>
      {/* billet mounts (bronze) */}
      <g fill="none" stroke={BRONZE} strokeWidth="2.6">
        <rect x="108" y="196" width="26" height="16" rx="2" />
        <rect x="266" y="196" width="26" height="16" rx="2" />
      </g>
      <line x1="121" y1="196" x2="134" y2="188" stroke={BRONZE} strokeWidth="2" />
      <line x1="279" y1="196" x2="266" y2="188" stroke={BRONZE} strokeWidth="2" />
    </Frame>
  )
}

function Light() {
  return (
    <Frame>
      <rect x="120" y="128" width="160" height="44" rx="8" fill="none" stroke={STEEL} strokeWidth="2.6" />
      <g fill="none" stroke={STEEL} strokeWidth="1.8">
        <circle cx="146" cy="150" r="13" />
        <circle cx="182" cy="150" r="13" />
        <circle cx="218" cy="150" r="13" />
        <circle cx="254" cy="150" r="13" />
      </g>
      {/* beam rays (bronze) */}
      <g stroke={BRONZE} strokeWidth="2" opacity="0.85">
        <line x1="200" y1="128" x2="200" y2="108" />
        <line x1="150" y1="126" x2="132" y2="104" />
        <line x1="250" y1="126" x2="268" y2="104" />
        <line x1="176" y1="126" x2="166" y2="106" />
        <line x1="224" y1="126" x2="234" y2="106" />
      </g>
      {/* bracket */}
      <g stroke={STEEL} strokeWidth="2.4" fill="none">
        <line x1="150" y1="172" x2="150" y2="188" />
        <line x1="250" y1="172" x2="250" y2="188" />
      </g>
    </Frame>
  )
}

function Billet() {
  return (
    <Frame>
      <circle cx="200" cy="150" r="58" fill="none" stroke={STEEL} strokeWidth="2.6" />
      <circle cx="200" cy="150" r="40" fill="none" stroke={DIM} strokeWidth="1.4" opacity="0.7" />
      <circle cx="200" cy="150" r="18" fill="none" stroke={BRONZE} strokeWidth="2.8" />
      {/* machined fins */}
      <g stroke={STEEL} strokeWidth="2">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const r = (a * Math.PI) / 180
          return (
            <line
              key={a}
              x1={200 + Math.cos(r) * 40}
              y1={150 + Math.sin(r) * 40}
              x2={200 + Math.cos(r) * 58}
              y2={150 + Math.sin(r) * 58}
            />
          )
        })}
      </g>
      {/* bolt holes */}
      <g fill={STEEL}>
        {[30, 150, 270].map((a) => {
          const r = (a * Math.PI) / 180
          return <circle key={a} cx={200 + Math.cos(r) * 30} cy={150 + Math.sin(r) * 30} r="3.2" />
        })}
      </g>
    </Frame>
  )
}

function Mount() {
  return (
    <Frame>
      <g fill="none" stroke={STEEL} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M150 120 L250 120 L250 160 L214 160 L200 184 L186 160 L150 160 Z" />
        <circle cx="200" cy="140" r="14" />
      </g>
      {/* clamp (bronze) */}
      <g fill="none" stroke={BRONZE} strokeWidth="2.6">
        <path d="M132 150 C 132 132, 160 132, 160 150 C 160 168, 132 168, 132 150 Z" />
        <path d="M240 150 C 240 132, 268 132, 268 150 C 268 168, 240 168, 240 150 Z" />
      </g>
      <g fill={STEEL}>
        <circle cx="176" cy="132" r="3" />
        <circle cx="224" cy="132" r="3" />
      </g>
    </Frame>
  )
}

const MAP: Record<ArtKind, () => JSX.Element> = {
  tower: Tower,
  dash: Dash,
  skidplate: SkidPlate,
  rack: Rack,
  light: Light,
  billet: Billet,
  mount: Mount,
}

export default function ProductArt({ kind }: { kind: ArtKind }) {
  const Cmp = MAP[kind] ?? Billet
  return <Cmp />
}
