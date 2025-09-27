import { generalSettingsStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  ErrorBoundary,
  GTMUtil,
  UserRole,
  WholePageLoaderWithLogo,
  envUtil,
  serverEventService,
  useCheckBrowserSupport,
} from '@/shared';
import { useDocumentTitle } from '@mantine/hooks';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Suspense, useEffect, useMemo } from 'react';
import { Helmet, type HelmetProps } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './routes';
import { appStore } from './store';

const App = observer(() => {
  const { i18n, t } = useTranslation();

  useDocumentTitle(envUtil.appName);

  const isBrowserSupported = useCheckBrowserSupport();

  const router = useMemo(() => createRouter({ isBrowserSupported }), [isBrowserSupported]);

  useEffect(() => {
    GTMUtil.initializeGTM();

    authStore.startAuth();

    when(
      () => authStore.isAuthenticated,
      () => {
        const { user: currentUser } = authStore;

        if (currentUser && currentUser.role !== UserRole.PARTNER) serverEventService.connect();
      }
    );

    return () => {
      serverEventService.disconnect();
    };
  }, []);

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        const changeLanguage = (lng: string) => {
          i18n.changeLanguage(lng);

          document.documentElement.lang = lng;
        };

        const { accountSettings } = generalSettingsStore;

        if (accountSettings && accountSettings.language !== i18n.language)
          changeLanguage(accountSettings.language);
      }
    );
  }, [i18n]);

  const helmetHTMLAttributes = useMemo<HelmetProps['htmlAttributes']>(
    () => ({ lang: i18n.language }),
    [i18n.language]
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={<WholePageLoaderWithLogo />}>
        <Helmet htmlAttributes={helmetHTMLAttributes}>
          <meta name="description" content={t('meta_description', { company: envUtil.appName })} />

          {/* icons */}
          <link
            sizes="180x180"
            rel="apple-touch-icon"
            href={`/favicons/${envUtil.appNameLowerCase}/apple_touch_180x180.png`}
          />
          <link
            sizes="167x167"
            rel="apple-touch-icon"
            href={`/favicons/${envUtil.appNameLowerCase}/apple_touch_167x167.png`}
          />
          <link
            sizes="152x262"
            rel="apple-touch-icon"
            href={`/favicons/${envUtil.appNameLowerCase}/apple_touch_152x152.png`}
          />
          <link
            sizes="120x120"
            rel="apple-touch-icon"
            href={`/favicons/${envUtil.appNameLowerCase}/apple_touch_120x120.png`}
          />

          <link
            rel="icon"
            sizes="16x16"
            type="image/svg+xml"
            href={`/favicons/${envUtil.appNameLowerCase}/favicon_16x16.svg`}
          />
          <link
            rel="icon"
            sizes="32x32"
            type="image/svg+xml"
            href={`/favicons/${envUtil.appNameLowerCase}/favicon_32x32.svg`}
          />

          {/* .png icons for Safari */}
          <link
            rel="icon"
            sizes="16x16"
            type="image/png"
            href={`/favicons/${envUtil.appNameLowerCase}/favicon_16x16.png`}
          />
          <link
            rel="icon"
            sizes="32x32"
            type="image/png"
            href={`/favicons/${envUtil.appNameLowerCase}/favicon_32x32.png`}
          />
        </Helmet>

        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
});

export { App };

// I was here through multiple MVPs and paradigm shifts. Some code was
// written, and some architecture was developed, though not as well as it could
// have been due to a lack of time and resources.

// If you're reading this and have any questions, feel free to reach out to me! 😎

// https://github.com/kr4chinin (2022-2024)
