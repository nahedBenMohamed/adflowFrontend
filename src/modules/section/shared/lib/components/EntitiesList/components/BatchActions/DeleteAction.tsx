import { WarningModal } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { DeleteIcon } from '../../../../../assets';
import { BatchAction } from './components';

interface Props {
  deleting: boolean;
  handleBatchDelete: () => Promise<void>;
}

const DeleteAction = (props: Props) => {
  const { deleting, handleBatchDelete } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.section_table.batch_actions',
  });

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const handleApprove = async (): Promise<void> => {
    await handleBatchDelete();

    hide();
  };

  return (
    <>
      <BatchAction danger Icon={<DeleteIcon />} text={t('delete')} onClick={show} />

      {opened && (
        <WarningModal
          isOpened={opened}
          approveLoading={deleting}
          title={t('delete_warning_title')}
          annotation={t('delete_warning_annotation')}
          onClose={hide}
          onApprove={handleApprove}
        />
      )}
    </>
  );
};

export { DeleteAction };
