import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Audience } from '@/types';
import { seedAudiences } from '@/data/seed';

type AudienceStore = {
  audiences: Audience[];
  add: (a: Audience) => void;
  update: (id: string, patch: Partial<Audience>) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => void;
};

export const useAudienceStore = create<AudienceStore>()(
  persist(
    (set, get) => ({
  audiences: seedAudiences,

  add: (a) => set((s) => ({ audiences: [...s.audiences, a] })),

  update: (id, patch) =>
    set((s) => ({
      audiences: s.audiences.map((a) =>
        a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
      ),
    })),

  remove: (id) => set((s) => ({ audiences: s.audiences.filter((a) => a.id !== id) })),

  duplicate: (id) => {
    const original = get().audiences.find((a) => a.id === id);
    if (!original) return;
    const copy: Audience = {
      ...original,
      id: `aud-${Date.now()}`,
      name: `${original.name} (Copy)`,
      isShared: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({ audiences: [...s.audiences, copy] }));
  },
  }),
  { name: 'ci-audiences' }
));
