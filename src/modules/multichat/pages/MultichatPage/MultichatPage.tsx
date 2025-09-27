import { appStore, iconStore } from '@/app';
import {
  DefaultHeader,
  IconName,
  MailingAndChatPageTemplate,
  MediaBreakpoints,
  TutorialProductType,
  WholePageLoaderWithLogo,
  useMobile,
  useTitle,
  type DefaultHeaderModuleIconProps,
} from '@/shared';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useMultichatContext } from '../../context';
import { MultichatControl, MultichatMobileControl } from '../../shared';

const Root = styled.div`
  height: calc(100dvh - var(--header-with-subheader-height));

  display: flex;

  @media ${MediaBreakpoints.SM} {
    width: calc(100vw - var(--sidebar-width));
  }
`;

const MultichatPage = observer(() => {
  const { hide, openPage, closePage } = useMultichatContext();

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page',
  });

  useTitle({ titleTranslationKey: 'mailing' });

  const isMobile = useMobile();

  useLayoutEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        hide();

        openPage();
      }
    );

    return () => closePage();
  }, [closePage, hide, openPage]);

  const moduleIconProps = useMemo<DefaultHeaderModuleIconProps>(
    () => ({
      color: iconStore.systemModuleColor,
      icon: iconStore.getByName(IconName.MAIL).icon,
    }),
    []
  );

  return (
    <MailingAndChatPageTemplate
      marginRight={0}
      rootWidth="100%"
      Header={
        <DefaultHeader
          hideMultichat
          moduleName={t('title')}
          moduleIconProps={moduleIconProps}
          productType={TutorialProductType.MULTI_MESSENGER}
        />
      }
    >
      {appStore.isLoaded ? (
        <Root>{isMobile ? <MultichatMobileControl /> : <MultichatControl />}</Root>
      ) : (
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      )}
    </MailingAndChatPageTemplate>
  );
});

MultichatPage.displayName = 'MultichatPage';
export { MultichatPage };
