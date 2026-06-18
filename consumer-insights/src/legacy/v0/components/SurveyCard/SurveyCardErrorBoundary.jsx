import { Component } from 'react'
import s from './SurveyCard.module.css'

export default class SurveyCardErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(e) {
    return { error: e }
  }

  componentDidCatch(e) {
    console.error('[SurveyCard] render error:', e.message, e.stack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className={s.card} style={{ minHeight: 120, justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-on-surface-muted)', fontSize: 'var(--font-md)' }}>
            Chart unavailable — {this.state.error.message}
          </span>
        </div>
      )
    }
    return this.props.children
  }
}
