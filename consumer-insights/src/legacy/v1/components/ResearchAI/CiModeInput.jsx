import { useRef, useEffect } from 'react'
import s from './CiModeInput.module.css'

export default function CiModeInput({ onSend }) {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const val = inputRef.current?.value.trim()
      if (val) { onSend?.(val); inputRef.current.value = '' }
    }
  }

  return (
    <div className={s.bar}>
      <div className={s.inner}>
        <div className={s.beamWrap}>
          <input
            ref={inputRef}
            type="text"
            className={s.input}
            placeholder="Ask anything about consumer insights…"
            onKeyDown={handleKey}
          />
        </div>
        <span className={s.hint}>Press Enter to send</span>
      </div>
    </div>
  )
}
