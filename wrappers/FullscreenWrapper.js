import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFunctions } from '../hooks';

// Custom imports:
import { Group } from '../components';

export const FullscreenWrapper = ({ children }) => {
  const { t } = useTranslation();
  const { run } = useFunctions();
  
  // Custom consts:

  // Custom functions:

  return (
    <main id="FullscreenWrapper" className="view h-fill">
        
				<Group className="flex-grow-1">{children}</Group>
    </main>
  );
};
