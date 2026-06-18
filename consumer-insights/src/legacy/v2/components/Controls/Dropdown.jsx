import { useEffect, useRef } from 'react'
import s from './Dropdown.module.css'

export default function Dropdown({ id, label, value, open, onToggle, children, alignRight = false, primary = false }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onToggle(null)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onToggle])

  return (
    <div className={`${s.dropdown} ${open ? s.open : ''} ${primary ? s.primary : ''}`} ref={ref}>
      <div className={s.trigger} onClick={() => onToggle(open ? null : id)}>
        {label ? (
          <div className={s.inner}>
            <span className={s.label}>{label}</span>
            <span className={s.value}>{value}</span>
          </div>
        ) : (
          <span className={s.value}>{value}</span>
        )}
        <i className="ti ti-chevron-down" />
      </div>
      <div className={`${s.panel} ${alignRight ? s.alignRight : ''}`}>
        {children}
      </div>
    </div>
  )
}

export function DropdownItem({ selected, onClick, children }) {
  return (
    <div className={`${s.item} ${selected ? s.itemSelected : ''}`} onClick={onClick}>
      {children}
      {selected && <i className={`ti ti-check ${s.itemCheck}`} />}
    </div>
  )
}
