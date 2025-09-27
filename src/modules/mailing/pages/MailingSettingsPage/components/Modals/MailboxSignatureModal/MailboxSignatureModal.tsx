import { DialogModalSecondary, type Nullable, type Option } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { CreateMailboxSignatureDto, UpdateMailboxSignatureDto } from '../../../../../api';
import type { Mailbox } from '../../../../../shared';
import { MailboxSignatureSettingsStore } from '../../../../../store/';
import { MailboxSignatureEditor } from './MailboxSignatureEditor/MailboxSignatureEditor';
import { MailboxSignatureSidebar } from './MailboxSignatureModal/MailboxSignatureSidebar';

const Root = styled.div`
  display: flex;
  flex: 1;
  gap: 8px;

  padding: 16px 32px;
`;

interface Props {
  isOpened: boolean;
  mailboxes: Mailbox[];
  onClose: () => void;
}

const MailboxSignatureModal = observer((props: Props) => {
  const { isOpened, mailboxes, onClose } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_settings_page.modals.mailbox_signature_modal',
  });

  const mailboxSignatureSettingsStore = useMemo(() => new MailboxSignatureSettingsStore(), []);

  const {
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    signatures,
    loadSignatures,
    addSignature,
    updateSignature,
    deleteSignature,
  } = mailboxSignatureSettingsStore;

  const [isAddMode, { close: hideAddMode, open: showAddMode }] = useDisclosure(false);
  const [activeSignatureId, setActiveSignatureId] = useState<Nullable<number>>(null);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      const signatures = await loadSignatures();

      const firstSignature = signatures[0];

      if (firstSignature) {
        setActiveSignatureId(firstSignature.id);
      }
    };

    loadData();
  }, [loadSignatures]);

  const mailboxesOptions = mailboxes.map<Option<number>>(m => ({
    value: m.id,
    label: m.email,
  }));

  const handleAddButtonClick = () => {
    if (!isAddMode) {
      showAddMode();
      setActiveSignatureId(null);

      return;
    }

    hideAddMode();
    setActiveSignatureId(signatures[0]?.id ?? null);
  };

  const handleSelectSignature = (id: number) => {
    setActiveSignatureId(id);
    hideAddMode();
  };

  const handleUpdateSignature = (dto: UpdateMailboxSignatureDto) => {
    if (!activeSignatureId) return;

    updateSignature({ id: activeSignatureId, dto });
  };

  const handleAddSignature = async (dto: CreateMailboxSignatureDto): Promise<void> => {
    const addedSignature = await addSignature(dto);

    setActiveSignatureId(addedSignature.id);
    hideAddMode();
  };

  const handleDeleteSignature = async (): Promise<void> => {
    if (!activeSignatureId) return;

    await deleteSignature(activeSignatureId);

    const lastSignature = signatures[0];

    if (lastSignature) {
      setActiveSignatureId(lastSignature.id);

      return;
    }

    showAddMode();
  };

  return (
    <DialogModalSecondary
      width="100%"
      hideControls
      maxWidth="912px"
      maxHeight="604px"
      Header={t('title')}
      isOpened={isOpened}
      onClose={onClose}
    >
      <Root>
        <MailboxSignatureSidebar
          loading={isLoading}
          isAddMode={isAddMode}
          signatures={signatures}
          activeSignatureId={activeSignatureId}
          handleAddButtonClick={handleAddButtonClick}
          handleSelectSignature={handleSelectSignature}
        />

        <MailboxSignatureEditor
          key={activeSignatureId ?? 'adding'}
          loading={isLoading}
          deleting={isDeleting}
          adding={isAdding || isUpdating}
          mailboxesOptions={mailboxesOptions}
          activeSignature={signatures.find(s => s.id === activeSignatureId)}
          updateSignature={handleUpdateSignature}
          addSignature={handleAddSignature}
          deleteSignature={handleDeleteSignature}
        />
      </Root>
    </DialogModalSecondary>
  );
});

MailboxSignatureModal.displayName = 'MailboxSignatureModal';
export { MailboxSignatureModal };
