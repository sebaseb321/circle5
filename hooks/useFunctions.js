import { useContext } from 'react';
import { FunctionsContext } from '../context';

export function useFunctions() {
  const context = useContext(FunctionsContext);
  return { ...context };
}
