import { envUtil, type Nullable } from '@/shared';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { GoogleCalendarSmallIcon } from '../../../../../../../shared';
import { IntegrationInfoModalTemplate } from '../../../../IntegrationInfoModalTemplate/IntegrationInfoModalTemplate';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface Props {
  opened: boolean;
  children: ReactNode;
  approveTitle?: string;
  loading?: boolean;
  approveDisabled?: boolean;
  maxHeight?: string;
  hideApprove?: boolean;
  errorMessage?: Nullable<string>;
  hide: () => void;
  onApprove: () => void;
}

const GoogleCalendarModalTemplate = (props: Props) => {
  const {
    opened,
    children,
    approveTitle,
    loading,
    approveDisabled,
    maxHeight = '600px',
    hideApprove,
    errorMessage,
    hide,
    onApprove,
  } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.google_calendar.google_calendar_modal_template',
  });

  return (
    <IntegrationInfoModalTemplate
      loading={loading}
      isOpened={opened}
      maxHeight={maxHeight}
      hideApprove={hideApprove}
      errorMessage={errorMessage}
      approveTitle={approveTitle}
      Icon={<GoogleCalendarSmallIcon />}
      approveDisabled={loading || approveDisabled}
      headerTitle={t('title', { company: envUtil.appName })}
      onClose={hide}
      onApprove={onApprove}
    >
      <Root>{children}</Root>
    </IntegrationInfoModalTemplate>
  );
};

export { GoogleCalendarModalTemplate };
