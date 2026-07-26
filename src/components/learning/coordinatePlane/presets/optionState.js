// ─── Option state resolution ─────────────────────────────────────────────────
//
// Lives in its own module rather than in the registry so presets can import it
// without a cycle. transformations.js needs it, the registry needs it, and a
// registry ↔ preset cycle throws a temporal-dead-zone error the moment anyone
// imports a preset module directly rather than through the registry.

/**
 * The option id in force for each group.
 *
 * Reads from `values`, so option state is part of the public value model and a
 * static figure can select any option. Falls back to the first still-offered
 * choice when a capability change has removed the stored one — without this a
 * disabled capability would leave the scene pointing at an option the learner
 * can no longer see.
 *
 * Groups may resolve from the values too, so a group can disappear entirely
 * when it would do nothing — a rotation's direction at 180°, say.
 */
export function resolveOptionValues(preset, values, capabilities) {
  const groups = preset.resolveOptions?.(capabilities, values) ?? preset.options ?? []
  return Object.fromEntries(groups.map((group) => {
    const stored = values?.[group.id]
    const offered = group.choices.some(choice => choice.id === stored)
    return [group.id, offered ? stored : group.choices[0].id]
  }))
}

/**
 * The values a preset actually draws from, after capabilities have had their
 * say.
 *
 * A capability that only hides controls is not a constraint — it hides the
 * evidence while the diagram carries on using the supplied value. Pinning the
 * value here means the figure, its working, its description and the next
 * onChange payload all agree with what the learner can see and reach.
 */
export function resolvePresetValues(preset, values, capabilities) {
  return preset.resolveValues?.(values, capabilities) ?? values
}

/**
 * One effective state: capability-pinned numbers plus resolved option ids.
 *
 * Used both to derive the scene and as the base of the next update, so an
 * emitted payload can never describe a diagram other than the one on screen.
 */
export function resolveEffectiveValues(preset, values, capabilities) {
  const pinned = resolvePresetValues(preset, values, capabilities)
  return { ...pinned, ...resolveOptionValues(preset, pinned, capabilities) }
}
