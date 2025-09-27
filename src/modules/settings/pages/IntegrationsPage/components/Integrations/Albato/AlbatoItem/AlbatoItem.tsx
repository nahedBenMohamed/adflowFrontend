import { useQueryParamModalControl } from '@/shared';
import { useTranslation } from 'react-i18next';
import { ALBATO_INFO_MODAL_QUERY_PARAM, AlbatoIcon } from '../../../../../../shared';
import { IntegrationItem } from '../../../IntegrationItem/IntegrationItem';
import { AlbatoManualModal } from '../modals/AlbatoManualModal/AlbatoManualModal';

const AlbatoItem = () => {
  const modalControl = useQueryParamModalControl(ALBATO_INFO_MODAL_QUERY_PARAM);

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.albato.albato_item',
  });

  return (
    <>
      <IntegrationItem
        Icon={<AlbatoIcon />}
        description={t('description')}
        onInstall={modalControl.open}
      />

      {modalControl.opened && (
        <AlbatoManualModal
          opened={modalControl.opened}
          hide={modalControl.close}
          onApprove={modalControl.close}
        />
      )}
    </>
  );
};

export { AlbatoItem };
