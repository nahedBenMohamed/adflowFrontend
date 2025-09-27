import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { WhatsAppSmallIcon } from '../../../../../../../shared';
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

const TwilioWhatsAppModalTemplate = (props: Props) => {
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
    keyPrefix: 'settings_page.integrations_page.ui.whatsapp.whatsapp_modal_template',
  });

  return (
    <IntegrationInfoModalTemplate
      isOpened={opened}
      loading={loading}
      headerTitle={t('title')}
      cancelTitle={cancelTitle}
      approveTitle={approveTitle}
      Icon={<WhatsAppSmallIcon />}
      approveDisabled={loading || approveDisabled}
      onClose={hide}
      onApprove={onApprove}
      onCancel={onCancel}
    >
      {children}
    </IntegrationInfoModalTemplate>
  );
};

export { TwilioWhatsAppModalTemplate };
