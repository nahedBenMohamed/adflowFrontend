import { StyledLink } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { voximplantConnectorStore } from '../../../../store';

const VoximplantBillingManagementLink = observer(() => {
  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_sip_registrations_page',
  });

  const billingManagementLink = voximplantConnectorStore.getBillingManagementLink();

  return (
    billingManagementLink && (
      <StyledLink target="_blank" rel="noopener noreferrer" to={billingManagementLink}>
        {t('link_to_vx_portal')}
      </StyledLink>
    )
  );
});

VoximplantBillingManagementLink.displayName = 'BillingManagementLink';
export { VoximplantBillingManagementLink };
