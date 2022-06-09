import { useContext } from 'react';
import { DialogsContext } from '../context';

export function useDialogs() {
  const context = useContext(DialogsContext);
  return { ...context };
}
