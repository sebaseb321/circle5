import React from 'react';
import { useFunctions } from '../hooks';

// Custom imports:
import { Offcanvas } from '../components';
import { useTranslation } from 'react-i18next';

export const Cokkies_dialogDialog = () => {
    const { run } = useFunctions();
  // Custom exports:
	const { t } = useTranslation();

  // Custom functions:

  return (
    
    
			<Offcanvas id="cokkies_dialog" placement="end">
					<Offcanvas.Header>
						<Offcanvas.Title>{t('cokkies_dialog.title')}</Offcanvas.Title>
					</Offcanvas.Header>
					<Offcanvas.Body>
						{t('cokkies_dialog.text')}
					</Offcanvas.Body>
			</Offcanvas>
    
  );
};

export default Cokkies_dialogDialog;
