import { envUtil, type ModalControl } from '@/shared';
import { useTranslation } from 'react-i18next';
import { IntegrationInfoFeatureList } from '../../../../IntegrationInfoFeatureList/IntegrationInfoFeatureList';
import { IntegrationInfoLink } from '../../../../IntegrationInfoLink/IntegrationInfoLink';
import { IntegrationInfoTitle } from '../../../../IntegrationInfoTitle/IntegrationInfoTitle';
import { TwilioWhatsAppModalTemplate } from '../TwilioWhatsAppModalTemplate/TwilioWhatsAppModalTemplate';

interface Props {
  control: ModalControl;
  onApprove: () => void;
}

const TwilioWhatsAppFirstInfoModal = (props: Props) => {
  const { control, onApprove } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.whatsapp.whatsapp_first_info_modal',
  });

  const features: string[] = [t('feature1'), t('feature2'), t('feature3'), t('feature4')];

  return (
    <TwilioWhatsAppModalTemplate opened={control.opened} hide={control.close} onApprove={onApprove}>
      <IntegrationInfoTitle>{t('title', { company: envUtil.appName })}</IntegrationInfoTitle>

      <IntegrationInfoFeatureList features={features} />

      <IntegrationInfoLink
        target="_blank"
        label={t('learn_more')}
        to="https://www.twilio.com/whatsapp"
      />
    </TwilioWhatsAppModalTemplate>
  );
};

export { TwilioWhatsAppFirstInfoModal };
