// Using this shell requires a comment in the component explaining why ContentShell or InteractionShell cannot be used.
export default function CinematicShell({ children, style }) {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', ...style }}>
      {children}
    </div>
  )
}
