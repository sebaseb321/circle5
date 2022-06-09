import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ContextProviders } from './context';


// Custom imports:
import Dialogs from './dialogs';
import { Home2View } from './pages';


import './styles/main.scss';

function App() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
          <title>{t('title')}</title>
          <meta name="description" content={t('description')} data-react-helmet="true" />
      </Helmet>
      <Router>
        <ContextProviders>
          <Switch>
            <Route exact path="/" component={Home2View} />
						<Route exact path="/Home2" component={Home2View} />
<Route exact path="/Home2/:params(.+)" component={Home2View} />

          </Switch>

					<Dialogs />
        </ContextProviders>
      </Router>
    </>
  );
}

export default App;
