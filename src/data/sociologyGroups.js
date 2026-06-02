// Sociology topic groups — used in ModulesTab to render the Sociology section.
// Accent palette: pink-purple family.

export const SOCIOLOGY_GROUPS = [
  {
    id: 'soc_group_families',
    title: 'Sociology of the Family',
    subtitle: 'Roles, diversity, conjugal change & feminist perspectives',
    icon: '👨‍👩‍👧',
    accent: '#FF5C7A',
    headerImage: '/headers/sociology-family.webp',
    locked: false,
    filterPrefix: 'soc_families',
    paper: 'Paper 1',
    modules: [
      { id: 'soc_families_key_terms', title: 'Key Terms',             subtitle: '1-mark multiple choice',        locked: false },
      { id: 'soc_families_describe',  title: 'Describe Questions',    subtitle: '3-mark extended answers',       locked: false },
      { id: 'soc_families_item',      title: 'Item/Source Questions', subtitle: '2–4 mark source analysis',      locked: false },
      { id: 'soc_families_methods',   title: 'Research Methods',      subtitle: '4-mark methodology questions',  locked: false },
      { id: 'soc_families_12mark',    title: '12-Mark Essays',        subtitle: 'Discuss & evaluate questions',  locked: false },
    ],
  },
  {
    id: 'soc_group_education',
    title: 'Sociology of Education',
    subtitle: 'Achievement gaps, socialisation & education policy',
    icon: '🎓',
    accent: '#FF8C42',
    headerImage: '/headers/sociology-education.webp',
    locked: false,
    filterPrefix: 'soc_education',
    paper: 'Paper 1',
    modules: [
      { id: 'soc_education_key_terms', title: 'Key Terms',          subtitle: '1-mark multiple choice',    locked: false },
      { id: 'soc_education_describe',  title: 'Describe Questions', subtitle: '3-mark extended answers',   locked: false },
    ],
  },
  {
    id: 'soc_group_crime',
    title: 'Crime & Deviance',
    subtitle: 'Theories of crime, social control & statistics',
    icon: '⚖️',
    accent: '#A78BFA',
    headerImage: '/headers/sociology-crime.webp',
    locked: false,
    filterPrefix: 'soc_crime',
    paper: 'Paper 2',
    modules: [
      { id: 'soc_crime_key_terms', title: 'Key Terms',             subtitle: '1-mark multiple choice',       locked: false },
      { id: 'soc_crime_describe',  title: 'Describe Questions',    subtitle: '3-mark extended answers',      locked: false },
      { id: 'soc_crime_item',      title: 'Item/Source Questions', subtitle: '2–4 mark source analysis',     locked: false },
      { id: 'soc_crime_12mark',    title: '12-Mark Essays',        subtitle: 'Discuss & evaluate questions', locked: false },
    ],
  },
  {
    id: 'soc_group_stratification',
    title: 'Social Stratification',
    subtitle: 'Class, inequality, social mobility & life chances',
    icon: '📊',
    accent: '#38BDF8',
    headerImage: '/headers/sociology-stratification.webp',
    locked: false,
    filterPrefix: 'soc_stratification',
    paper: 'Paper 2',
    modules: [
      { id: 'soc_stratification', title: 'Key Terms & Questions', subtitle: 'All stratification content', locked: false },
    ],
  },
]
