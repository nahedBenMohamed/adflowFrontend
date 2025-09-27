import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  userName: string;
  removing: boolean;
  hide: () => void;
  onApprove: () => void;
}

const RemoveCallsUserWarningModal = (props: Props) => {
  const { opened, userName, removing, hide, onApprove } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_users_page',
  });

  return (
    <WarningModal
      height="100%"
      isOpened={opened}
      maxHeight="fit-content"
      approveLoading={removing}
      approveDisabled={removing}
      approveTitle={t('remove')}
      annotation={t('remove_warning_annotation')}
      title={t('remove_warning_title', { userName })}
      onClose={hide}
      onApprove={onApprove}
    />
  );
};

export { RemoveCallsUserWarningModal };
