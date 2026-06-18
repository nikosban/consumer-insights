import { useState, useEffect } from 'react'

const KEY = 'ci_dashboard_v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { widgets: [] }
  } catch {
    return { widgets: [] }
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {}
}

let listeners = []
let state = load()

function getState() { return state }

function setState(next) {
  state = next
  save(state)
  listeners.forEach(fn => fn(state))
}

export function addWidget(widget) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  setState({ ...state, widgets: [...state.widgets, { ...widget, id }] })
  return id
}

export function removeWidget(id) {
  setState({ ...state, widgets: state.widgets.filter(w => w.id !== id) })
}

export function clearDashboard() {
  setState({ widgets: [] })
}

export function useDashboard() {
  const [dash, setDash] = useState(getState)

  useEffect(() => {
    const fn = (s) => setDash(s)
    listeners.push(fn)
    return () => { listeners = listeners.filter(l => l !== fn) }
  }, [])

  return dash
}
