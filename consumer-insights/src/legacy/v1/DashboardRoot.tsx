import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import 'flag-icons/css/flag-icons.min.css'
import './styles/globals.css'
// @ts-ignore
import DashboardPage from './components/Dashboard/DashboardPage.jsx'
import VersionSwitcherFab from '../../components/app/VersionSwitcherFab'

export default function DashboardRoot() {
  return (
    <>
      <DashboardPage />
      <VersionSwitcherFab />
    </>
  )
}
