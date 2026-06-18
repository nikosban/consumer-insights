// @ts-ignore
import { countries } from '../data/countries'

/**
 * External schema sent by Research AI prototype.
 * We adapt TO this format — they don't change their schema for us.
 */
interface ExternalPayload {
  Country?: string
  Time?: string
  Columns?: string[]
  Rows?: string[]
  'Target group'?: {
    age?: string
    gender?: string
  }
}

/**
 * Internal schema consumed by useDeepLink.
 */
interface InternalPayload {
  country?: string
  year?: string
  rows?: string[]
  cols?: string[]
  displayOptions?: { absolute?: boolean; population?: boolean; percent?: boolean }
  targetGroup?: {
    name: string
    selections: any[]
    selectionGroups: any[]
  }
}

const FULL_AGE_RANGE = '18–64'

function isExternalFormat(payload: any): payload is ExternalPayload {
  return typeof payload.Country !== 'undefined' || typeof payload.Time !== 'undefined'
}

export function adaptPayload(raw: any): InternalPayload {
  if (!isExternalFormat(raw)) return raw as InternalPayload

  const out: InternalPayload = {}

  // Country: full name → ISO code
  if (raw.Country) {
    const match = countries.find((c: any) =>
      c.name.toLowerCase() === (raw.Country as string).toLowerCase()
    )
    if (match) out.country = match.code
  }

  // Time → year (pass through, formats already match)
  if (raw.Time) out.year = raw.Time

  // Rows: pass through as-is
  if (Array.isArray(raw.Rows)) out.rows = raw.Rows

  // Columns: map display-option names → displayOptions patch
  // "Answers" is always visible; the rest map to toggles
  if (Array.isArray(raw.Columns)) {
    out.displayOptions = {
      absolute:   raw.Columns.includes('Absolute'),
      population: raw.Columns.includes('Population'),
      percent:    raw.Columns.includes('Percent'),
    }
  }

  // Target group: flat {age, gender} → skip filter when it's the full base (All / 18–64)
  const tg = raw['Target group']
  if (tg) {
    const genderAll = !tg.gender || tg.gender === 'All' || tg.gender === 'All genders'
    const ageAll    = !tg.age   || tg.age === FULL_AGE_RANGE

    if (!genderAll || !ageAll) {
      const selectionGroups: any[] = []

      if (!genderAll) {
        selectionGroups.push({
          catId: 'characteristics',
          catLabel: 'Characteristics & demographics',
          intraOp: 'OR',
          interOp: 'AND',
          items: [{
            catId: 'characteristics',
            catLabel: 'Characteristics & demographics',
            subcatId: 'demographics',
            subcatLabel: 'Demographics',
            item: tg.gender,
          }],
        })
      }

      if (!ageAll) {
        selectionGroups.push({
          catId: 'characteristics',
          catLabel: 'Characteristics & demographics',
          intraOp: 'OR',
          interOp: 'AND',
          items: [{
            catId: 'characteristics',
            catLabel: 'Characteristics & demographics',
            subcatId: 'demographics',
            subcatLabel: 'Demographics',
            item: `Age ${tg.age}`,
          }],
        })
      }

      out.targetGroup = {
        name: [tg.gender !== 'All' ? tg.gender : null, tg.age ? `Age ${tg.age}` : null]
          .filter(Boolean).join(', ') || 'Filtered group',
        selections: selectionGroups.flatMap(g => g.items),
        selectionGroups,
      }
    }
  }

  return out
}
