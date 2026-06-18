import { useLegacyStore } from '../../store/legacyStore'
import s from './Sidebar.module.css'

let wasDragging = false

export default function CatItem({ cat }) {
  const openCategories = useLegacyStore(s => s.openCategories)
  const openSubcats    = useLegacyStore(s => s.openSubcats)
  const addedItems     = useLegacyStore(s => s.addedItems)
  const toggleCategory = useLegacyStore(s => s.toggleCategory)
  const toggleSubcat   = useLegacyStore(s => s.toggleSubcat)
  const toggleItem     = useLegacyStore(s => s.toggleItem)
  const setIsDragging  = useLegacyStore(s => s.setIsDragging)

  const catOpen = openCategories.includes(cat.id)

  return (
    <div className={`${s.catItem} ${catOpen ? s.catOpen : ''}`}>
      <div className={s.catTrigger} onClick={() => toggleCategory(cat.id)}>
        <i className={`ti ti-chevron-right ${s.catChevron}`} />
        <span className={s.catLabel}>{cat.label}</span>
      </div>
      {catOpen && (
        <div className={s.catBody}>
          {cat.subcats.map(sub => {
            const subOpen = openSubcats.includes(sub.id)
            return (
              <div key={sub.id} className={`${s.subcatItem} ${subOpen ? s.subcatOpen : ''}`}>
                <div className={s.subcatTrigger} onClick={() => toggleSubcat(sub.id)}>
                  <i className={`ti ti-chevron-right ${s.subcatChevron}`} />
                  <span className={s.subcatLabel}>{sub.label}</span>
                </div>
                {subOpen && (
                  <div className={s.subcatBody}>
                    {sub.items.map(item => {
                      const added = addedItems.includes(item)
                      return (
                        <div
                          key={item}
                          className={`${s.surveyItem} ${added ? s.surveyItemAdded : ''}`}
                          draggable
                          onDragStart={e => {
                            wasDragging = true
                            e.dataTransfer.setData('text/plain', JSON.stringify({ name: item, source: 'sidebar' }))
                            e.dataTransfer.effectAllowed = 'move'
                            setIsDragging(true)
                          }}
                          onDragEnd={() => { setIsDragging(false); setTimeout(() => { wasDragging = false }, 0) }}
                          onClick={() => { if (wasDragging) return; toggleItem(item) }}
                        >
                          <span className={s.itemLabel}>{item}</span>
                          <i className={`ti ${added ? 'ti-minus' : 'ti-plus'} ${s.itemAction}`} />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
