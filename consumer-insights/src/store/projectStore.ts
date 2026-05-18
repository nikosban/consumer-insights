import { create } from 'zustand';
import type { Project, Analysis, Note } from '@/types';
import { seedProjects } from '@/data/seed';

type ProjectStore = {
  projects: Project[];
  add: (p: Project) => void;
  update: (id: string, patch: Partial<Project>) => void;
  remove: (id: string) => void;
  addAnalysis: (projectId: string, analysis: Analysis) => void;
  updateAnalysis: (projectId: string, analysisId: string, patch: Partial<Analysis>) => void;
  removeAnalysis: (projectId: string, analysisId: string) => void;
  addNote: (projectId: string, note: Note) => void;
  updateNote: (projectId: string, noteId: string, content: string) => void;
  removeNote: (projectId: string, noteId: string) => void;
  linkDashboard: (projectId: string, dashboardId: string) => void;
  unlinkDashboard: (projectId: string, dashboardId: string) => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
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

  addNote: (projectId, note) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId ? { ...p, notes: [...p.notes, note] } : p
      ),
    })),

  updateNote: (projectId, noteId, content) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId
          ? { ...p, notes: p.notes.map((n) => (n.id === noteId ? { ...n, content } : n)) }
          : p
      ),
    })),

  removeNote: (projectId, noteId) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId ? { ...p, notes: p.notes.filter((n) => n.id !== noteId) } : p
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
}));
