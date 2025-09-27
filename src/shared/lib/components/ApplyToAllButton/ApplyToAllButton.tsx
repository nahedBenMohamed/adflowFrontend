import { PrimaryButton, WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';
import { UploadIcon } from '../../../assets';

interface Props {
  isApproveLoading: boolean;
  isApplyWarningOpened: boolean;
  onClick: () => void;
  onClose: () => void;
  onApprove: () => void;
}

const ApplyToAllButton = (props: Props) => {
  const { isApproveLoading, isApplyWarningOpened, onClick, onClose, onApprove } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'apply_to_all_button',
  });

  return (
    <>
      <PrimaryButton
        variant="outlined"
        iconProps={{
          Icon: <UploadIcon />,
          path: {
            pathFill: 'var(--button-text-graphite-secondary-text)',
            pathFillHover: 'var(--button-text-graphite-primary-text)',
          },
        }}
        onClick={onClick}
      >
        {t('apply_to_all')}
      </PrimaryButton>

      {isApplyWarningOpened && (
        <WarningModal
          icon="warning"
          isDanger={false}
          maxHeight="540px"
          height="fit-content"
          approveTitle={t('apply')}
          isOpened={isApplyWarningOpened}
          title={t('apply_warning_title')}
          approveLoading={isApproveLoading}
          annotation={t('apply_warning_annotation')}
          onClose={onClose}
          onApprove={onApprove}
        />
      )}
    </>
  );
};

export { ApplyToAllButton };
