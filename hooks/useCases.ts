'use client';

import { useState, useCallback } from 'react';
import { caseService, Case } from '@/services/caseService';

export function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await caseService.list();
      setCases(list);
      return list;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { cases, isLoading, fetchCases };
}
