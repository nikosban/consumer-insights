import { create } from 'zustand';
import type { Widget } from '@/types';
import { seedWidgets } from '@/data/seed';

type WidgetStore = {
  widgets: Widget[];
  add: (w: Widget) => void;
  update: (id: string, patch: Partial<Widget>) => void;
  remove: (id: string) => void;
};

export const useWidgetStore = create<WidgetStore>((set) => ({
  widgets: seedWidgets,

  add: (w) => set((s) => ({ widgets: [...s.widgets, w] })),

  update: (id, patch) =>
    set((s) => ({
      widgets: s.widgets.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    })),

  remove: (id) => set((s) => ({ widgets: s.widgets.filter((w) => w.id !== id) })),
}));
