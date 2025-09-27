import { envUtil } from '@/shared';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { WazzupSmallIcon } from '../../../../../../../shared';
import { IntegrationInfoModalTemplate } from '../../../../IntegrationInfoModalTemplate/IntegrationInfoModalTemplate';

interface Props {
  opened: boolean;
  children: ReactNode;
  approveTitle?: string;
  cancelTitle?: string;
  loading?: boolean;
  approveDisabled?: boolean;
  hide: () => void;
  onApprove: () => void;
  onCancel?: () => void;
}

const WazzupModalTemplate = (props: Props) => {
  const {
    opened,
    children,
    approveTitle,
    cancelTitle,
    loading,
    approveDisabled,
    hide,
    onApprove,
    onCancel,
  } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.wazzup.wazzup_modal_template',
  });

  return (
    <IntegrationInfoModalTemplate
      isOpened={opened}
      loading={loading}
      cancelTitle={cancelTitle}
      Icon={<WazzupSmallIcon />}
      approveTitle={approveTitle}
      approveDisabled={loading || approveDisabled}
      headerTitle={t('title', { company: envUtil.appName })}
      onClose={hide}
      onCancel={onCancel}
      onApprove={onApprove}
    >
      {children}
    </IntegrationInfoModalTemplate>
  );
};

export { WazzupModalTemplate };
