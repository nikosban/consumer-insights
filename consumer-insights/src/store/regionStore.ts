import { create } from 'zustand'

export type Region = {
  id: string
  name: string
  countries: string[]
  isBuiltIn: boolean
}

export const ALL_COUNTRIES = [
  'United States', 'Germany', 'United Kingdom', 'France', 'Italy',
  'Spain', 'Australia', 'Japan', 'Brazil', 'Canada',
  'Netherlands', 'Poland', 'Sweden', 'Mexico', 'South Korea',
]

export const COUNTRY_CODE: Record<string, string> = {
  'United States': 'US', 'Germany': 'DE', 'United Kingdom': 'UK',
  'France': 'FR', 'Italy': 'IT', 'Spain': 'ES', 'Australia': 'AU',
  'Japan': 'JP', 'Brazil': 'BR', 'Canada': 'CA', 'Netherlands': 'NL',
  'Poland': 'PL', 'Sweden': 'SE', 'Mexico': 'MX', 'South Korea': 'KR',
}

const BUILT_IN: Region[] = [
  { id: 'global',         name: 'Global',         countries: ALL_COUNTRIES,                                                                isBuiltIn: true },
  { id: 'us',             name: 'United States',   countries: ['United States'],                                                            isBuiltIn: true },
  { id: 'north-america',  name: 'North America',   countries: ['United States', 'Canada', 'Mexico'],                                        isBuiltIn: true },
  { id: 'europe',         name: 'Europe',          countries: ['Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Netherlands', 'Poland', 'Sweden'], isBuiltIn: true },
  { id: 'dach',           name: 'DACH',            countries: ['Germany'],                                                                  isBuiltIn: true },
  { id: 'nordics',        name: 'Nordics',         countries: ['Sweden'],                                                                   isBuiltIn: true },
  { id: 'apac',           name: 'APAC',            countries: ['Australia', 'Japan', 'South Korea'],                                        isBuiltIn: true },
  { id: 'de-fr-us',       name: 'DE · FR · US',    countries: ['Germany', 'France', 'United States'],                                       isBuiltIn: true },
  { id: 'latam',          name: 'LATAM',           countries: ['Brazil', 'Mexico'],                                                         isBuiltIn: true },
]

type RegionStore = {
  regions: Region[]
  add: (name: string, countries: string[]) => string
  update: (id: string, name: string, countries: string[]) => void
  remove: (id: string) => void
}

export const useRegionStore = create<RegionStore>((set) => ({
  regions: BUILT_IN,

  add: (name, countries) => {
    const id = `region-${Date.now()}`
    set((s) => ({ regions: [...s.regions, { id, name, countries, isBuiltIn: false }] }))
    return id
  },

  update: (id, name, countries) =>
    set((s) => ({
      regions: s.regions.map((r) => r.id === id ? { ...r, name, countries } : r),
    })),

  remove: (id) =>
    set((s) => ({ regions: s.regions.filter((r) => r.id !== id) })),
}))
