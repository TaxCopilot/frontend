'use client';

import { useState, useCallback } from 'react';
import { caseService, Case } from '@/services/caseService';

export function useCase(caseId: string | null) {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCase = useCallback(async () => {
    if (!caseId) {
      setCaseData(null);
      setIsLoading(false);
      return null;
    }
    setIsLoading(true);
    try {
      const c = await caseService.getById(caseId);
      setCaseData(c);
      return c;
    } catch {
      setCaseData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  return { caseData, isLoading, fetchCase };
}
