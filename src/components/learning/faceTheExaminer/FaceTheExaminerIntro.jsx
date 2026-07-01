import { TYPE } from '../../../constants/typography.js'

export default function FaceTheExaminerIntro({ accent, overlayDark, titleVisible, sub1Visible, sub2Visible, videoRef, videoSrc, onTimeUpdate, onEnd }) {
  return (
    <>
      <style>{`
        @keyframes fte-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#080C10', overflow: 'hidden' }}>
        <video ref={videoRef} src={videoSrc} autoPlay muted playsInline preload="auto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onTimeUpdate={onTimeUpdate} onEnded={onEnd} onError={onEnd} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.85) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'rgba(0,0,0,0.42)', opacity: overlayDark ? 1 : 0, transition: 'opacity 1000ms ease' }} />
        <div style={{ position: 'absolute', left: 28, right: 28, bottom: 80 }}>
          {titleVisible && <div style={{ ...TYPE.displayHero, fontSize: 48, lineHeight: 0.95, color: accent, marginBottom: 20, animation: 'fte-up 700ms ease both' }}>Face the<br />examiner</div>}
          {sub1Visible && <p style={{ ...TYPE.bodyStrong, color: 'rgba(245,238,225,0.88)', margin: '0 0 4px', animation: 'fte-up 600ms ease both' }}>This answer sounds convincing.</p>}
          {sub2Visible && <p style={{ ...TYPE.bodyStrong, color: 'rgba(245,238,225,0.88)', margin: 0, animation: 'fte-up 600ms ease both' }}>But would it get top marks?</p>}
        </div>
      </div>
    </>
  )
}
