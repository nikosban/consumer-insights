import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// @ts-ignore — JS file without declaration
import { countries } from '../data/countries'

interface DisplayOptions {
  absolute: boolean
  population: boolean
  percent: boolean
}

interface Country {
  code: string
  name: string
  flag: string
}

interface TargetGroupSelection {
  catId: string
  catLabel: string
  subcatId: string
  subcatLabel: string
  item: string
}

interface TargetGroup {
  id: string
  name: string
  selections: TargetGroupSelection[]
}

interface LegacyState {
  // UI
  openAccordion: 'survey' | 'target'
  openCategories: string[]
  openSubcats: string[]
  openDropdown: null | 'country' | 'year' | 'download'
  displayOptionsOpen: boolean
  selectionHidden: boolean
  isDragging: boolean

  // Selections
  addedItems: string[]
  rowItems: string[]
  colItems: string[]
  detailsName: null | string

  // Filters
  selectedCountry: Country
  selectedYear: string
  displayOptions: DisplayOptions

  // Target Groups
  targetGroups: TargetGroup[]
  targetGroupModalId: null | 'create' | string
  appliedFilterGroupId: null | string

  // Actions
  setOpenAccordion: (id: 'survey' | 'target') => void
  toggleCategory: (id: string) => void
  toggleSubcat: (id: string) => void
  setOpenDropdown: (id: null | 'country' | 'year' | 'download') => void
  toggleDisplayOptionsOpen: () => void
  toggleSelectionHidden: () => void
  setSelectionHidden: (val: boolean) => void
  setIsDragging: (val: boolean) => void

  toggleItem: (name: string, targetZone?: 'row' | 'col') => void
  addToZone: (zone: 'row' | 'col', name: string) => void
  removeFromZone: (zone: 'row' | 'col', name: string) => void
  moveZoneItem: (fromZone: 'row' | 'col', name: string) => void
  clearAll: () => void

  setSelectedCountry: (c: Country) => void
  setSelectedYear: (y: string) => void
  toggleDisplayOption: (key: keyof DisplayOptions) => void

  setDetailsName: (name: null | string) => void

  // Target group actions
  openTargetGroupModal: (id: 'create' | string) => void
  closeTargetGroupModal: () => void
  saveTargetGroup: (draft: { id?: string; name: string; selections: TargetGroupSelection[] }) => void
  deleteTargetGroup: (id: string) => void
  applyFilterGroup: (id: string | null) => void
}

export const useLegacyStore = create<LegacyState>()(
  persist(
    (set, get) => ({
      openAccordion: 'survey',
      openCategories: [],
      openSubcats: [],
      openDropdown: null,
      displayOptionsOpen: false,
      selectionHidden: false,
      isDragging: false,

      addedItems: [],
      rowItems: [],
      colItems: [],
      detailsName: null,

      selectedCountry: countries[0],
      selectedYear: '2026 - Update 1',
      displayOptions: { absolute: true, population: true, percent: true },

      targetGroups: [],
      targetGroupModalId: null,
      appliedFilterGroupId: null,

      setOpenAccordion: (id) => set({ openAccordion: id }),

      toggleCategory: (id) => set(s => ({
        openCategories: s.openCategories.includes(id)
          ? s.openCategories.filter(c => c !== id)
          : [...s.openCategories, id],
      })),

      toggleSubcat: (id) => set(s => ({
        openSubcats: s.openSubcats.includes(id)
          ? s.openSubcats.filter(c => c !== id)
          : [...s.openSubcats, id],
      })),

      setOpenDropdown: (id) => set({ openDropdown: id, ...(id !== null ? { displayOptionsOpen: false } : {}) }),

      toggleDisplayOptionsOpen: () => set(s => ({ displayOptionsOpen: !s.displayOptionsOpen, openDropdown: null })),

      toggleSelectionHidden: () => set(s => ({ selectionHidden: !s.selectionHidden })),
      setSelectionHidden: (val) => set({ selectionHidden: val }),

      setIsDragging: (val) => set({ isDragging: val }),

      toggleItem: (name, targetZone = 'row') => set(s => {
        if (s.addedItems.includes(name)) {
          return {
            addedItems: s.addedItems.filter(n => n !== name),
            rowItems: s.rowItems.filter(n => n !== name),
            colItems: s.colItems.filter(n => n !== name),
            detailsName: s.detailsName === name ? null : s.detailsName,
          }
        }
        return {
          addedItems: [...s.addedItems, name],
          rowItems: targetZone === 'row' ? (s.rowItems.includes(name) ? s.rowItems : [...s.rowItems, name]) : s.rowItems,
          colItems: targetZone === 'col' ? (s.colItems.includes(name) ? s.colItems : [...s.colItems, name]) : s.colItems,
        }
      }),

      addToZone: (zone, name) => set(s => ({
        rowItems: zone === 'row' ? (s.rowItems.includes(name) ? s.rowItems : [...s.rowItems, name]) : s.rowItems,
        colItems: zone === 'col' ? (s.colItems.includes(name) ? s.colItems : [...s.colItems, name]) : s.colItems,
      })),

      removeFromZone: (zone, name) => set(s => ({
        rowItems: zone === 'row' ? s.rowItems.filter(n => n !== name) : s.rowItems,
        colItems: zone === 'col' ? s.colItems.filter(n => n !== name) : s.colItems,
      })),

      moveZoneItem: (fromZone, name) => {
        const toZone = fromZone === 'row' ? 'col' : 'row'
        get().removeFromZone(fromZone, name)
        get().addToZone(toZone, name)
      },

      clearAll: () => set({ addedItems: [], rowItems: [], colItems: [], detailsName: null }),

      setSelectedCountry: (c) => set({ selectedCountry: c }),
      setSelectedYear: (y) => set({ selectedYear: y }),

      toggleDisplayOption: (key) => set(s => ({
        displayOptions: { ...s.displayOptions, [key]: !s.displayOptions[key] },
      })),

      setDetailsName: (name) => set({ detailsName: name }),

      openTargetGroupModal: (id) => set({ targetGroupModalId: id }),
      closeTargetGroupModal: () => set({ targetGroupModalId: null }),
      saveTargetGroup: (draft) => set(s => {
        if (draft.id) {
          return { targetGroups: s.targetGroups.map(g => g.id === draft.id ? { ...g, name: draft.name, selections: draft.selections } : g) }
        }
        const id = `tg-${Date.now()}`
        return { targetGroups: [...s.targetGroups, { id, name: draft.name, selections: draft.selections }] }
      }),
      deleteTargetGroup: (id) => set(s => ({
        targetGroups: s.targetGroups.filter(g => g.id !== id),
        appliedFilterGroupId: s.appliedFilterGroupId === id ? null : s.appliedFilterGroupId,
      })),
      applyFilterGroup: (id) => set({ appliedFilterGroupId: id }),
    }),
    {
      name: 'legacy-ci-v1',
      partialize: (state) => ({
        targetGroups: state.targetGroups,
        appliedFilterGroupId: state.appliedFilterGroupId,
        rowItems: state.rowItems,
        colItems: state.colItems,
        addedItems: state.addedItems,
        selectedCountry: state.selectedCountry,
        selectedYear: state.selectedYear,
        displayOptions: state.displayOptions,
        selectionHidden: state.selectionHidden,
      }),
    }
  )
)
