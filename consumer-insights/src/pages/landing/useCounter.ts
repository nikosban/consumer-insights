import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export function useCounter(end: number, duration = 700, startFrom = 0) {
  const [count, setCount] = useState(startFrom)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (!inView) return
    let startTime: number | undefined
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(startFrom + (end - startFrom) * eased))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, end, duration, startFrom])

  return { count, ref }
}
