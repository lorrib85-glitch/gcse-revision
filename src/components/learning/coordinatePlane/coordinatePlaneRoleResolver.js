export function resolveCoordinatePlaneVisualRole(
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
    warn(`CoordinatePlaneExplore received an unknown visual role: ${role}`)
  }
  return undefined
}
