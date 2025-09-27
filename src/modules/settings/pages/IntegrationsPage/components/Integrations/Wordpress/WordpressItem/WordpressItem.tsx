import { useQueryParamModalControl } from '@/shared';
import { useTranslation } from 'react-i18next';
import { WORDPRESS_INFO_MODAL_QUERY_PARAM, WordPressIcon } from '../../../../../../shared';
import { IntegrationItem } from '../../../IntegrationItem/IntegrationItem';
import { WordpressManualModal } from '../modals/WordpressManualModal/WordpressManualModal';

const WordpressItem = () => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.wordpress.wordpress_item',
  });

  const modalControl = useQueryParamModalControl(WORDPRESS_INFO_MODAL_QUERY_PARAM);

  return (
    <>
      <IntegrationItem
        Icon={<WordPressIcon />}
        description={t('description')}
        onInstall={modalControl.open}
      />

      {modalControl.opened && (
        <WordpressManualModal
          opened={modalControl.opened}
          hide={modalControl.close}
          onApprove={modalControl.close}
        />
      )}
    </>
  );
};

export { WordpressItem };
