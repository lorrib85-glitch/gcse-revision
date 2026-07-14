const LEGACY_ICON_ALIASES = {
  '🔬': 'microscope',
  '🧴': 'antiseptic',
  '🩹': 'shield',
  '🧼': 'sterile',
  '🦟': 'flea',
  '🔴': 'nodes',
  '🤒': 'fever',
  '🩸': 'blood',
  '🫁': 'lungs',
}

function IconShell({ children, size }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <g
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  )
}

function MicroscopeIcon({ size }) {
  return (
    <IconShell size={size}>
      <path d="M9 4h5" />
      <path d="M10 4v4.2a4.8 4.8 0 0 0 4.8 4.8H17" />
      <path d="M13 8h3.5l1.5 3" />
      <path d="M8 16.5h9" />
      <path d="M6.5 20h12" />
      <path d="M8 16.5a5.5 5.5 0 0 0 5.5 3.5" />
      <circle cx="17.5" cy="13.5" r="1.5" />
    </IconShell>
  )
}

function AntisepticIcon({ size }) {
  return (
    <IconShell size={size}>
      <path d="M9 3h6" />
      <path d="M10 3v3h4V3" />
      <rect x="7" y="6" width="10" height="15" rx="2.5" />
      <path d="M10 10h4" />
      <path d="M12 13.2c-1.3 1.6-2 2.7-2 3.5a2 2 0 0 0 4 0c0-.8-.7-1.9-2-3.5Z" />
    </IconShell>
  )
}

function ShieldIcon({ size }) {
  return (
    <IconShell size={size}>
      <path d="M12 3 19 6v5.2c0 4.5-2.8 7.7-7 9.8-4.2-2.1-7-5.3-7-9.8V6l7-3Z" />
      <path d="M12 8v7" />
      <path d="M8.5 11.5h7" />
    </IconShell>
  )
}

function SterileIcon({ size }) {
  return (
    <IconShell size={size}>
      <circle cx="12" cy="12" r="6" />
      <path d="m9.5 12 1.7 1.7 3.5-4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="m19.1 4.9-1.4 1.4" />
      <path d="m6.3 17.7-1.4 1.4" />
    </IconShell>
  )
}

function FleaIcon({ size }) {
  return (
    <IconShell size={size}>
      <ellipse cx="12" cy="12" rx="3.5" ry="5" />
      <path d="M10 7.5 8 5" />
      <path d="m14 7.5 2-2.5" />
      <path d="M8.8 9.5 5 8" />
      <path d="M8.5 12 4 12" />
      <path d="m8.8 14.5-3.8 2" />
      <path d="m15.2 9.5 3.8-1.5" />
      <path d="M15.5 12H20" />
      <path d="m15.2 14.5 3.8 2" />
      <path d="M12 7v10" />
    </IconShell>
  )
}

function NodesIcon({ size }) {
  return (
    <IconShell size={size}>
      <circle cx="7" cy="8" r="2.5" />
      <circle cx="17" cy="8" r="2.5" />
      <circle cx="12" cy="17" r="3" />
      <path d="m9 9.5 1.8 4.6" />
      <path d="m15 9.5-1.8 4.6" />
      <path d="M9.5 8h5" />
    </IconShell>
  )
}

function FeverIcon({ size }) {
  return (
    <IconShell size={size}>
      <path d="M10 5a2 2 0 0 1 4 0v8.2a4 4 0 1 1-4 0V5Z" />
      <path d="M12 8v7" />
      <circle cx="12" cy="17" r="1.5" />
      <path d="M17.5 7.5h2" />
      <path d="M17.5 11h2" />
    </IconShell>
  )
}

function BloodIcon({ size }) {
  return (
    <IconShell size={size}>
      <path d="M12 3c3.4 4.2 5.5 7.2 5.5 10.2a5.5 5.5 0 1 1-11 0C6.5 10.2 8.6 7.2 12 3Z" />
      <path d="M9.2 14.2a3 3 0 0 0 2.2 2.5" />
    </IconShell>
  )
}

function LungsIcon({ size }) {
  return (
    <IconShell size={size}>
      <path d="M12 4v8" />
      <path d="M12 8 9.5 10" />
      <path d="M12 8 14.5 10" />
      <path d="M9.5 7.5C7.3 8 5.5 10.5 5 14.8 4.6 18 6.4 20 9 20c1.7 0 2.7-1 2.7-2.7V10" />
      <path d="M14.5 7.5c2.2.5 4 3 4.5 7.3.4 3.2-1.4 5.2-4 5.2-1.7 0-2.7-1-2.7-2.7V10" />
    </IconShell>
  )
}

function LinkIcon({ size }) {
  return (
    <IconShell size={size}>
      <path d="m9.5 14.5 5-5" />
      <path d="M7.2 16.8 5.8 18.2a3 3 0 0 1-4.2-4.2L5 10.6a3 3 0 0 1 4.2 0" />
      <path d="m16.8 7.2 1.4-1.4a3 3 0 1 1 4.2 4.2L19 13.4a3 3 0 0 1-4.2 0" />
    </IconShell>
  )
}

const ICONS = {
  microscope: MicroscopeIcon,
  antiseptic: AntisepticIcon,
  shield: ShieldIcon,
  sterile: SterileIcon,
  flea: FleaIcon,
  nodes: NodesIcon,
  fever: FeverIcon,
  blood: BloodIcon,
  lungs: LungsIcon,
  link: LinkIcon,
}

export function normaliseTimelineIconName(icon) {
  return LEGACY_ICON_ALIASES[icon] || icon || 'link'
}

export default function TimelineChainIcon({ icon, size = 28 }) {
  const iconName = normaliseTimelineIconName(icon)
  const Icon = ICONS[iconName] || LinkIcon
  return <Icon size={size} />
}
