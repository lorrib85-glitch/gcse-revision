// Chemistry topic groups — used in ModulesTab to render the Chemistry section.
// Accent palette: deep purple/violet family matching the cinematic chem images.

export const CHEMISTRY_GROUPS = [
  {
    id: 'chem_matter_atoms',
    title: 'Matter & Atoms',
    subtitle: 'Elements, Bonding & Giant Structures',
    icon: '⚛️',
    accent: '#9B59E8',
    headerImage: '/headers/chem-matteratoms.webp',
    locked: false,
    modules: [
      { id: 'chem_atoms_elements',   title: 'Atoms & Elements',             subtitle: 'Protons, neutrons & electrons', locked: false },
      { id: 'chem_periodic_table',   title: 'The Periodic Table',            subtitle: 'Groups, periods & trends',      locked: true  },
      { id: 'chem_bonding',          title: 'Bonding Basics',               subtitle: 'Ionic, covalent & metallic',    locked: true  },
      { id: 'chem_giant_structures', title: 'Giant Structures & Materials', subtitle: 'Diamond, graphite & metals',    locked: true  },
    ],
  },
  {
    id: 'chem_reactions',
    title: 'Chemical Reactions',
    subtitle: 'Equations, Acids & Electrolysis',
    icon: '🧪',
    accent: '#C459E8',
    headerImage: '/headers/chem-reactions.webp',
    locked: false,
    modules: [
      { id: 'chem_reactions_eqs', title: 'Reactions & Equations',  subtitle: 'Balancing & types of reaction',   locked: false },
      { id: 'chem_acids_salts',   title: 'Acids, Alkalis & Salts', subtitle: 'pH, neutralisation & titration',  locked: true  },
      { id: 'chem_electrolysis',  title: 'Electrolysis',           subtitle: 'Electrodes, ions & electrolytes', locked: true  },
      { id: 'chem_energy',        title: 'Energy Changes',         subtitle: 'Exothermic, endothermic & bonds', locked: true  },
    ],
  },
  {
    id: 'chem_rates_organic',
    title: 'Rates & Organic Chemistry',
    subtitle: 'Rates, Equilibria, Hydrocarbons & Fuels',
    icon: '🛢️',
    accent: '#8B59E8',
    headerImage: '/headers/chem-rates.webp',
    locked: false,
    modules: [
      { id: 'chem_rates',        title: 'Rates of Reaction',          subtitle: 'Concentration, temp & catalysts', locked: false },
      { id: 'chem_reversible',   title: 'Reversible Reactions',        subtitle: 'Equilibrium & Le Chatelier',     locked: true  },
      { id: 'chem_hydrocarbons', title: 'Hydrocarbons & Crude Oil',    subtitle: 'Alkanes, alkenes & fractions',   locked: true  },
      { id: 'chem_cracking',     title: 'Cracking & Fuels',           subtitle: 'Thermal cracking & polymers',    locked: true  },
    ],
  },
  {
    id: 'chem_earth',
    title: 'Earth Chemistry',
    subtitle: 'Atmosphere, Climate & Resources',
    icon: '🌍',
    accent: '#5980E8',
    headerImage: '/headers/chem-earth.webp',
    locked: false,
    modules: [
      { id: 'chem_atmosphere', title: "Earth's Atmosphere", subtitle: 'Evolution of the atmosphere',      locked: false },
      { id: 'chem_climate',    title: 'Climate Change',      subtitle: 'Greenhouse gases & global warming', locked: true  },
      { id: 'chem_resources',  title: 'Using Resources',     subtitle: 'Sustainable development & LCA',    locked: true  },
    ],
  },
]
