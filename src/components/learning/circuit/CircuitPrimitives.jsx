// Internal SVG building blocks for CircuitDiagram and CircuitSymbolReference.
// These are not global UI components: they form one governed scientific-diagram
// system so every circuit uses the same GCSE-recognisable symbol geometry.

import { resolveCircuitSwitchHitBox } from './circuitGeometry.js'

function CircuitArrow({
  x1,
  y1,
  x2,
  y2,
  stroke,
  strokeWidth = 2,
  headSize = 5,
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const leftAngle = angle + (Math.PI * 0.78)
  const rightAngle = angle - (Math.PI * 0.78)
  const leftX = x2 + (Math.cos(leftAngle) * headSize)
  const leftY = y2 + (Math.sin(leftAngle) * headSize)
  const rightX = x2 + (Math.cos(rightAngle) * headSize)
  const rightY = y2 + (Math.sin(rightAngle) * headSize)

  return (
    <g aria-hidden="true">
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={`${leftX},${leftY} ${x2},${y2} ${rightX},${rightY}`}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  )
}

export function CircuitPath({
  d,
  stroke,
  strokeWidth = 3,
  current = false,
  active = false,
  pulse = true,
  activeOpacity = 0.36,
  className = '',
}) {
  if (current) {
    const conductionClass = [
      'circuit-diagram__conduction',
      active ? 'circuit-diagram__conduction--active' : '',
      className,
    ].filter(Boolean).join(' ')
    const pulseClass = [
      'circuit-diagram__current-pulse',
      active ? 'circuit-diagram__current-pulse--active' : '',
    ].filter(Boolean).join(' ')

    return (
      <g
        data-circuit-component="current-path"
        data-active={active || undefined}
        aria-hidden="true"
      >
        <path
          className={conductionClass}
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ '--circuit-active-opacity': activeOpacity }}
        />
        {pulse && (
          <path
            className={pulseClass}
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={Math.max(1.5, strokeWidth - 0.5)}
            strokeLinecap="round"
            pathLength={1}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </g>
    )
  }

  return (
    <path
      className={className || undefined}
      data-circuit-component="wire"
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
    />
  )
}

/**
 * Standard GCSE cell symbol. `vertical` means the cell sits in a vertical wire,
 * so its long and short plates are horizontal. The geometry stays exam-standard;
 * colour is supplied separately by the renderer.
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
  plateGap = 10,
}) {
  const isVertical = orientation === 'vertical'

  return (
    <g data-circuit-component="cell" aria-hidden="true">
      {isVertical ? (
        <>
          <line
            x1={x - (longLength / 2)}
            y1={y}
            x2={x + (longLength / 2)}
            y2={y}
            stroke={plateFill}
            strokeWidth={3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={x - (shortLength / 2)}
            y1={y + plateGap}
            x2={x + (shortLength / 2)}
            y2={y + plateGap}
            stroke={plateFill}
            strokeWidth={3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {showPolarity && (
            <text
              x={x - (longLength / 2) - 5}
              y={y - 3}
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
          <line
            x1={x}
            y1={y - (longLength / 2)}
            x2={x}
            y2={y + (longLength / 2)}
            stroke={plateFill}
            strokeWidth={3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={x + plateGap}
            y1={y - (shortLength / 2)}
            x2={x + plateGap}
            y2={y + (shortLength / 2)}
            stroke={plateFill}
            strokeWidth={3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
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
        vectorEffect="non-scaling-stroke"
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
        vectorEffect="non-scaling-stroke"
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
        vectorEffect="non-scaling-stroke"
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
      fill={fill}
      stroke={active ? activeStroke : stroke}
      strokeWidth={2.5}
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
    />
  )
}

export function CircuitFuse({
  cx,
  cy,
  width = 42,
  height = 16,
  stroke,
  activeStroke,
  fill = 'none',
  active = false,
}) {
  const resolvedStroke = active ? activeStroke : stroke

  return (
    <g data-circuit-component="fuse" data-active={active || undefined} aria-hidden="true">
      <rect
        x={cx - (width / 2)}
        y={cy - (height / 2)}
        width={width}
        height={height}
        fill={fill}
        stroke={resolvedStroke}
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={cx - (width / 2)}
        y1={cy}
        x2={cx + (width / 2)}
        y2={cy}
        stroke={resolvedStroke}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  )
}

export function CircuitVariableResistor({
  cx,
  cy,
  width = 42,
  height = 16,
  stroke,
  activeStroke,
  fill = 'none',
  active = false,
}) {
  const resolvedStroke = active ? activeStroke : stroke

  return (
    <g data-circuit-component="variable-resistor" data-active={active || undefined} aria-hidden="true">
      <CircuitResistor
        cx={cx}
        cy={cy}
        width={width}
        height={height}
        stroke={resolvedStroke}
        activeStroke={resolvedStroke}
        fill={fill}
        active={active}
      />
      <CircuitArrow
        x1={cx - 18}
        y1={cy + 20}
        x2={cx + 20}
        y2={cy - 20}
        stroke={resolvedStroke}
      />
    </g>
  )
}

export function CircuitThermistor({
  cx,
  cy,
  width = 42,
  height = 16,
  stroke,
  activeStroke,
  fill = 'none',
  active = false,
}) {
  const resolvedStroke = active ? activeStroke : stroke

  return (
    <g data-circuit-component="thermistor" data-active={active || undefined} aria-hidden="true">
      <CircuitResistor
        cx={cx}
        cy={cy}
        width={width}
        height={height}
        stroke={resolvedStroke}
        activeStroke={resolvedStroke}
        fill={fill}
        active={active}
      />
      <polyline
        points={`${cx - 18},${cy + 22} ${cx + 16},${cy - 22} ${cx + 24},${cy - 22}`}
        fill="none"
        stroke={resolvedStroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  )
}

function CircuitDiodeGeometry({
  cx,
  cy,
  radius,
  stroke,
  fill,
}) {
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        points={`${cx - 10},${cy - 10} ${cx + 6},${cy} ${cx - 10},${cy + 10}`}
        fill="none"
        stroke={stroke}
        strokeWidth={2.2}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={cx + 7}
        y1={cy - 11}
        x2={cx + 7}
        y2={cy + 11}
        stroke={stroke}
        strokeWidth={2.2}
        vectorEffect="non-scaling-stroke"
      />
    </>
  )
}

export function CircuitDiode({
  cx,
  cy,
  radius = 18,
  stroke,
  activeStroke,
  fill = 'none',
  active = false,
}) {
  const resolvedStroke = active ? activeStroke : stroke

  return (
    <g data-circuit-component="diode" data-active={active || undefined} aria-hidden="true">
      <CircuitDiodeGeometry
        cx={cx}
        cy={cy}
        radius={radius}
        stroke={resolvedStroke}
        fill={fill}
      />
    </g>
  )
}

export function CircuitLed({
  cx,
  cy,
  radius = 18,
  stroke,
  activeStroke,
  fill = 'none',
  active = false,
}) {
  const resolvedStroke = active ? activeStroke : stroke

  return (
    <g data-circuit-component="led" data-active={active || undefined} aria-hidden="true">
      <CircuitDiodeGeometry
        cx={cx}
        cy={cy}
        radius={radius}
        stroke={resolvedStroke}
        fill={fill}
      />
      <CircuitArrow
        x1={cx + 10}
        y1={cy - 16}
        x2={cx + 23}
        y2={cy - 29}
        stroke={resolvedStroke}
        strokeWidth={1.8}
        headSize={4}
      />
      <CircuitArrow
        x1={cx + 17}
        y1={cy - 9}
        x2={cx + 30}
        y2={cy - 22}
        stroke={resolvedStroke}
        strokeWidth={1.8}
        headSize={4}
      />
    </g>
  )
}

export function CircuitLdr({
  cx,
  cy,
  radius = 21,
  stroke,
  activeStroke,
  fill = 'none',
  active = false,
}) {
  const resolvedStroke = active ? activeStroke : stroke

  return (
    <g data-circuit-component="ldr" data-active={active || undefined} aria-hidden="true">
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={fill}
        stroke={resolvedStroke}
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
      />
      <rect
        x={cx - 11}
        y={cy - 6}
        width={22}
        height={12}
        fill="none"
        stroke={resolvedStroke}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
      <CircuitArrow
        x1={cx - 31}
        y1={cy - 31}
        x2={cx - 18}
        y2={cy - 18}
        stroke={resolvedStroke}
        strokeWidth={1.8}
        headSize={4}
      />
      <CircuitArrow
        x1={cx - 20}
        y1={cy - 35}
        x2={cx - 7}
        y2={cy - 22}
        stroke={resolvedStroke}
        strokeWidth={1.8}
        headSize={4}
      />
    </g>
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
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
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
  terminalFill = 'transparent',
  onToggle,
  label = 'Circuit switch',
  describedBy,
  semantic = true,
  openAngle = -24,
  hitPaddingX = 19,
  hitPaddingY = 26,
  minHitWidth = 64,
  minHitHeight = 52,
}) {
  const hitBox = resolveCircuitSwitchHitBox({
    left,
    right,
    y,
    hitPaddingX,
    hitPaddingY,
    minHitWidth,
    minHitHeight,
  })
  const terminalStroke = closed ? accent : wireStroke
  const armStroke = closed ? accent : inactiveStroke

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onToggle?.()
  }

  const semanticProps = semantic
    ? {
        role: 'switch',
        'aria-checked': closed,
        'aria-label': label,
        'aria-describedby': describedBy,
        'aria-disabled': disabled || undefined,
        'aria-keyshortcuts': 'Enter Space',
        tabIndex: disabled ? -1 : 0,
        onClick: disabled ? undefined : onToggle,
        onKeyDown: disabled ? undefined : handleKeyDown,
      }
    : {
        'aria-hidden': true,
      }

  return (
    <g
      className="circuit-diagram__switch-control"
      data-circuit-component="switch"
      data-active={closed || undefined}
      data-disabled={disabled || undefined}
      {...semanticProps}
    >
      <rect
        data-circuit-hit-target={semantic ? 'true' : undefined}
        x={hitBox.x}
        y={hitBox.y}
        width={hitBox.width}
        height={hitBox.height}
        rx={14}
        fill="transparent"
      />
      <rect
        className="circuit-diagram__switch-focus"
        x={hitBox.x + 4}
        y={hitBox.y + 4}
        width={hitBox.width - 8}
        height={hitBox.height - 8}
        rx={12}
        fill="none"
        stroke={accent}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={left}
        cy={y}
        r={4.5}
        fill={terminalFill}
        stroke={terminalStroke}
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={right}
        cy={y}
        r={4.5}
        fill={terminalFill}
        stroke={terminalStroke}
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
      />
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
          stroke={armStroke}
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
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
  textAnchor = 'start',
  fontSize = 11,
  fontWeight,
}) {
  return (
    <text
      data-circuit-component="label"
      x={x}
      y={y}
      fill={fill}
      textAnchor={textAnchor}
      fontSize={fontSize}
      fontWeight={fontWeight}
      style={{ pointerEvents: 'none' }}
    >
      {children}
    </text>
  )
}
