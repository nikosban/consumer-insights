import { useRef } from 'react'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import 'flag-icons/css/flag-icons.min.css'
import './styles/globals.css'
// @ts-ignore — JSX file without types
import LegacyAppInner from './LegacyApp.jsx'
import VersionSwitcherFab from '../../components/app/VersionSwitcherFab'

export default function LegacyAppRoot() {
  const rootRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={rootRef} className="legacy-root" style={{ height: '100vh', overflow: 'hidden' }}>
      <LegacyAppInner rootRef={rootRef} />
      <VersionSwitcherFab />
    </div>
  )
}
