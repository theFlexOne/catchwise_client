import { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
