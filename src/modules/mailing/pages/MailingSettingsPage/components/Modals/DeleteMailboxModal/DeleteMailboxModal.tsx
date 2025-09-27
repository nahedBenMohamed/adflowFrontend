import { BooleanModel, MyCheckboxWithBooleanModel, WarningModal } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Caption } from '../../Caption/Caption';

const CheckboxWrapper = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  padding-top: 16px;

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  isOpened: boolean;
  onClose: () => void;
  onApprove: (save: boolean) => Promise<void>;
}

const DeleteMailboxModal = observer((props: Props) => {
  const { isOpened, onClose, onApprove } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_settings_page.modals.delete_mailbox_modal',
  });

  const saveCorrespondence = useLocalObservable<BooleanModel>(() => BooleanModel.create(true));

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await onApprove(saveCorrespondence.value);
    } catch (e) {
      throw new Error(`Error while deleting mailbox: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WarningModal
      isDanger
      width="460px"
      title={t('title')}
      isOpened={isOpened}
      height="fit-content"
      maxHeight="fit-content"
      approveLoading={isLoading}
      approveTitle={t('delete')}
      annotation={t('save_correspondence_annotation')}
      onClose={onClose}
      onApprove={handleDelete}
    >
      <CheckboxWrapper>
        <MyCheckboxWithBooleanModel model={saveCorrespondence} />
        <Caption>{t('save_correspondence')}</Caption>
      </CheckboxWrapper>
    </WarningModal>
  );
});

DeleteMailboxModal.displayName = 'DeleteMailboxModal';
export { DeleteMailboxModal };
