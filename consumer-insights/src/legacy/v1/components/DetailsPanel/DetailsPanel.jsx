import { useLegacyStore } from '../../store/legacyStore'
import { getCardData } from '../../data/cardData'
import s from './DetailsPanel.module.css'

export default function DetailsPanel() {
  const detailsName    = useLegacyStore(s => s.detailsName)
  const setDetailsName = useLegacyStore(s => s.setDetailsName)
  const data = detailsName ? getCardData(detailsName) : null

  return (
    <div className={`${s.panel} ${detailsName ? s.open : ''}`}>
      <div className={s.header}>
        <span className={s.title}>{data?.detailsTitle ?? ''}</span>
        <button className={s.closeBtn} onClick={() => setDetailsName(null)}>×</button>
      </div>
      <div className={s.body}>
        <p className={s.desc}>{data?.detailsDesc ?? ''}</p>
        <p className={s.note}>{data?.detailsNote ?? ''}</p>
      </div>
    </div>
  )
}
