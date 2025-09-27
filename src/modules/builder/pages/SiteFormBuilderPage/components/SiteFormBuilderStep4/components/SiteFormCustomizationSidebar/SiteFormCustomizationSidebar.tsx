import { HideScrollbarMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useWindowSize } from 'usehooks-ts';
import {
  BuilderStepSubtitle,
  SiteFormView,
  type SiteFormDesignFormData,
} from '../../../../../../shared';
import {
  AdvancedSettingsDelimiter,
  ClientButtonCustomizationBlock,
  CustomCSSBlock,
  FieldsCustomizationBlock,
  FormButtonCustomizationBlock,
  FormLayoutCustomizationBlock,
  HeaderCustomizationBlock,
  ModalOverlayCustomizationBlock,
  PoweredByLogoBlock,
} from './components';

const Root = styled.div<{ $navigationHeight: number }>`
  width: 480px;
  min-width: 480px;
  height: calc(
    100dvh - var(--header-with-subheader-height) -
      ${p => p.$navigationHeight}px - var(--fixed-builder-step-controls-height) - 82px
  );

  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 4px;
  overflow: hidden auto;

  ${HideScrollbarMixin};
`;

const SubtitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Description = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  siteFormDesignFormData: SiteFormDesignFormData;
}

const SiteFormCustomizationSidebar = observer((props: Props) => {
  const {
    siteFormDesignFormData: {
      headerDesignFormData,
      fieldsDesignFormData,
      formLayoutFormData,
      poweredByLogoEnabled,
      modalOverlayDesignFormData,
      formCustomCSSFormData,
      formButtonDesignFormData,
      clientButtonDesignFormData,
    },
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step4.sidebar',
  });

  const [navigationHeight, setNavigationHeight] = useState(0);
  const { width: windowWidth } = useWindowSize();

  useLayoutEffect(() => {
    const navigation = document.getElementById('workspace__NavStepsList--Root');

    if (navigation) setNavigationHeight(navigation.clientHeight);
  }, [windowWidth]);

  return (
    <Root $navigationHeight={navigationHeight}>
      <SubtitleWrapper>
        <BuilderStepSubtitle>{t('title')}</BuilderStepSubtitle>

        <Description>{t('description')}</Description>
      </SubtitleWrapper>

      <FormLayoutCustomizationBlock formLayoutFormData={formLayoutFormData} />

      <HeaderCustomizationBlock headerDesignFormData={headerDesignFormData} />

      <FieldsCustomizationBlock fieldsDesignFormData={fieldsDesignFormData} />

      <FormButtonCustomizationBlock buttonDesignFormData={formButtonDesignFormData} />

      {formLayoutFormData.view.value === SiteFormView.MODAL && (
        <ModalOverlayCustomizationBlock modalOverlayDesignFormData={modalOverlayDesignFormData} />
      )}

      {formLayoutFormData.view.value === SiteFormView.MODAL && (
        <ClientButtonCustomizationBlock buttonDesignFormData={clientButtonDesignFormData} />
      )}

      <PoweredByLogoBlock model={poweredByLogoEnabled} />

      <AdvancedSettingsDelimiter />

      <CustomCSSBlock formCustomCSSFormData={formCustomCSSFormData} />
    </Root>
  );
});

SiteFormCustomizationSidebar.displayName = 'SiteFormCustomizationSidebar';
export { SiteFormCustomizationSidebar };
