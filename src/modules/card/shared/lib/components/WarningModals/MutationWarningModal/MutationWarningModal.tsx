import { WarningModal } from '@/shared';
import { useTranslation } from 'react-i18next';
import type { MutationWarningCode } from '../../../models';

interface Props {
  opened: boolean;
  code: MutationWarningCode;
  onClose: () => void;
}

const MutationWarningModal = (props: Props) => {
  const { opened, code, onClose } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.mutation_warning',
  });

  return (
    <WarningModal
      icon="warning"
      isDanger={false}
      isOpened={opened}
      title={t(`title.${code}`)}
      annotation={t('annotation')}
      approveTitle={t('continue')}
      onClose={onClose}
      onApprove={onClose}
    />
  );
};

export { MutationWarningModal };
