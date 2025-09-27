import { envUtil, type ModalControl } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { fbMessengerProviderSettingsStore } from '../../../../../../../store';
import { IntegrationInfoFeatureList } from '../../../../IntegrationInfoFeatureList/IntegrationInfoFeatureList';
import { IntegrationInfoLink } from '../../../../IntegrationInfoLink/IntegrationInfoLink';
import { IntegrationInfoTitle } from '../../../../IntegrationInfoTitle/IntegrationInfoTitle';
import { FbMessengerModalTemplate } from '../FbMessengerModalTemplate/FbMessengerModalTemplate';

interface Props {
  control: ModalControl;
}

const FbMessengerFirstInfoModal = observer((props: Props) => {
  const { control } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.fb_messenger.fb_messenger_first_info_modal',
  });

  const { isGettingRedirectUrl, getAuthRedirectUrl } = fbMessengerProviderSettingsStore;

  const features: string[] = [t('feature1'), t('feature2'), t('feature3'), t('feature4')];

  const handleApprove = async (): Promise<void> => {
    const url = await getAuthRedirectUrl();

    window.location.href = url;
    control.close();
  };

  return (
    <FbMessengerModalTemplate
      opened={control.opened}
      loading={isGettingRedirectUrl}
      hide={control.close}
      onApprove={handleApprove}
    >
      <IntegrationInfoTitle>{t('title', { company: envUtil.appName })}</IntegrationInfoTitle>

      <IntegrationInfoFeatureList features={features} />

      <IntegrationInfoLink
        target="_blank"
        to="https://www.facebook.com/help/405094243235242"
        label={t('learn_more')}
      />
    </FbMessengerModalTemplate>
  );
});

FbMessengerFirstInfoModal.displayName = 'FbMessengerFirstInfoModal';
export { FbMessengerFirstInfoModal };
