import React, { useEffect } from 'react';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { I18nextProvider } from 'react-i18next';
import { xx, es, en } from './locales';

i18next.use(LanguageDetector).init({
  resources: {
    xx,
		es,
		en
  },
  fallbackLng: 'xx',
  supportedLngs: ['xx', 'es', 'en'],
  nonExplicitSupportedLngs: true,
  load: 'languageOnly',
  defaultNS: 'translation',
  fallbackNS: ['translation'],
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['querystring', 'localStorage', 'navigator'],

    lookupLocalStorage: 'language',
    lookupQuerystring: 'hl',

    caches: ['localStorage'],
    excludeCacheFor: ['cimode'],
  },
  wait: true,
});

class I18N extends React.PureComponent {
  componentDidMount() {
    i18next.changeLanguage(this.props.locale);
  }

  componentDidUpdate(prevProps) {
    const { locale: newLocale } = this.props;
    const { locale: oldLocale } = prevProps;

    if (oldLocale !== newLocale) {
      i18next.changeLanguage(newLocale);
    }
  }

  render() {
    return (
      <I18nextProvider i18n={i18next}>{this.props.children}</I18nextProvider>
    );
  }
}

export default I18N;
export { i18next };
