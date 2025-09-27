import { routes } from '@/app';
import { envUtil } from '@/shared';
import { useTranslation } from 'react-i18next';
import { AlbatoSmallIcon } from '../../../../../../../shared';
import { IntegrationInfoLink } from '../../../../IntegrationInfoLink/IntegrationInfoLink';
import { IntegrationInfoModalTemplate } from '../../../../IntegrationInfoModalTemplate/IntegrationInfoModalTemplate';
import { IntegrationInfoText } from '../../../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../../../../IntegrationInfoTitle/IntegrationInfoTitle';
import {
  IntegrationOrderedList,
  IntegrationOrderedListItem,
} from '../../../../IntegrationOrderedList/IntegrationOrderedList.styles';

interface Props {
  opened: boolean;
  hide: () => void;
  onApprove: () => void;
}

const AlbatoManualModal = (props: Props) => {
  const { opened, hide, onApprove } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.albato.albato_manual_modal',
  });

  return (
    <IntegrationInfoModalTemplate
      hideApprove
      isOpened={opened}
      Icon={<AlbatoSmallIcon />}
      cancelTitle={t('close')}
      headerTitle={t('header_title', { company: envUtil.appName })}
      onClose={hide}
      onApprove={onApprove}
    >
      <IntegrationInfoTitle>
        {t('integration_title', { company: envUtil.appName })}
      </IntegrationInfoTitle>

      <IntegrationInfoTitle>{t('step_1_title')}</IntegrationInfoTitle>

      <IntegrationInfoLink
        label={t('albato_website')}
        to="https://albato.ru/app-mywork"
        target="_blank"
        rel="noopener noreferrer"
      />

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>{t('step_1_part_1')}</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{t('step_1_part_2')}</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{t('step_1_part_3')}</IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoTitle>{t('step_2_title')}</IntegrationInfoTitle>

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>{t('step_2_part_1')}</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{t('step_2_part_2')}</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{t('step_2_part_3')}</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{t('step_2_part_4')}</IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoLink
        label={t('api_access_link')}
        to={routes.settingsApiKeys()}
        target="_blank"
      />

      <IntegrationInfoTitle>{t('step_3_title')}</IntegrationInfoTitle>

      <IntegrationInfoText>{t('step_3')}</IntegrationInfoText>

      <IntegrationInfoTitle>{t('step_4_title')}</IntegrationInfoTitle>

      <IntegrationInfoText>{t('step_4')}</IntegrationInfoText>
    </IntegrationInfoModalTemplate>
  );
};

export { AlbatoManualModal };
