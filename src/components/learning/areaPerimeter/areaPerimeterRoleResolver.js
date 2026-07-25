export function resolveAreaPerimeterVisualRole(
  roles,
  role,
  {
    isDevelopment = false,
    warn = console.warn,
  } = {},
) {
  if (!role) return undefined
  if (Object.prototype.hasOwnProperty.call(roles, role)) return roles[role]

  if (isDevelopment) {
    warn(`AreaPerimeterExplore received an unknown visual role: ${role}`)
  }
  return undefined
}
