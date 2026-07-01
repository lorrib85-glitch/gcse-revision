import { useState } from 'react'
import { MathsQuestion } from './MathsQuestion.jsx'

export function MathsTopicView({ group, onBack }) {
  const [qIdx, setQIdx] = useState(0)
  const qs = group.questions
  return (
    <MathsQuestion
      key={qIdx}
      q={qs[qIdx]} qIdx={qIdx} total={qs.length}
      topicLabel={group.label} topicColor={group.color} isCalc={group.calculator}
      onBack={onBack}
      onNext={() => { const n=qIdx+1; if(n<qs.length){setQIdx(n);window.scrollTo({top:0,behavior:'smooth'})}else onBack() }}
    />
  )
}
