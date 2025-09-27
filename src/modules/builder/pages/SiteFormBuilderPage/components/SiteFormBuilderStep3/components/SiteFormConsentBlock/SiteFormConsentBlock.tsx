import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { SiteFormConsentFormData } from '../../../../../../shared';
import { BlockTemplate } from '../BlockTemplate/BlockTemplate';
import { SiteFormConsentControls, SiteFormConsentSkeleton } from './components';

const Root = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 48px;
`;

interface Props {
  siteFormConsentFormData: SiteFormConsentFormData;
}

const SiteFormConsentBlock = observer((props: Props) => {
  const { siteFormConsentFormData } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step3.consent_block',
  });

  return (
    <BlockTemplate title={t('title')}>
      <Root>
        <SiteFormConsentControls siteFormConsentFormData={siteFormConsentFormData} />

        <SiteFormConsentSkeleton siteFormConsentFormData={siteFormConsentFormData} />
      </Root>
    </BlockTemplate>
  );
});

SiteFormConsentBlock.displayName = 'SiteFormConsentBlock';
export { SiteFormConsentBlock };
