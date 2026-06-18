import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import 'flag-icons/css/flag-icons.min.css'
import './styles/globals.css'
// @ts-ignore
import ResearchAIPage from './components/ResearchAI/ResearchAIPage.jsx'
import VersionSwitcherFab from '../../components/app/VersionSwitcherFab'

export default function ResearchAIRoot() {
  return (
    <>
      <ResearchAIPage />
      <VersionSwitcherFab />
    </>
  )
}
