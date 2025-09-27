import { envUtil } from '@/shared';
import { useTranslation } from 'react-i18next';
import { IntegrationInfoFeatureList } from '../../../../IntegrationInfoFeatureList/IntegrationInfoFeatureList';
import { IntegrationInfoLink } from '../../../../IntegrationInfoLink/IntegrationInfoLink';
import { IntegrationInfoText } from '../../../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../../../../IntegrationInfoTitle/IntegrationInfoTitle';
import { WazzupModalTemplate } from '../WazzupModalTemplate/WazzupModalTemplate';

interface Props {
  firstInfoModalOpened: boolean;
  onApprove: () => void;
  handleCloseFirstInfoModal: () => void;
}

const WazzupFirstInfoModal = (props: Props) => {
  const { firstInfoModalOpened, onApprove, handleCloseFirstInfoModal } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.wazzup.wazzup_first_info_modal',
  });

  const company = envUtil.appName;

  const features: string[] = [
    t('feature1', { company }),
    t('feature2'),
    t('feature3'),
    t('feature4', { company }),
    t('feature5'),
  ];

  return (
    <WazzupModalTemplate
      opened={firstInfoModalOpened}
      onApprove={onApprove}
      hide={handleCloseFirstInfoModal}
    >
      <IntegrationInfoTitle>{t('title', { company })}</IntegrationInfoTitle>

      <IntegrationInfoFeatureList features={features} />

      <IntegrationInfoText>{t('annotation', { company })}</IntegrationInfoText>

      <IntegrationInfoLink
        target="_blank"
        label={t('learn_more')}
        to={
          envUtil.appRUSegment
            ? 'https://wazzup24.com/?utm_p=v3TOxW'
            : 'https://wazzup24.com/?utm_p=joq9zF'
        }
      />
    </WazzupModalTemplate>
  );
};

export { WazzupFirstInfoModal };
