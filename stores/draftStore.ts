import { create } from 'zustand';
import { draftService, Draft, Template } from '@/services/draftService';

interface DraftState {
  drafts: Draft[];
  currentDraft: Draft | null;
  templates: Template[];
  isLoading: boolean;

  fetchDrafts: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  createDraft: (payload: { title?: string; templateId?: string; content?: string }) => Promise<Draft>;
  loadDraft: (id: string) => Promise<void>;
  updateContent: (id: string, content: string) => Promise<void>;
  updateMetadata: (id: string, payload: { title?: string, category?: string }) => Promise<void>;
  setCurrentDraft: (draft: Draft | null) => void;

  trashDraft: (id: string) => Promise<void>;
  fetchTrash: () => Promise<void>;
  trash: Draft[];
  restoreDraft: (id: string) => Promise<void>;
  permanentDelete: (id: string) => Promise<void>;
}

export const useDraftStore = create<DraftState>((set, get) => ({
  drafts: [],
  trash: [],
  currentDraft: null,
  templates: [],
  isLoading: false,

  fetchDrafts: async () => {
    set({ isLoading: true });
    try {
      const drafts = await draftService.getDrafts();
      set({ drafts, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchTemplates: async () => {
    try {
      const templates = await draftService.getTemplates();
      set({ templates });
    } catch {
      /* silently fail */
    }
  },

  createDraft: async (payload) => {
    const draft = await draftService.createDraft(payload);
    set({ drafts: [draft, ...get().drafts] });
    return draft;
  },

  loadDraft: async (id) => {
    set({ isLoading: true });
    try {
      const draft = await draftService.getDraft(id);
      set({ currentDraft: draft, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  updateContent: async (id, content) => {
    await draftService.updateDraft(id, { content });
    const current = get().currentDraft;
    if (current && current.id === id) {
      set({ currentDraft: { ...current, content } });
    }
  },

  updateMetadata: async (id, payload) => {
    const updated = await draftService.updateDraft(id, payload);
    set({
      drafts: get().drafts.map((d) => (d.id === id ? updated : d)),
      currentDraft: get().currentDraft?.id === id ? updated : get().currentDraft,
    });
  },

  setCurrentDraft: (draft) => set({ currentDraft: draft }),

  trashDraft: async (id) => {
    await draftService.trashDraft(id);
    set({ drafts: get().drafts.filter((d) => d.id !== id) });
  },

  fetchTrash: async () => {
    set({ isLoading: true });
    try {
      const trash = await draftService.getTrash();
      set({ trash, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  restoreDraft: async (id) => {
    await draftService.restoreDraft(id);
    set({ trash: get().trash.filter((d) => d.id !== id) });
    // Refetch workspace drafts in the background or rely on fetchDrafts on mount
  },

  permanentDelete: async (id) => {
    await draftService.permanentDeleteDraft(id);
    set({ trash: get().trash.filter((d) => d.id !== id) });
  },
}));
