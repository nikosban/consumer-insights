import { useEffect } from 'react'
import { useLegacyStore } from '../store/legacyStore'
// @ts-ignore
import { countries } from '../data/countries'
import { adaptPayload } from './deepLinkAdapter'

/**
 * Deep-link schema sent by the Research AI prototype.
 * All fields are optional — only what is provided gets applied.
 *
 * {
 *   "country": "us",                  // country code (see countries.js)
 *   "year": "2026 - Update 1",        // exact year string used in the store
 *   "rows": ["Survey year"],          // item names to place in the row zone
 *   "cols": ["Smartphone ownership"], // item names to place in the col zone
 *   "targetGroup": {                  // target group to create and apply as filter
 *     "name": "Tech-savvy millennials",
 *     "selectionGroups": [
 *       {
 *         "catId": "consumer_electronics",
 *         "catLabel": "Consumer Electronics",
 *         "intraOp": "OR",
 *         "interOp": "AND",
 *         "items": [
 *           {
 *             "catId": "consumer_electronics",
 *             "catLabel": "Consumer Electronics",
 *             "subcatId": "devices_ownership",
 *             "subcatLabel": "Devices & Ownership",
 *             "item": "Smartphone ownership"
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * }
 */

export function useDeepLink() {
  const setSelectedCountry  = useLegacyStore(s => s.setSelectedCountry)
  const setSelectedYear     = useLegacyStore(s => s.setSelectedYear)
  const addToZone           = useLegacyStore(s => s.addToZone)
  const saveTargetGroup     = useLegacyStore(s => s.saveTargetGroup)
  const applyFilterGroup    = useLegacyStore(s => s.applyFilterGroup)
  const toggleDisplayOption = useLegacyStore(s => s.toggleDisplayOption)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('state')
    if (!raw) return

    let payload: Record<string, any>
    try {
      payload = adaptPayload(JSON.parse(atob(raw)))
    } catch {
      console.warn('[deep-link] Could not parse state param')
      return
    }

    if (payload.country) {
      const country = countries.find((c: any) => c.code === payload.country)
      if (country) setSelectedCountry(country)
    }

    if (payload.displayOptions) {
      const store = useLegacyStore.getState()
      const current = store.displayOptions
      const next = payload.displayOptions as Record<string, boolean>
      ;(Object.keys(next) as Array<keyof typeof current>).forEach(key => {
        if (current[key] !== next[key]) toggleDisplayOption(key)
      })
    }

    if (payload.year) {
      setSelectedYear(payload.year)
    }

    if (Array.isArray(payload.rows)) {
      payload.rows.forEach((name: string) => addToZone('row', name))
    }

    if (Array.isArray(payload.cols)) {
      payload.cols.forEach((name: string) => addToZone('col', name))
    }

    if (payload.targetGroup) {
      const { name, selectionGroups = [] } = payload.targetGroup
      const id = `tg-deeplink-${Date.now()}`
      const selections = selectionGroups.flatMap((g: any) => g.items ?? [])
      saveTargetGroup({ id, name, selections, selectionGroups })
      applyFilterGroup(id)
    }

    // Remove ?state= from the URL so a refresh doesn't re-apply
    params.delete('state')
    const clean = params.toString()
    window.history.replaceState(
      {},
      '',
      window.location.pathname + (clean ? `?${clean}` : '')
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
