import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpened: boolean;
  maxSizeMb: number;
  onClose: () => void;
}

const FileSizeWarningModal = (props: Props) => {
  const { isOpened, maxSizeMb, onClose } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'file_size_warning_modal',
  });

  return (
    <WarningModal
      hideApprove
      icon="warning"
      maxHeight="100%"
      title={t('title')}
      isOpened={isOpened}
      height="fit-content"
      cancelTitle={t('cancel')}
      annotation={t('annotation', { maxSizeMb })}
      onClose={onClose}
    />
  );
};

export { FileSizeWarningModal };
