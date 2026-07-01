import { useState } from 'react'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { SUBJECTS } from '../../constants/subjects.js'

// ── Medieval diagnosis chamber ────────────────────────────────────────────────
//
// Cinematic 9:16 hero scene for the Chapter 1 Medicine cause → treatment
// interaction. A candlelit portrait of Thomas forms the grounded base layer,
// while the four medieval explanations of illness materialise around him as
// selectable zones, each paired with its treatment symbol:
//
//   God & sin      → church window + prayer candle
//   Four humours   → four balanced fluid circles + bleeding bowl
//   Miasma         → drifting bad air from a refuse heap + herb posy
//   Astrology      → slowly rotating parchment star chart + timing window
//
// Intro choreography runs ~5s, then settles into a calm idle loop (chart
// rotation, miasma drift, a slow photo breathe). Reduced-motion users get
// the static end state — that render IS the fallback image.

const PHOTO = '/History/Medicine/thomas-diagnosis-chamber-1024.webp'

const ACCENT = SUBJECTS.History.accent
const ACCENT_RGB = SUBJECTS.History.accentRgb

const SCENE = {
  parchment:      'rgba(245,238,217,0.78)',
  parchmentFaint: 'rgba(240,224,176,0.10)',
  candleWax:      '#D9C79F',
  herb:           '#5F6B38',
  herbLight:      '#6B7841',
  wisp:           '#6E6248',
  blood:          '#7E2B24',
  yellowBile:     '#A98430',
  phlegm:         '#B7B09C',
  blackBile:      '#26221D',
}

const CSS = `
  @keyframes mds-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes mds-rise-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mds-flicker {
    0%, 100% { opacity: 1;    transform: scaleY(1); }
    38%      { opacity: 0.86; transform: scaleY(0.965); }
    62%      { opacity: 0.95; transform: scaleY(1.03); }
  }
  @keyframes mds-halo {
    0%, 100% { opacity: 0.9; }
    50%      { opacity: 0.65; }
  }
  @keyframes mds-rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes mds-breathe {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.018); }
  }
  @keyframes mds-drift {
    0%, 100% { transform: translateX(0);    opacity: 0.55; }
    50%      { transform: translateX(-5px); opacity: 0.28; }
  }
  @keyframes mds-window-glow {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.72; }
  }
`

const ZONES = {
  'god-sin':      { label: 'God & sin',    bounds: { x: 36,  y: 52,  w: 104, h: 164 }, labelY: 204, delay: 900,  glyphDelay: 1500 },
  'four-humours': { label: 'Four humours', bounds: { x: 34,  y: 496, w: 116, h: 116 }, labelY: 596, delay: 1800, glyphDelay: 2400 },
  'miasma':       { label: 'Miasma',       bounds: { x: 216, y: 496, w: 116, h: 116 }, labelY: 596, delay: 2700, glyphDelay: 3300 },
  'astrology':    { label: 'Astrology',    bounds: { x: 220, y: 56,  w: 104, h: 160 }, labelY: 204, delay: 3600, glyphDelay: 4200 },
}

// ── Zone shell — entrance, press feedback, hit area, label, explored state ───

function ZoneShell({ id, zone, done, onSelect, reduced, playIntro, children }) {
  const [pressed, setPressed] = useState(false)
  const { bounds, label, labelY, delay } = zone
  const cx = bounds.x + bounds.w / 2

  const entrance = reduced || !playIntro
    ? 'none'
    : `mds-rise-in ${MOTION.duration.cinematic} ${MOTION.easing.standard} ${delay}ms both`

  return (
    <g style={{ animation: entrance }}>
      <g
        role="button"
        tabIndex={0}
        aria-label={`Explore ${label}`}
        onClick={() => onSelect?.(id)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(id) }
        }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        style={{
          cursor: onSelect ? 'pointer' : 'default',
          outline: 'none',
          transformBox: 'fill-box',
          transformOrigin: 'center',
          transform: pressed ? `scale(${MOTION.scale.press})` : 'scale(1)',
          transition: `transform ${MOTION.duration.fast} ${MOTION.easing.standard}`,
        }}
      >
        <rect
          x={bounds.x} y={bounds.y} width={bounds.w} height={bounds.h} rx={16}
          fill={done ? `rgba(${ACCENT_RGB},0.05)` : 'rgba(240,224,176,0.028)'}
          stroke={done ? `rgba(${ACCENT_RGB},0.38)` : SCENE.parchmentFaint}
          strokeWidth={1}
          style={{
            transition: [
              `stroke ${MOTION.duration.slow} ${MOTION.easing.standard}`,
              `fill ${MOTION.duration.slow} ${MOTION.easing.standard}`,
            ].join(', '),
          }}
        />
        {children}
        <text
          x={cx}
          y={labelY}
          textAnchor="middle"
          fill={done ? ACCENT : SCENE.parchment}
          style={{
            fontFamily: TYPE.label.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          {label}
        </text>
        {done && (
          <g>
            <circle
              cx={bounds.x + bounds.w - 12} cy={bounds.y + 12} r={8}
              fill={`rgba(${ACCENT_RGB},0.18)`}
              stroke={`rgba(${ACCENT_RGB},0.55)`}
              strokeWidth={1}
            />
            <text
              x={bounds.x + bounds.w - 12} y={bounds.y + 15.5}
              textAnchor="middle" fontSize={9} fill={ACCENT}
              style={{ fontFamily: TYPE.label.fontFamily }}
            >
              ✓
            </text>
          </g>
        )}
      </g>
    </g>
  )
}

// ── Main scene ────────────────────────────────────────────────────────────────

export default function MedievalDiagnosisScene({
  theories = [],
  completedIds = [],
  onSelectZone,
  playIntro = true,
  prefersReducedMotion = null,
  style,
}) {
  const reduced = prefersReducedMotion ?? (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const visibleZoneIds = Object.keys(ZONES).filter(id =>
    theories.length === 0 || theories.some(t => t.id === id)
  )

  const roomEntrance = reduced || !playIntro
    ? 'none'
    : `mds-fade-in ${MOTION.duration.cinematic} ${MOTION.easing.gentle} 0ms both`

  const glyph = delay => ({
    animation: reduced || !playIntro
      ? 'none'
      : `mds-fade-in ${MOTION.duration.cinematic} ${MOTION.easing.standard} ${delay}ms both`,
  })

  const loop = animation => (reduced ? 'none' : animation)

  const fillBox = { transformBox: 'fill-box', transformOrigin: 'center' }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '9 / 16',
        borderRadius: RADII.large,
        overflow: 'hidden',
        background: '#0A0805',
        border: `1px solid rgba(${ACCENT_RGB},0.12)`,
        ...style,
      }}
      role="img"
      aria-label="Thomas, a sick medieval patient, sits at a candlelit table surrounded by the four medieval explanations of illness: God and sin, the four humours, miasma, and astrology."
    >
      <style>{CSS}</style>

      {/* ── Thomas, candlelit — the grounded base layer ────────────────────── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', animation: roomEntrance }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${PHOTO})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.74) saturate(0.94)',
            animation: loop('mds-breathe 14s ease-in-out infinite'),
          }}
        />
      </div>

      {/* Candlelight glow, positioned over the candle in the photo */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '2%',
          bottom: '30%',
          width: '46%',
          height: '22%',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${ACCENT_RGB},0.22), rgba(${ACCENT_RGB},0.06) 55%, rgba(${ACCENT_RGB},0) 75%)`,
          animation: loop('mds-halo 2.8s ease-in-out infinite'),
        }}
      />

      {/* Vignette + top/bottom legibility gradients */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            'radial-gradient(ellipse at center, rgba(4,3,2,0) 55%, rgba(4,3,2,0.55) 100%)',
            'linear-gradient(180deg, rgba(6,4,2,0.34) 0%, rgba(6,4,2,0) 20%, rgba(6,4,2,0) 78%, rgba(6,4,2,0.30) 100%)',
          ].join(', '),
        }}
      />

      <svg
        viewBox="0 0 360 640"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="mds-flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7E3A6" />
            <stop offset="100%" stopColor="#D98E3B" />
          </linearGradient>
          <linearGradient id="mds-window" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(226,181,109,0.22)" />
            <stop offset="100%" stopColor="rgba(226,181,109,0.04)" />
          </linearGradient>
        </defs>

        {/* ── The four explanations, as selectable zones around Thomas ──────── */}

        {visibleZoneIds.includes('god-sin') && (
          <ZoneShell
            id="god-sin" zone={ZONES['god-sin']}
            done={completedIds.includes('god-sin')}
            onSelect={onSelectZone} reduced={reduced} playIntro={playIntro}
          >
            {/* Church window — the mullion forms the cross; soft warm light */}
            <path
              d="M62,160 L62,104 Q62,74 88,64 Q114,74 114,104 L114,160 Z"
              fill="url(#mds-window)" stroke="rgba(240,224,176,0.5)" strokeWidth="1.5"
              style={{ animation: loop('mds-window-glow 9s ease-in-out infinite') }}
            />
            <line x1="88" y1="64" x2="88" y2="160" stroke="rgba(226,181,109,0.5)" strokeWidth="1.5" />
            <line x1="62" y1="118" x2="114" y2="118" stroke="rgba(226,181,109,0.5)" strokeWidth="1.5" />
            {/* Treatment: a prayer candle beneath the window */}
            <g style={glyph(ZONES['god-sin'].glyphDelay)}>
              <rect x="84.5" y="170" width="7" height="13" rx="1.5" fill={SCENE.candleWax} opacity="0.9" />
              <g style={{ ...fillBox, transformOrigin: '50% 100%', animation: loop('mds-flicker 3.4s ease-in-out infinite') }}>
                <path d="M88,157 C90.5,161 91,164 88,166.5 C85,164 85.5,161 88,157 Z" fill="url(#mds-flame)" />
              </g>
            </g>
          </ZoneShell>
        )}

        {visibleZoneIds.includes('astrology') && (
          <ZoneShell
            id="astrology" zone={ZONES['astrology']}
            done={completedIds.includes('astrology')}
            onSelect={onSelectZone} reduced={reduced} playIntro={playIntro}
          >
            {/* Parchment star chart — outer rings static, markings rotate slowly */}
            <circle cx="272" cy="118" r="42" fill="rgba(232,217,176,0.06)" stroke="rgba(240,224,176,0.45)" strokeWidth="1.2" />
            <circle cx="272" cy="118" r="27" fill="none" stroke="rgba(240,224,176,0.2)" strokeWidth="1" />
            <g style={{ ...fillBox, animation: loop('mds-rotate 90s linear infinite') }}>
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i * 30 * Math.PI) / 180
                return (
                  <line
                    key={i}
                    x1={272 + 30 * Math.cos(a)} y1={118 + 30 * Math.sin(a)}
                    x2={272 + 39 * Math.cos(a)} y2={118 + 39 * Math.sin(a)}
                    stroke="rgba(240,224,176,0.35)" strokeWidth="1.2"
                  />
                )
              })}
              <circle cx="272" cy="100" r="1.6" fill="rgba(245,238,217,0.7)" />
              <circle cx="258" cy="126" r="1.2" fill="rgba(245,238,217,0.55)" />
              <circle cx="284" cy="130" r="1.4" fill="rgba(245,238,217,0.6)" />
              <circle cx="279" cy="107" r="1" fill="rgba(245,238,217,0.5)" />
            </g>
            {/* Treatment: a favourable timing window marked on the chart */}
            <g style={glyph(ZONES.astrology.glyphDelay)}>
              <path
                d="M283.5,92.6 A27 27 0 0 1 297.4,106.5 L311.6,101.1 A42 42 0 0 0 289.9,79.4 Z"
                fill={`rgba(${ACCENT_RGB},0.16)`} stroke={`rgba(${ACCENT_RGB},0.45)`} strokeWidth="1"
              />
            </g>
          </ZoneShell>
        )}

        {visibleZoneIds.includes('four-humours') && (
          <ZoneShell
            id="four-humours" zone={ZONES['four-humours']}
            done={completedIds.includes('four-humours')}
            onSelect={onSelectZone} reduced={reduced} playIntro={playIntro}
          >
            {/* Four fluids in balance — blood, yellow bile, phlegm, black bile */}
            <path d="M84,518 L62,540 L84,562 L106,540 Z" fill="none" stroke="rgba(240,224,176,0.12)" strokeWidth="1" />
            <circle cx="84" cy="518" r="10" fill={SCENE.blood} fillOpacity="0.85" stroke="rgba(240,224,176,0.25)" strokeWidth="1" />
            <circle cx="62" cy="540" r="10" fill={SCENE.yellowBile} fillOpacity="0.85" stroke="rgba(240,224,176,0.25)" strokeWidth="1" />
            <circle cx="106" cy="540" r="10" fill={SCENE.phlegm} fillOpacity="0.85" stroke="rgba(240,224,176,0.25)" strokeWidth="1" />
            <circle cx="84" cy="562" r="10" fill={SCENE.blackBile} stroke="rgba(240,224,176,0.35)" strokeWidth="1" />
            {/* Treatment: a bleeding bowl with a single drop */}
            <g style={glyph(ZONES['four-humours'].glyphDelay)}>
              <path d="M130,548 C131.5,550.5 132,552.5 130,554 C128,552.5 128.5,550.5 130,548 Z" fill={SCENE.blood} />
              <path d="M119,558 A11 8 0 0 0 141,558 L139,564 A9 6 0 0 1 121,564 Z" fill="#2E2317" stroke="rgba(240,224,176,0.3)" strokeWidth="1" />
            </g>
          </ZoneShell>
        )}

        {visibleZoneIds.includes('miasma') && (
          <ZoneShell
            id="miasma" zone={ZONES['miasma']}
            done={completedIds.includes('miasma')}
            onSelect={onSelectZone} reduced={reduced} playIntro={playIntro}
          >
            {/* Refuse heap and drifting bad air */}
            <path d="M282,566 Q290,556 300,562 Q308,556 316,566 L316,570 Q299,574 282,570 Z" fill="#201808" stroke="rgba(240,224,176,0.08)" strokeWidth="1" />
            <g fill="none" stroke={SCENE.wisp} strokeLinecap="round">
              <path
                d="M298,560 C290,548 298,540 288,528 C280,518 286,508 278,500"
                strokeWidth="2.5" opacity="0.4"
                style={{ animation: loop('mds-drift 7s ease-in-out infinite') }}
              />
              <path
                d="M306,564 C300,552 308,540 298,526 C292,516 298,508 292,500"
                strokeWidth="2" opacity="0.3"
                style={{ animation: loop('mds-drift 8.5s ease-in-out 1.2s infinite') }}
              />
              <path
                d="M290,556 C282,548 288,536 278,526"
                strokeWidth="2" opacity="0.26"
                style={{ animation: loop('mds-drift 6s ease-in-out 2.1s infinite') }}
              />
            </g>
            {/* Treatment: a small herb posy */}
            <g style={glyph(ZONES.miasma.glyphDelay)}>
              <line x1="238" y1="566" x2="232" y2="546" stroke={SCENE.herb} strokeWidth="1.6" strokeLinecap="round" />
              <line x1="238" y1="566" x2="238" y2="542" stroke={SCENE.herb} strokeWidth="1.6" strokeLinecap="round" />
              <line x1="238" y1="566" x2="244" y2="546" stroke={SCENE.herb} strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="232" cy="545" r="2.6" fill={SCENE.herbLight} />
              <circle cx="238" cy="541" r="2.6" fill={SCENE.herbLight} />
              <circle cx="244" cy="545" r="2.6" fill={SCENE.herbLight} />
              <polygon points="233,566 243,566 238,576" fill="rgba(232,217,176,0.25)" />
            </g>
          </ZoneShell>
        )}
      </svg>
    </div>
  )
}
