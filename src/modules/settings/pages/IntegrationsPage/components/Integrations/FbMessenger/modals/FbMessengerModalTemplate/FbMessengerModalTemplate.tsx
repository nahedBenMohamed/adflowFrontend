import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FbMessengerSmallIcon } from '../../../../../../../shared';
import { IntegrationInfoModalTemplate } from '../../../../IntegrationInfoModalTemplate/IntegrationInfoModalTemplate';

interface Props {
  opened: boolean;
  children: ReactNode;
  approveTitle?: string;
  loading?: boolean;
  approveDisabled?: boolean;
  hide: () => void;
  onApprove: () => void;
}

const FbMessengerModalTemplate = (props: Props) => {
  const { opened, children, approveTitle, loading, approveDisabled, hide, onApprove } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.fb_messenger.fb_messenger_modal_template',
  });

  return (
    <IntegrationInfoModalTemplate
      loading={loading}
      isOpened={opened}
      maxHeight="600px"
      headerTitle={t('title')}
      approveTitle={approveTitle}
      Icon={<FbMessengerSmallIcon />}
      approveDisabled={loading || approveDisabled}
      onClose={hide}
      onApprove={onApprove}
    >
      {children}
    </IntegrationInfoModalTemplate>
  );
};

export { FbMessengerModalTemplate };
