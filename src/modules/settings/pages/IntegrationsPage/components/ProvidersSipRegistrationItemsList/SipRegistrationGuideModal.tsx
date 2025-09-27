import {
  getMiniPbxIconByType,
  voximplantConnectorStore,
  type PbxProviderType,
} from '@/modules/telephony';
import { envUtil } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IntegrationInfoFeatureList } from '../IntegrationInfoFeatureList/IntegrationInfoFeatureList';
import { IntegrationInfoLink } from '../IntegrationInfoLink/IntegrationInfoLink';
import { IntegrationInfoModalTemplate } from '../IntegrationInfoModalTemplate/IntegrationInfoModalTemplate';
import { IntegrationInfoText } from '../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../IntegrationInfoTitle/IntegrationInfoTitle';
import {
  IntegrationOrderedList,
  IntegrationOrderedListItem,
} from '../IntegrationOrderedList/IntegrationOrderedList.styles';
import { TelephonyIntegrationGuide } from '../TelephonyIntegrationGuide/TelephonyIntegrationGuide/TelephonyIntegrationGuide';

interface Props {
  isOpened: boolean;
  installTo: string;
  providerType: PbxProviderType;
  onClose: () => void;
}

const SipRegistrationGuideModal = observer((props: Props) => {
  const { isOpened, installTo, providerType, onClose } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix:
      'settings_page.integrations_page.providers_sip_registration_items_list.sip_registration_guide_modal',
  });

  const navigate = useNavigate();

  const handleApprove = () => navigate(installTo);

  const billingManagementLink = voximplantConnectorStore.getBillingManagementLink();

  return (
    <IntegrationInfoModalTemplate
      hideCancel
      isOpened={isOpened}
      approveTitle={t('continue')}
      headerTitle={t('modal_title')}
      Icon={getMiniPbxIconByType(providerType)}
      onClose={onClose}
      onApprove={handleApprove}
    >
      <IntegrationInfoTitle>{t('step1.title')}</IntegrationInfoTitle>

      <IntegrationInfoText>{t('step1.annotation1')}</IntegrationInfoText>

      <TelephonyIntegrationGuide />

      <IntegrationInfoText>{t('step1.annotation2')}</IntegrationInfoText>

      <IntegrationInfoFeatureList
        features={[
          t('step1.item1'),
          t('step1.item2'),
          t('step1.item3'),
          t('step1.item4'),
          t('step1.item5'),
        ]}
      />

      <IntegrationInfoText>{t('step1.annotation3')}</IntegrationInfoText>

      <IntegrationInfoTitle>{t('step2.title')}</IntegrationInfoTitle>

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>{t('step2.item1')}</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{t('step2.item2')}</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{t('step2.item3')}</IntegrationOrderedListItem>

        {billingManagementLink && (
          <IntegrationInfoLink
            label={t('step2.voximplant_billing_rates')}
            to={billingManagementLink}
          />
        )}

        <IntegrationOrderedListItem>{t('step2.item4')}</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{t('step2.item5')}</IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoText>
        {t('step2.annotation', { mail: envUtil.appDemoEmail })}
      </IntegrationInfoText>

      <IntegrationInfoLink label={envUtil.appDemoEmail} to={`mailto:${envUtil.appDemoEmail}`} />
    </IntegrationInfoModalTemplate>
  );
});

SipRegistrationGuideModal.displayName = 'SipRegistrationGuideModal';
export { SipRegistrationGuideModal };
