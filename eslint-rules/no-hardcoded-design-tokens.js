// ─── ESLint Rule: No Hardcoded Design Tokens ───────────────────────────────
//
// Catches hardcoded font sizes, button heights, spacing values that should
// use design token helpers instead (componentStyles.js, SPACING, BUTTONS, etc).
//
// Errors like:
//   ❌ fontSize: '24px' → should use sectionHeading()
//   ❌ height: '56px' → should use BUTTONS.primary.height
//   ❌ padding: '16px' → should use SPACING.md
//
// Run: npm run lint

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded design tokens (font sizes, spacing, button heights)',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    // Common hardcoded values to detect
    const HARDCODED_FONT_SIZES = {
      '34': 'screenHeading() — TYPE.hero',
      '28': 'sectionHeading() — TYPE.sectionTitle',
      '22': 'cardHeading() — TYPE.cardTitle',
      '20': 'bodyText() or buttonPrimary() — TYPE.body or BUTTONS.primary.fontSize',
      '18': 'bodyText() — TYPE.body',
      '16': 'smallText() or metadataText() — TYPE.bodySmall or TYPE.metadata',
      '15': 'bodyText() variant',
      '14': 'metadataText() — TYPE.metadata',
      '12': 'caption text',
    }

    const HARDCODED_HEIGHTS = {
      '74': 'BUTTONS.primary.height',
      '56': 'BUTTONS.secondary.height or BUTTONS.continue.height',
      '44': 'BUTTONS.compact.height',
    }

    const HARDCODED_SPACING = {
      '4': 'SPACING.xs',
      '8': 'SPACING.sm',
      '12': 'SPACING.sm or cardGap',
      '16': 'SPACING.md or screenPadding',
      '20': 'SPACING.md or screenPadding',
      '24': 'SPACING.lg or sectionGap',
      '32': 'SPACING.xl',
    }

    return {
      JSXAttribute(node) {
        // Check for style prop with inline objects
        if (node.name.name === 'style' && node.value?.expression?.properties) {
          const properties = node.value.expression.properties

          properties.forEach((prop) => {
            if (!prop.value) return

            const propName = prop.key?.name
            const value = prop.value?.value

            // Check fontSize
            if (propName === 'fontSize' && typeof value === 'string') {
              const numVal = value.replace('px', '')
              if (HARDCODED_FONT_SIZES[numVal]) {
                context.report({
                  node: prop,
                  message: `Hardcoded fontSize '${value}' detected. Use ${HARDCODED_FONT_SIZES[numVal]} instead.`,
                })
              }
            }

            // Check height
            if (propName === 'height' && typeof value === 'string') {
              const numVal = value.replace('px', '')
              if (HARDCODED_HEIGHTS[numVal]) {
                context.report({
                  node: prop,
                  message: `Hardcoded height '${value}' detected. Use ${HARDCODED_HEIGHTS[numVal]} instead.`,
                })
              }
            }

            // Check padding/margin/gap
            if (
              ['padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
               'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
               'gap'].includes(propName) &&
              typeof value === 'string'
            ) {
              const numVal = value.replace('px', '')
              if (HARDCODED_SPACING[numVal]) {
                context.report({
                  node: prop,
                  message: `Hardcoded ${propName} '${value}' detected. Use ${HARDCODED_SPACING[numVal]} instead. Import SPACING from '@/constants/spacing.js'.`,
                })
              }
            }
          })
        }
      },

      // Also check CSS-in-JS object literals
      ObjectExpression(node) {
        node.properties?.forEach((prop) => {
          if (!prop.value) return

          const propName = prop.key?.name
          const value = prop.value?.value

          if (propName === 'fontSize' && typeof value === 'string') {
            const numVal = value.replace('px', '')
            if (HARDCODED_FONT_SIZES[numVal]) {
              context.report({
                node: prop,
                message: `Hardcoded fontSize '${value}'. Use ${HARDCODED_FONT_SIZES[numVal]} from componentStyles.js instead.`,
              })
            }
          }

          if (propName === 'height' && typeof value === 'string') {
            const numVal = value.replace('px', '')
            if (HARDCODED_HEIGHTS[numVal]) {
              context.report({
                node: prop,
                message: `Hardcoded height '${value}'. Use ${HARDCODED_HEIGHTS[numVal]} from constants/buttons.js instead.`,
              })
            }
          }

          if (
            ['padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
             'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
             'gap'].includes(propName) &&
            typeof value === 'string'
          ) {
            const numVal = value.replace('px', '')
            if (HARDCODED_SPACING[numVal]) {
              context.report({
                node: prop,
                message: `Hardcoded ${propName} '${value}'. Use ${HARDCODED_SPACING[numVal]} from SPACING constant instead.`,
              })
            }
          }
        })
      },
    }
  },
}
