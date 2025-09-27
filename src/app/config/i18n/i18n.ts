import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend, { type HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// to load namespaces in parallel on application start
const ns: string[] = [
  'common',
  'module.automation',
  'module.bpmn',
  'module.builder',
  'module.fields',
  'module.mailing',
  'module.notifications',
  'module.multichat',
  'module.notes',
  'module.products',
  'module.reporting',
  'module.scheduler',
  'module.telephony',
  'module.tutorial',
  'page.board-settings',
  'page.login',
  'page.settings',
  'page.system',
  'page.tasks',
  'store.field-groups-store',
  'store.fields-store',
  'component.card',
  'component.entity-board',
  'component.section',
];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    debug: false,
    fallbackLng: 'en',
    defaultNS: 'common',
    load: 'languageOnly',
    maxParallelReads: 32,

    ns,

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export { i18n };
