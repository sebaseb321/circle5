import { useContext } from 'react';
import { FirebaseContext } from '../context';

export function useFirebase() {
  const context = useContext(FirebaseContext);
  return { ...context };
}
