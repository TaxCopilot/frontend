'use client';

import { useCallback, useEffect } from 'react';
import { useDraftStore } from '@/stores/draftStore';

export function useDrafts() {
  const { drafts, currentDraft, templates, isLoading, fetchDrafts, fetchTemplates, createDraft, loadDraft, updateContent, setCurrentDraft } = useDraftStore();

  useEffect(() => {
    if (drafts.length === 0 && !isLoading) {
      fetchDrafts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTemplates = useCallback(async () => {
    if (templates.length === 0) {
      await fetchTemplates();
    }
  }, [templates.length, fetchTemplates]);

  return { drafts, currentDraft, templates, isLoading, fetchDrafts, loadTemplates, createDraft, loadDraft, updateContent, setCurrentDraft };
}
