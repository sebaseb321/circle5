import React from 'react';

import { FunctionsProvider } from './Functions';
import { RefsProvider } from './Refs';
// Custom imports:
import { FirebaseProvider } from './Firebase';
import { DialogsProvider } from './Dialogs';


export const ContextProviders = ({ children }) => {
  // Custom code:
  return (
    
		<FirebaseProvider>
			<RefsProvider>
				<DialogsProvider>
					<FunctionsProvider>
						<>{children}</>
					</FunctionsProvider>
				</DialogsProvider>
			</RefsProvider>
		</FirebaseProvider>

  );
};


export * from './Functions';
export * from './Refs';
// Custom exports:
export * from './Firebase';
export * from './Dialogs';
