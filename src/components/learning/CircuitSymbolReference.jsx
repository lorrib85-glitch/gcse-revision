import { GENERAL } from '../../constants/generalTheme.js'
import {
  CircuitAmmeter,
  CircuitBattery,
  CircuitCell,
  CircuitDiode,
  CircuitFuse,
  CircuitLamp,
  CircuitLdr,
  CircuitLed,
  CircuitPath,
  CircuitResistor,
  CircuitSwitch,
  CircuitThermistor,
  CircuitVariableResistor,
  CircuitVoltmeter,
} from './circuit/CircuitPrimitives.jsx'
import { PHYSICS_CIRCUIT_VISUAL_ROLES } from './circuit/circuitVisualRoles.js'

const SYMBOLS = [
  { id: 'switch-open', label: 'Switch (open)', type: 'switchOpen' },
  { id: 'lamp', label: 'Lamp', type: 'lamp' },
  { id: 'switch-closed', label: 'Switch (closed)', type: 'switchClosed' },
  { id: 'fuse', label: 'Fuse', type: 'fuse' },
  { id: 'cell', label: 'Cell', type: 'cell' },
  { id: 'voltmeter', label: 'Voltmeter', type: 'voltmeter' },
  { id: 'battery', label: 'Battery', type: 'battery' },
  { id: 'ammeter', label: 'Ammeter', type: 'ammeter' },
  { id: 'diode', label: 'Diode', type: 'diode' },
  { id: 'thermistor', label: 'Thermistor', type: 'thermistor' },
  { id: 'resistor', label: 'Resistor', type: 'resistor' },
  { id: 'ldr', label: 'LDR', type: 'ldr' },
  { id: 'variable-resistor', label: 'Variable resistor', type: 'variableResistor' },
  { id: 'led', label: 'LED', type: 'led' },
]

function SymbolGraphic({ type }) {
  const roles = PHYSICS_CIRCUIT_VISUAL_ROLES
  const stroke = roles.textPrimary
  const fill = roles.surface
  const wireProps = { stroke, strokeWidth: 2.5 }

  const withLeads = (leftEnd, rightStart, symbol) => (
    <>
      <CircuitPath d={`M6,32 H${leftEnd}`} {...wireProps} />
      {symbol}
      <CircuitPath d={`M${rightStart},32 H106`} {...wireProps} />
    </>
  )

  let symbol = null

  if (type === 'switchOpen' || type === 'switchClosed') {
    symbol = withLeads(30, 82, (
      <CircuitSwitch
        left={30}
        right={82}
        y={32}
        closed={type === 'switchClosed'}
        disabled
        semantic={false}
        accent={stroke}
        wireStroke={stroke}
        inactiveStroke={stroke}
        terminalFill={fill}
      />
    ))
  }

  if (type === 'cell') {
    symbol = (
      <>
        <CircuitPath d="M6,32 H52" {...wireProps} />
        <CircuitCell
          x={52}
          y={32}
          orientation="horizontal"
          plateFill={stroke}
          polarityFill={stroke}
          showPolarity
        />
        <CircuitPath d="M62,32 H106" {...wireProps} />
      </>
    )
  }

  if (type === 'battery') {
    symbol = (
      <>
        <CircuitPath d="M6,32 H40" {...wireProps} />
        <CircuitBattery
          x={40}
          y={32}
          orientation="horizontal"
          cells={2}
          cellSpacing={22}
          plateFill={stroke}
          polarityFill={stroke}
        />
        <CircuitPath d="M72,32 H106" {...wireProps} />
      </>
    )
  }

  if (type === 'lamp') {
    symbol = withLeads(40, 72, (
      <CircuitLamp
        cx={56}
        cy={32}
        radius={16}
        lit={false}
        wireStroke={stroke}
        lightStroke={roles.emittedLight}
        offFill={fill}
        litFill={roles.lampFill}
        haloFill={roles.lampHalo}
      />
    ))
  }

  if (type === 'fuse') {
    symbol = withLeads(35, 77, (
      <CircuitFuse
        cx={56}
        cy={32}
        width={42}
        height={16}
        stroke={stroke}
        activeStroke={stroke}
      />
    ))
  }

  if (type === 'ammeter' || type === 'voltmeter') {
    const Meter = type === 'ammeter' ? CircuitAmmeter : CircuitVoltmeter
    symbol = withLeads(40, 72, (
      <Meter
        cx={56}
        cy={32}
        radius={16}
        stroke={stroke}
        activeStroke={stroke}
        textFill={stroke}
        fill={fill}
      />
    ))
  }

  if (type === 'resistor') {
    symbol = withLeads(35, 77, (
      <CircuitResistor
        cx={56}
        cy={32}
        width={42}
        height={16}
        stroke={stroke}
        activeStroke={stroke}
      />
    ))
  }

  if (type === 'variableResistor') {
    symbol = withLeads(35, 77, (
      <CircuitVariableResistor
        cx={56}
        cy={32}
        width={42}
        height={16}
        stroke={stroke}
        activeStroke={stroke}
      />
    ))
  }

  if (type === 'thermistor') {
    symbol = withLeads(35, 77, (
      <CircuitThermistor
        cx={56}
        cy={32}
        width={42}
        height={16}
        stroke={stroke}
        activeStroke={stroke}
      />
    ))
  }

  if (type === 'diode') {
    symbol = withLeads(40, 72, (
      <CircuitDiode
        cx={56}
        cy={32}
        radius={16}
        stroke={stroke}
        activeStroke={stroke}
        fill={fill}
      />
    ))
  }

  if (type === 'led') {
    symbol = withLeads(34, 66, (
      <CircuitLed
        cx={50}
        cy={36}
        radius={16}
        stroke={stroke}
        activeStroke={stroke}
        fill={fill}
      />
    ))
  }

  if (type === 'ldr') {
    symbol = withLeads(38, 78, (
      <CircuitLdr
        cx={58}
        cy={36}
        radius={20}
        stroke={stroke}
        activeStroke={stroke}
        fill={fill}
      />
    ))
  }

  return (
    <svg
      viewBox="0 0 112 64"
      width="100%"
      height="64"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', minWidth: 0 }}
    >
      {symbol}
    </svg>
  )
}

/**
 * Read-only GCSE circuit-symbol reference. It intentionally shares the same
 * primitives as CircuitDiagram so exam-recognition geometry cannot drift between
 * reference screens and connected circuit diagrams.
 */
export default function CircuitSymbolReference({
  title = 'GCSE circuit symbols',
  description = 'The symbol shape is the exam convention. Colour is only used to show state inside interactive diagrams.',
}) {
  return (
    <section
      aria-labelledby="circuit-symbol-reference-title"
      style={{
        width: '100%',
        maxWidth: 560,
        margin: '0 auto',
        padding: '18px 16px 16px',
        border: `1px solid ${GENERAL.line.soft}`,
        borderRadius: 16,
        background: GENERAL.backgroundSunken,
        fontFamily: 'Sora, sans-serif',
      }}
    >
      <h2
        id="circuit-symbol-reference-title"
        style={{
          margin: 0,
          color: GENERAL.softWhite,
          fontSize: 18,
          fontWeight: 700,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          margin: '6px 0 14px',
          color: GENERAL.slate,
          fontSize: 12.5,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))',
          columnGap: 16,
          borderTop: `1px solid ${GENERAL.line.soft}`,
        }}
      >
        {SYMBOLS.map(symbol => (
          <div
            key={symbol.id}
            data-circuit-reference-symbol={symbol.id}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(74px, 1fr) minmax(0, 0.9fr)',
              alignItems: 'center',
              minWidth: 0,
              minHeight: 76,
              borderBottom: `1px solid ${GENERAL.line.soft}`,
            }}
          >
            <SymbolGraphic type={symbol.type} />
            <span
              style={{
                minWidth: 0,
                color: GENERAL.softWhite,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.35,
              }}
            >
              {symbol.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
