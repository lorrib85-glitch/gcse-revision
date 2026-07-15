// Internal SVG building blocks for CircuitDiagram.
// These are not global UI components: they form one governed scientific-diagram
// system so future circuit presets can reuse the same symbols and states.

export function CircuitPath({
  d,
  stroke,
  strokeWidth = 3,
  current = false,
  active = false,
  className = '',
}) {
  const classes = [
    current ? 'circuit-diagram__current' : '',
    current && active ? 'circuit-diagram__current--active' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <path
      className={classes || undefined}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
    />
  )
}

export function CircuitBattery({
  x,
  y,
  plateFill,
  polarityFill,
}) {
  return (
    <g aria-hidden="true">
      <rect x={x - 16} y={y} width={32} height={3} rx={1.5} fill={plateFill} />
      <rect x={x - 10} y={y + 9} width={20} height={7} rx={2} fill={plateFill} />
      <rect x={x - 16} y={y + 24} width={32} height={3} rx={1.5} fill={plateFill} />
      <rect x={x - 10} y={y + 33} width={20} height={7} rx={2} fill={plateFill} />
      <text
        x={x - 21}
        y={y - 2}
        textAnchor="end"
        fill={polarityFill}
        fontSize={12}
      >
        +
      </text>
    </g>
  )
}

export function CircuitLamp({
  cx,
  cy,
  radius = 18,
  lit,
  wireStroke,
  lightStroke,
  offFill,
  litFill,
  haloFill,
}) {
  const haloClass = `circuit-diagram__bulb-halo${lit ? ' circuit-diagram__bulb-halo--lit' : ''}`
  const faceClass = `circuit-diagram__bulb-face${lit ? ' circuit-diagram__bulb-face--lit' : ''}`
  const filamentClass = `circuit-diagram__bulb-filament${lit ? ' circuit-diagram__bulb-filament--lit' : ''}`
  const filamentOffset = radius * (2 / 3)

  return (
    <g aria-hidden="true">
      <circle
        className={haloClass}
        cx={cx}
        cy={cy}
        r={radius + 9}
        fill={haloFill}
      />
      <circle
        className={faceClass}
        cx={cx}
        cy={cy}
        r={radius}
        fill={lit ? litFill : offFill}
        stroke={lit ? lightStroke : wireStroke}
        strokeWidth={3}
      />
      <line
        className={filamentClass}
        x1={cx - filamentOffset}
        y1={cy - filamentOffset}
        x2={cx + filamentOffset}
        y2={cy + filamentOffset}
        stroke={lit ? lightStroke : wireStroke}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <line
        className={filamentClass}
        x1={cx - filamentOffset}
        y1={cy + filamentOffset}
        x2={cx + filamentOffset}
        y2={cy - filamentOffset}
        stroke={lit ? lightStroke : wireStroke}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </g>
  )
}

export function CircuitSwitch({
  left,
  right,
  y,
  closed,
  disabled = false,
  accent,
  wireStroke,
  inactiveStroke,
  onToggle,
  openAngle = -24,
  hitPaddingX = 19,
  hitPaddingY = 26,
}) {
  const width = right - left
  const hitWidth = width + (hitPaddingX * 2)
  const hitHeight = hitPaddingY * 2 + 6

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onToggle?.()
  }

  return (
    <g
      className="circuit-diagram__switch-control"
      role="switch"
      aria-checked={closed}
      aria-label={closed ? 'Open the circuit switch' : 'Close the circuit switch'}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onToggle}
      onKeyDown={disabled ? undefined : handleKeyDown}
    >
      <rect
        x={left - hitPaddingX}
        y={y - hitPaddingY}
        width={hitWidth}
        height={hitHeight}
        rx={14}
        fill="transparent"
      />
      <rect
        className="circuit-diagram__switch-focus"
        x={left - hitPaddingX + 4}
        y={y - hitPaddingY + 4}
        width={hitWidth - 8}
        height={hitHeight - 8}
        rx={12}
        fill="none"
        stroke={accent}
        strokeWidth={1.5}
      />
      <circle cx={left} cy={y} r={4} fill={closed ? accent : wireStroke} />
      <circle cx={right} cy={y} r={4} fill={closed ? accent : wireStroke} />
      <g
        className="circuit-diagram__switch-arm"
        style={{
          transform: `rotate(${closed ? 0 : openAngle}deg)`,
          transformOrigin: `${left}px ${y}px`,
        }}
      >
        <line
          x1={left}
          y1={y}
          x2={right}
          y2={y}
          stroke={closed ? accent : inactiveStroke}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      </g>
    </g>
  )
}

export function CircuitLabel({
  x,
  y,
  children,
  fill,
  textAnchor,
  fontSize = 11,
  fontWeight,
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      textAnchor={textAnchor}
      fontSize={fontSize}
      fontWeight={fontWeight}
    >
      {children}
    </text>
  )
}
