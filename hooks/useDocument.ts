'use client';

import { useState, useEffect } from 'react';
import { documentService, AnalysisFile } from '@/services/documentService';

interface UseDocumentResult {
  document: AnalysisFile | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook — fetch a single analysis file by ID.
 * Wraps documentService.getAnalysisFile so components don't call the service directly.
 */
export function useDocument(docId: string | null): UseDocumentResult {
  const [document, setDocument] = useState<AnalysisFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchDoc = async () => {
      try {
        setLoading(true);
        setError(null);
        const doc = await documentService.getAnalysisFile(docId);
        if (!cancelled) setDocument(doc);
      } catch (err: any) {
        if (!cancelled) setError('Failed to load document. Please try again.');
        console.error('[useDocument]', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDoc();

    return () => {
      cancelled = true;
    };
  }, [docId]);

  return { document, loading, error };
}
