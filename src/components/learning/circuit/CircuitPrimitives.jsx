// Internal SVG building blocks for CircuitDiagram.
// These are not global UI components: they form one governed scientific-diagram
// system so future circuit presets can reuse the same GCSE symbols and states.

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
      data-circuit-component={current ? 'current-path' : 'wire'}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
    />
  )
}

/**
 * Standard GCSE cell symbol. `x` and `y` locate the long plate's centre/top
 * edge, matching the original CircuitDiagram battery geometry.
 */
export function CircuitCell({
  x,
  y,
  orientation = 'vertical',
  plateFill,
  polarityFill,
  showPolarity = false,
  longLength = 32,
  shortLength = 20,
}) {
  const isVertical = orientation === 'vertical'

  return (
    <g data-circuit-component="cell" aria-hidden="true">
      {isVertical ? (
        <>
          <rect
            x={x - (longLength / 2)}
            y={y}
            width={longLength}
            height={3}
            rx={1.5}
            fill={plateFill}
          />
          <rect
            x={x - (shortLength / 2)}
            y={y + 9}
            width={shortLength}
            height={7}
            rx={2}
            fill={plateFill}
          />
          {showPolarity && (
            <text
              x={x - (longLength / 2) - 5}
              y={y - 2}
              textAnchor="end"
              fill={polarityFill}
              fontSize={12}
            >
              +
            </text>
          )}
        </>
      ) : (
        <>
          <rect
            x={x}
            y={y - (longLength / 2)}
            width={3}
            height={longLength}
            rx={1.5}
            fill={plateFill}
          />
          <rect
            x={x + 9}
            y={y - (shortLength / 2)}
            width={7}
            height={shortLength}
            rx={2}
            fill={plateFill}
          />
          {showPolarity && (
            <text
              x={x - 3}
              y={y - (longLength / 2) - 5}
              textAnchor="middle"
              fill={polarityFill}
              fontSize={12}
            >
              +
            </text>
          )}
        </>
      )}
    </g>
  )
}

export function CircuitBattery({
  x,
  y,
  orientation = 'vertical',
  plateFill,
  polarityFill,
  cells = 2,
  cellSpacing = 24,
}) {
  const safeCells = Math.max(1, Math.round(cells))

  return (
    <g data-circuit-component="battery" aria-hidden="true">
      {Array.from({ length: safeCells }, (_, index) => (
        <CircuitCell
          key={index}
          x={orientation === 'vertical' ? x : x + (index * cellSpacing)}
          y={orientation === 'vertical' ? y + (index * cellSpacing) : y}
          orientation={orientation}
          plateFill={plateFill}
          polarityFill={polarityFill}
          showPolarity={index === 0}
        />
      ))}
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
    <g data-circuit-component="lamp" data-active={lit || undefined} aria-hidden="true">
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

export function CircuitResistor({
  cx,
  cy,
  orientation = 'horizontal',
  width = 42,
  height = 16,
  stroke,
  activeStroke,
  fill = 'none',
  active = false,
}) {
  const isVertical = orientation === 'vertical'
  const renderedWidth = isVertical ? height : width
  const renderedHeight = isVertical ? width : height

  return (
    <rect
      data-circuit-component="resistor"
      data-active={active || undefined}
      x={cx - (renderedWidth / 2)}
      y={cy - (renderedHeight / 2)}
      width={renderedWidth}
      height={renderedHeight}
      rx={2}
      fill={fill}
      stroke={active ? activeStroke : stroke}
      strokeWidth={3}
      aria-hidden="true"
    />
  )
}

export function CircuitMeter({
  cx,
  cy,
  symbol,
  radius = 18,
  stroke,
  activeStroke,
  textFill,
  activeTextFill,
  fill = 'none',
  active = false,
  type = 'meter',
}) {
  const resolvedStroke = active ? activeStroke : stroke
  const resolvedText = active ? (activeTextFill ?? activeStroke) : textFill

  return (
    <g data-circuit-component={type} data-active={active || undefined} aria-hidden="true">
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={fill}
        stroke={resolvedStroke}
        strokeWidth={3}
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fill={resolvedText}
        fontFamily="Sora, sans-serif"
        fontSize={radius * 0.9}
        fontWeight={700}
      >
        {symbol}
      </text>
    </g>
  )
}

export function CircuitAmmeter(props) {
  return <CircuitMeter {...props} symbol="A" type="ammeter" />
}

export function CircuitVoltmeter(props) {
  return <CircuitMeter {...props} symbol="V" type="voltmeter" />
}

export function CircuitJunction({
  cx,
  cy,
  radius = 4,
  fill,
  activeFill,
  active = false,
}) {
  return (
    <circle
      data-circuit-component="junction"
      data-active={active || undefined}
      cx={cx}
      cy={cy}
      r={radius}
      fill={active ? activeFill : fill}
      aria-hidden="true"
    />
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
      data-circuit-component="switch"
      data-active={closed || undefined}
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
