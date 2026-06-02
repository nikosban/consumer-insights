import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, Analysis } from '@/types';
import { seedProjects } from '@/data/seed';

type ProjectStore = {
  projects: Project[];
  add: (p: Project) => void;
  update: (id: string, patch: Partial<Project>) => void;
  remove: (id: string) => void;
  addAnalysis: (projectId: string, analysis: Analysis) => void;
  updateAnalysis: (projectId: string, analysisId: string, patch: Partial<Analysis>) => void;
  removeAnalysis: (projectId: string, analysisId: string) => void;
  linkDashboard: (projectId: string, dashboardId: string) => void;
  unlinkDashboard: (projectId: string, dashboardId: string) => void;
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
  projects: seedProjects,

  add: (p) => set((s) => ({ projects: [...s.projects, p] })),

  update: (id, patch) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),

  remove: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

  addAnalysis: (projectId, analysis) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId ? { ...p, savedAnalyses: [...p.savedAnalyses, analysis] } : p
      ),
    })),

  updateAnalysis: (projectId, analysisId, patch) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId
          ? { ...p, savedAnalyses: p.savedAnalyses.map((a) => a.id === analysisId ? { ...a, ...patch } : a) }
          : p
      ),
    })),

  removeAnalysis: (projectId, analysisId) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId
          ? { ...p, savedAnalyses: p.savedAnalyses.filter((a) => a.id !== analysisId) }
          : p
      ),
    })),

  linkDashboard: (projectId, dashboardId) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId && !p.dashboardIds.includes(dashboardId)
          ? { ...p, dashboardIds: [...p.dashboardIds, dashboardId] }
          : p
      ),
    })),

  unlinkDashboard: (projectId, dashboardId) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId
          ? { ...p, dashboardIds: p.dashboardIds.filter((id) => id !== dashboardId) }
          : p
      ),
    })),
  }),
  { name: 'ci-projects' }
));
