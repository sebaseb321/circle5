import { useContext } from 'react';
import { AnalyticsContext } from '../context';

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  return { ...context };
}
