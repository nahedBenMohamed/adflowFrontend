import { useQueryParamModalControl } from '@/shared';
import { useTranslation } from 'react-i18next';
import { TILDA_INFO_MODAL_QUERY_PARAM, TildaIcon } from '../../../../../../shared';
import { IntegrationItem } from '../../../IntegrationItem/IntegrationItem';
import { TildaManualModal } from '../modals/TildaManualModal/TildaManualModal';

const TildaItem = () => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.tilda.tilda_item',
  });

  const modalControl = useQueryParamModalControl(TILDA_INFO_MODAL_QUERY_PARAM);

  return (
    <>
      <IntegrationItem
        Icon={<TildaIcon />}
        description={t('description')}
        onInstall={modalControl.open}
      />

      {modalControl.opened && (
        <TildaManualModal
          opened={modalControl.opened}
          hide={modalControl.close}
          onApprove={modalControl.close}
        />
      )}
    </>
  );
};

export { TildaItem };
