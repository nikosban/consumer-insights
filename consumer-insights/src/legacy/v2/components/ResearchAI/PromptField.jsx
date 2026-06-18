import { useState, useRef } from 'react'

const FF = "'Open Sans', system-ui, sans-serif"

export default function PromptField({ placeholder = 'Ask anything to start', minHeight = 104, onSubmit }) {
  const [value, setValue] = useState('')
  const taRef = useRef(null)

  const submit = () => {
    const v = value.trim()
    if (v) { onSubmit?.(v); setValue('') }
  }

  const autoResize = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(Math.max(e.target.scrollHeight, minHeight), 200) + 'px'
  }

  return (
    <div style={{
      position: 'relative',
      border: '1px solid #c4c4c4',
      borderRadius: 8,
      minHeight,
      background: 'white',
      display: 'flex',
      alignItems: 'flex-end',
    }}>
      <textarea
        ref={taRef}
        value={value}
        placeholder={placeholder}
        rows={1}
        onChange={e => setValue(e.target.value)}
        onInput={autoResize}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: FF,
          fontSize: 14,
          color: '#0f2741',
          background: 'transparent',
          lineHeight: '22px',
          padding: `16px 56px 16px 16px`,
          minHeight,
          alignSelf: 'stretch',
        }}
      />
      <button
        onClick={submit}
        style={{
          position: 'absolute',
          right: 7,
          bottom: 7,
          width: 40,
          height: 40,
          background: '#0666E5',
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12.854 3.146a.5.5 0 0 1 .125.517L9.979 13.644a.5.5 0 0 1-.968-.028L7.317 9.39 9.854 6.854a.5.5 0 0 0-.708-.708L6.61 8.683 2.314 6.964a.5.5 0 0 1 .022-.969L12.336 3.02a.5.5 0 0 1 .518.126Z" fill="white"/>
        </svg>
      </button>
    </div>
  )
}
