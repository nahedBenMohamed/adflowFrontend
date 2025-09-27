import { routes } from '@/app';
import { envUtil } from '@/shared';
import { useTranslation } from 'react-i18next';
import { TildaSmallIcon } from '../../../../../../../shared';
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

const TildaManualModal = (props: Props) => {
  const { opened, hide, onApprove } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.tilda.tilda_manual_modal',
  });

  return (
    <IntegrationInfoModalTemplate
      hideApprove
      isOpened={opened}
      Icon={<TildaSmallIcon />}
      cancelTitle={t('close')}
      headerTitle={t('title')}
      onClose={hide}
      onApprove={onApprove}
    >
      <IntegrationInfoTitle>{t('info_title', { company: envUtil.appName })}</IntegrationInfoTitle>

      <IntegrationInfoTitle>{t('step_1_title')}</IntegrationInfoTitle>
      <IntegrationInfoText>
        {t('step_1_description', { company: envUtil.appName })}
      </IntegrationInfoText>

      <IntegrationInfoLink
        label={t('form_builder_link')}
        to={routes.builderCreateHeadlessSiteForm()}
      />

      <IntegrationInfoTitle>{t('step_2_title')}</IntegrationInfoTitle>

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>{t('step_2_item_1')}</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{t('step_2_item_2')}</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{t('step_2_item_3')}</IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoTitle>{t('step_3_title')}</IntegrationInfoTitle>

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>{t('step_3_item_1')}</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{t('step_3_item_2')}</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{t('step_3_item_3')}</IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoLink
        label={t('tilda_manual_link')}
        to="https://help.tilda.cc/forms/webhook"
      />

      <IntegrationInfoText>{t('support')}</IntegrationInfoText>
    </IntegrationInfoModalTemplate>
  );
};

export { TildaManualModal };
