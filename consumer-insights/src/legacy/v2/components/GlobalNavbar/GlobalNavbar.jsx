import logo from '../../assets/statista-logo.svg'
import s from './GlobalNavbar.module.css'

const NAV_ITEMS = [
  { label: 'Statistics',   hasChevron: true  },
  { label: 'Insights',     hasChevron: true,  href: '/consumer_insights_v2' },
  { label: 'Research AI',  hasChevron: false, href: '/consumer_insights_v2/research-ai' },
  { label: 'Dashboard',    hasChevron: false, href: '/consumer_insights_v2/dashboard' },
  { label: 'Connect',      hasChevron: true, badge: 'New' },
  { label: 'Daily Data',   hasChevron: true  },
  { label: 'Services',     hasChevron: true  },
]

export default function GlobalNavbar({ userName = 'Nikolaos Banis' }) {
  return (
    <header className={s.navbar}>
      <div className={s.inner}>

        <div className={s.top}>
          <div className={s.topLeft}>
            <a href="#" className={s.logoLink}>
              <img src={logo} alt="Statista" height="24" />
            </a>
            <span className={s.accountText}>
              You are using the account<br />of {userName}
            </span>
          </div>
          <div className={s.searchField}>
            <div className={s.searchInputRow}>
              <input
                className={s.searchInput}
                type="text"
                placeholder="Search Statistics, Reports, ..."
              />
              <button className={s.searchBtn}>
                <i className="ti ti-search" />
              </button>
            </div>
          </div>
        </div>

        <div className={s.bottom}>
          <nav className={s.navLeft}>
            {NAV_ITEMS.map(item => item.href ? (
              <a key={item.label} href={item.href} className={s.navBtn}>
                <span className={s.navLabel}>{item.label}</span>
                {item.badge && <span className={s.badge}>{item.badge}</span>}
                {item.hasChevron && <i className="ti ti-chevron-down" />}
              </a>
            ) : (
              <button key={item.label} className={s.navBtn}>
                <span className={s.navLabel}>{item.label}</span>
                {item.badge && <span className={s.badge}>{item.badge}</span>}
                {item.hasChevron && <i className="ti ti-chevron-down" />}
              </button>
            ))}
          </nav>
          <div className={s.navRight}>
            <button className={s.iconBtn}><i className="ti ti-world" /></button>
            <button className={s.iconBtn}><i className="ti ti-star" /></button>
            <button className={s.iconBtn}><i className="ti ti-bell" /></button>
            <button className={s.navBtn}>
              <span className={s.navLabel}>My Account</span>
              <i className="ti ti-chevron-down" />
            </button>
          </div>
        </div>

      </div>
    </header>
  )
}
