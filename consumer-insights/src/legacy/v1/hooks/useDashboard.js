import { useState, useEffect } from 'react'

const KEY = 'ci_dashboard_v1'

const SEED_WIDGETS = [
  {
    id: 'seed-1',
    title: 'Console gaming market revenue — Worldwide',
    source: 'rai',
    chartType: 'bar',
    chartTitle: 'Console gaming market worldwide 2019–2029 (USD bn)',
    data: [
      { label: '2019', value: 40.3, valueLabel: '40.3bn' },
      { label: '2020', value: 53.2, valueLabel: '53.2bn' },
      { label: '2021', value: 58.6, valueLabel: '58.6bn' },
      { label: '2022', value: 63.1, valueLabel: '63.1bn' },
      { label: '2023', value: 70.5, valueLabel: '70.5bn' },
      { label: '2024', value: 74.8, valueLabel: '74.8bn' },
      { label: '2025', value: 79.2, valueLabel: '79.2bn' },
    ],
    meta: ['Newzoo', 'Ampere Analysis'],
  },
  {
    id: 'seed-2',
    title: 'Smartphone shipments by region — Global',
    source: 'rai',
    chartType: 'bar',
    chartTitle: 'Global smartphone shipments 2020–2026 (units, millions)',
    data: [
      { label: '2020', value: 1292, valueLabel: '1,292m' },
      { label: '2021', value: 1355, valueLabel: '1,355m' },
      { label: '2022', value: 1210, valueLabel: '1,210m' },
      { label: '2023', value: 1170, valueLabel: '1,170m' },
      { label: '2024', value: 1233, valueLabel: '1,233m' },
      { label: '2025', value: 1281, valueLabel: '1,281m' },
      { label: '2026', value: 1320, valueLabel: '1,320m' },
    ],
    meta: ['IDC', 'Statista Research'],
  },
]

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { widgets: SEED_WIDGETS }
  } catch {
    return { widgets: SEED_WIDGETS }
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
