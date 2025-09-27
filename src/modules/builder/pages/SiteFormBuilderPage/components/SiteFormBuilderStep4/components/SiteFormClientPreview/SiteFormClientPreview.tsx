import { DefaultLoader, envUtil, HideScrollbarMixin, PrimaryButton } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useWindowSize } from 'usehooks-ts';
import { HorizontalStepMotion } from '../../../../../../shared';
import { SiteFormClientPreviewOnDevices } from './components';

const Root = styled.div<{ $navigationHeight: number }>`
  width: 100%;
  height: calc(
    100dvh - var(--header-with-subheader-height) -
      ${p => p.$navigationHeight}px - var(--fixed-builder-step-controls-height) - 82px
  );

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const PreviewFrame = styled.iframe`
  * {
    ${HideScrollbarMixin};
  }
`;

const ErrorBlock = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-red-default);
`;

interface Props {
  previewUrl: string;
  previewOpened: boolean;
  hideIframe?: boolean;
  closePreview: () => void;
}

const SiteFormClientPreview = (props: Props) => {
  const { previewUrl, previewOpened, hideIframe, closePreview } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step4.preview',
  });

  const [navigationHeight, setNavigationHeight] = useState(0);
  const { width: windowWidth } = useWindowSize();

  const [isPreviewLoaded, { open: previewLoaded }] = useDisclosure(false);
  const [isPreviewError, { open: previewError }] = useDisclosure(false);

  useLayoutEffect(() => {
    const navigation = document.getElementById('workspace__NavStepsList--Root');

    if (navigation) setNavigationHeight(navigation.clientHeight);
  }, [windowWidth]);

  // TODO: Finish preview on devices functionality
  if (previewOpened)
    return (
      <HorizontalStepMotion motionKey="site-form-device-preview" direction="right">
        <SiteFormClientPreviewOnDevices onClose={closePreview} />
      </HorizontalStepMotion>
    );

  return (
    <Root $navigationHeight={navigationHeight}>
      <PrimaryButton
        linkProps={{
          target: '_blank',
          to: previewUrl,
          rel: 'noopener noreferrer',
        }}
      >
        {t('open_in_a_new_tab')}
      </PrimaryButton>

      {!isPreviewLoaded && !hideIframe && <DefaultLoader />}

      {isPreviewError && <ErrorBlock>{t('error')}</ErrorBlock>}

      {!isPreviewError && !hideIframe && (
        <PreviewFrame
          width="100%"
          height="800px"
          src={previewUrl}
          title={t('iframe_title', { companyName: envUtil.appName })}
          onLoad={previewLoaded}
          onError={previewError}
        />
      )}
    </Root>
  );
};

export { SiteFormClientPreview };
