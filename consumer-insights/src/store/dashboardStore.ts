import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Dashboard, DashboardWidget } from '@/types';
import { seedDashboards } from '@/data/seed';

type DashboardStore = {
  dashboards: Dashboard[];
  add: (d: Dashboard) => void;
  update: (id: string, patch: Partial<Dashboard>) => void;
  updateLayout: (id: string, widgets: DashboardWidget[]) => void;
  remove: (id: string) => void;
  toggleShare: (id: string) => void;
};

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
  dashboards: seedDashboards,

  add: (d) => set((s) => ({ dashboards: [...s.dashboards, d] })),

  update: (id, patch) =>
    set((s) => ({
      dashboards: s.dashboards.map((d) =>
        d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d
      ),
    })),

  updateLayout: (id, widgets) =>
    set((s) => ({
      dashboards: s.dashboards.map((d) =>
        d.id === id ? { ...d, widgets, updatedAt: new Date().toISOString() } : d
      ),
    })),

  remove: (id) => set((s) => ({ dashboards: s.dashboards.filter((d) => d.id !== id) })),

  toggleShare: (id) =>
    set((s) => ({
      dashboards: s.dashboards.map((d) =>
        d.id === id ? { ...d, isShared: !d.isShared, updatedAt: new Date().toISOString() } : d
      ),
    })),
  }),
  { name: 'ci-dashboards' }
));
