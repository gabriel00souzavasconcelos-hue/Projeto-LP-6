import { useState, useEffect } from 'react';
import { getSpecializations } from '../api/client';
import { Specialization } from '../types';

export const useSpecializations = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSpecializations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSpecializations();
      setSpecializations(data);
    } catch (err) {
      setError('Erro ao carregar especializações');
      console.error('Erro ao carregar especializações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecializations();
  }, []);

  return {
    specializations,
    loading,
    error,
    reload: loadSpecializations,
  };
};