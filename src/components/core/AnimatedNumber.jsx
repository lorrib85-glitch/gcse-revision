import { useEffect, useRef, useState } from 'react'

// Counts from 0 to `value` using requestAnimationFrame.
// Triggers on IntersectionObserver entry; respects prefers-reduced-motion.
export default function AnimatedNumber({ value, duration = 1400 }) {
  const [display, setDisplay] = useState(0)
  const elRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(value)
      return
    }

    let frameId = null

    function run() {
      const start = performance.now()
      function step(now) {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
        setDisplay(Math.round(eased * value))
        if (t < 1) frameId = requestAnimationFrame(step)
      }
      frameId = requestAnimationFrame(step)
    }

    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { run(); io.disconnect() } },
      { threshold: 0.2 }
    )
    const el = elRef.current
    if (el) io.observe(el)

    return () => { io.disconnect(); if (frameId) cancelAnimationFrame(frameId) }
  }, [value, duration])

  return <span ref={elRef}>{display}</span>
}
