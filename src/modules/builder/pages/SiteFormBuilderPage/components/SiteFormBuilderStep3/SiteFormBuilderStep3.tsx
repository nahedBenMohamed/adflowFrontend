import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import {
  type SiteFormConsentFormData,
  type SiteFormGratitudeFormData,
  SiteFormBuilderPageStepRoot,
} from '../../../../shared';
import { SiteFormConsentBlock, SiteFormGratitudeBlock } from './components';

const Root = styled(SiteFormBuilderPageStepRoot)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

interface Props {
  siteFormConsentFormData: SiteFormConsentFormData;
  siteFormGratitudeFormData: SiteFormGratitudeFormData;
}

const SiteFormBuilderStep3 = observer((props: Props) => {
  const { siteFormConsentFormData, siteFormGratitudeFormData } = props;

  return (
    <Root>
      <SiteFormConsentBlock siteFormConsentFormData={siteFormConsentFormData} />

      <SiteFormGratitudeBlock siteFormGratitudeFormData={siteFormGratitudeFormData} />
    </Root>
  );
});

SiteFormBuilderStep3.displayName = 'SiteFormBuilderStep3';
export { SiteFormBuilderStep3 };
