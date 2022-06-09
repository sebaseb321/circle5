import { useContext } from 'react';
import { RefsContext } from '../context';

export function useRefs() {
  const context = useContext(RefsContext);
  return { ...context };
}
