import { useEffect, useRef, useState } from 'react'
import { GENERAL } from '../../../constants/generalTheme.js'
import { SUBJECTS } from '../../../constants/subjects.js'
import FaceTheExaminerIntro from './FaceTheExaminerIntro.jsx'
import FaceTheExaminerDone from './FaceTheExaminerDone.jsx'
import FaceTheExaminerMain from './FaceTheExaminerMain.jsx'
import { buildAnnotatedSegments, replaceAnnotatedTargets } from './utils.js'

export default function FaceTheExaminerContainer({ module, examiner, onExit, onContinue }) {
  const theme = SUBJECTS[module.subject] || {
    accent: GENERAL.teal,
    background: GENERAL.backgroundApp,
  }
  const accent = theme.accent
  const bg = theme.background
  const screenTitle = examiner.screenTitle || module.faceTheExaminerTitle || 'Mark the answer'

  const [phase, setPhase] = useState('intro')
  const [overlayDark, setOverlayDark] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)
  const [sub1Visible, setSub1Visible] = useState(false)
  const [sub2Visible, setSub2Visible] = useState(false)
  const textStarted = useRef(false)
  const videoRef = useRef(null)
  const timers = useRef([])

  const [activeTab, setActiveTab] = useState('answer')
  const [guessedMark, setGuessedMark] = useState(null)
  const [selectedCriteria, setSelectedCriteria] = useState([])
  const [revealPanelVisible, setRevealPanelVisible] = useState(false)
  const [studentEdits, setStudentEdits] = useState({})
  const [expandedEdit, setExpandedEdit] = useState(null)
  const expandedTextareaRef = useRef(null)
  const [remarkResult, setRemarkResult] = useState(null)
  const [remarkLoading, setRemarkLoading] = useState(false)
  const [remarkError, setRemarkError] = useState(null)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    if (phase === 'reveal') {
      const id = setTimeout(() => setRevealPanelVisible(true), 320)
      return () => clearTimeout(id)
    }
    setRevealPanelVisible(false)
    return undefined
  }, [phase])

  useEffect(() => {
    if (phase !== 'intro') return undefined
    const id = setTimeout(() => startTitleFade(), 3500)
    return () => clearTimeout(id)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  function advance() {
    onContinue?.({
      originalMark: examiner.mark,
      finalMark: remarkResult?.marksAwarded ?? examiner.mark,
      guessedMark,
      selectedCriteria,
    })
  }

  function schedule(fn, delay) {
    const id = setTimeout(fn, delay)
    timers.current.push(id)
  }

  function startTitleFade() {
    if (textStarted.current) return
    textStarted.current = true
    setOverlayDark(true)
    schedule(() => setTitleVisible(true), 200)
    schedule(() => setSub1Visible(true), 600)
    schedule(() => setSub2Visible(true), 950)
    schedule(() => setPhase('reading'), 2300)
  }

  function handleTimeUpdate() {
    const vid = videoRef.current
    if (!vid || textStarted.current) return
    if (vid.duration && vid.currentTime >= vid.duration - 1.0) startTitleFade()
  }

  function composeEditedAnswer() {
    return replaceAnnotatedTargets(examiner.sampleAnswer, examiner.annotations, studentEdits)
  }

  async function handleRemark() {
    setRemarkLoading(true)
    setRemarkError(null)
    setPhase('remarking')

    try {
      const editedAnswer = composeEditedAnswer()
      const res = await fetch('/api/examiner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'remark',
          question: examiner.question,
          originalAnswer: examiner.sampleAnswer,
          editedAnswer,
          marks: examiner.marks,
          markScheme: examiner.markScheme,
          subject: examiner.subject || module.subject,
          board: examiner.board || module.board || module.examBoard || undefined,
          type: examiner.type,
          originalMark: examiner.mark,
          studentEdits,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Unable to re-mark this answer.')
      setRemarkResult(data)
      setPhase('done')
    } catch (err) {
      setRemarkError(err.message || 'Failed to re-mark. Try again.')
      setPhase('improving')
    } finally {
      setRemarkLoading(false)
    }
  }

  const isReveal = phase === 'reveal'
  const isImproving = phase === 'improving'
  const isRemarking = phase === 'remarking'
  const canImprove = examiner.mark < examiner.marks && examiner.annotations?.some(annotation => annotation.type === 'weak')
  const hasAnyEdit = Object.values(studentEdits).some(value => value?.trim())
  const segments = ['reveal', 'improving', 'remarking'].includes(phase)
    ? buildAnnotatedSegments(examiner.sampleAnswer, examiner.annotations)
    : []

  if (phase === 'intro') {
    return <FaceTheExaminerIntro accent={accent} overlayDark={overlayDark} titleVisible={titleVisible} sub1Visible={sub1Visible} sub2Visible={sub2Visible} videoRef={videoRef} videoSrc={examiner.videoSrc || '/videos/face-the-examiner-intro.mp4'} onTimeUpdate={handleTimeUpdate} onEnd={startTitleFade} />
  }

  if (phase === 'done') {
    return <FaceTheExaminerDone bg={bg} accent={accent} examiner={examiner} remarkResult={remarkResult} onAdvance={advance} />
  }

  return <FaceTheExaminerMain module={module} examiner={examiner} screenTitle={screenTitle} bg={bg} accent={accent} activeTab={activeTab} setActiveTab={setActiveTab} phase={phase} setPhase={setPhase} guessedMark={guessedMark} setGuessedMark={setGuessedMark} selectedCriteria={selectedCriteria} setSelectedCriteria={setSelectedCriteria} revealPanelVisible={revealPanelVisible} setRevealPanelVisible={setRevealPanelVisible} isReveal={isReveal} isImproving={isImproving} isRemarking={isRemarking} segments={segments} expandedEdit={expandedEdit} setExpandedEdit={setExpandedEdit} studentEdits={studentEdits} setStudentEdits={setStudentEdits} expandedTextareaRef={expandedTextareaRef} hasAnyEdit={hasAnyEdit} remarkLoading={remarkLoading} remarkError={remarkError} handleRemark={handleRemark} onExit={onExit} canImprove={canImprove} />
}
