// Subject-browser runtime adapter.
//
// Stage 5C keeps the generated navigation projection authoritative for
// destination order, browser copy, sections and cards. This module keeps
// the UI isolated from the raw generated shape and joins openable cards to
// runtime Chapter records so existing progress and opening behaviour stay
// unchanged.

import { CHAPTERS } from '../../chapters.js'
import {
  NAVIGATION_ENTRIES,
  getNavigationEntryForDisplayName,
} from '../../data/generated/curriculum/navigation.js'

const chapterById = new Map(CHAPTERS.map(chapter => [chapter.id, chapter]))

function adaptCard(card, series = null) {
  const runtimeChapter = card.kind === 'chapter'
    ? chapterById.get(card.chapterId)
    : null

  return {
    ...(runtimeChapter ?? {}),
    id: card.id,
    chapterId: card.chapterId ?? null,
    navigationKind: card.kind,
    title: card.title,
    subtitle: card.subtitle,
    number: card.number,
    series,
    headerImage: card.headerImage ?? card.heroImage ?? runtimeChapter?.headerImage ?? null,
    comingSoon: !card.openable,
    openable: card.openable,
    canonical: card.canonical,
  }
}

function adaptSubjectState(entry) {
  return {
    id: `${entry.id}:coming-soon`,
    chapterId: null,
    navigationKind: 'state',
    title: entry.comingSoon.title,
    subtitle: entry.comingSoon.subtitle,
    number: 1,
    series: null,
    headerImage: entry.heroImage,
    comingSoon: true,
    openable: false,
    canonical: null,
  }
}

export const SUBJECT_NAVIGATION_NAMES = NAVIGATION_ENTRIES.map(entry => entry.label)

export function getSubjectNavigationEntry(subjectName) {
  const entry = getNavigationEntryForDisplayName(subjectName)
  if (!entry) return null

  const series = entry.sections?.map(section => ({
    id: section.id,
    title: section.title,
    short: section.shortLabel,
    headerImage: section.heroImage,
    comingSoon: section.comingSoon,
  })) ?? []

  const items = entry.sections
    ? entry.sections.flatMap(section => section.cards.map(card => adaptCard(card, section.id)))
    : entry.comingSoon
      ? [adaptSubjectState(entry)]
      : entry.cards.map(card => adaptCard(card))

  return { ...entry, series, items }
}

export function getSubjectChapterList(subjectName) {
  return getSubjectNavigationEntry(subjectName)?.items ?? []
}
