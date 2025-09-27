import { ChatProviderStatus } from '@/modules/multichat';
import {
  DeleteButton,
  PencilButton,
  SpanWithEllipsis,
  TruncateMixin,
  WarningModal,
  useModalControl,
} from '@/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getStatusNameWithHint, type IntegrationSettingsAccount } from '../../../../shared';

const commonGrid = '100px 20px 20px';

const Root = styled.li<{ $hasPhone: boolean }>`
  display: grid;
  grid-template-columns: ${p =>
    p.$hasPhone ? `minmax(200px, 1fr) 120px ${commonGrid}` : `1fr ${commonGrid}`};
  gap: 16px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const Status = styled.div<{ $status: ChatProviderStatus }>`
  display: flex;
  align-items: center;
  gap: 6px;

  font-weight: 500;
  color: ${p => {
    switch (p.$status) {
      case ChatProviderStatus.ACTIVE:
        return 'var(--button-text-green-default)';

      case ChatProviderStatus.INACTIVE:
        return 'var(--button-text-red-default)';

      default:
        return 'var(--button-text-graphite-primary-text)';
    }
  }};
`;

interface Props {
  account: IntegrationSettingsAccount;
}

const IntegrationAccountItem = (props: Props) => {
  const { account } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.common.modals.integration_account_item',
  });

  const deleteModalControl = useModalControl(false);

  const [editOpening, setEditOpening] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { title, phone, status, onDelete, onEdit } = account;

  const handleOpenEdit = async (): Promise<void> => {
    try {
      setEditOpening(true);

      await onEdit();
    } finally {
      setEditOpening(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      setDeleting(true);

      await onDelete();
    } finally {
      setDeleting(false);
    }

    deleteModalControl.close();
  };

  return (
    <>
      <Root $hasPhone={Boolean(phone)}>
        <SpanWithEllipsis text={title} />

        {phone && <SpanWithEllipsis text={phone} />}

        <Status $status={status}>{getStatusNameWithHint({ status, t })}</Status>

        <PencilButton loading={editOpening} onClick={handleOpenEdit} />
        <DeleteButton deleting={deleting} onClick={deleteModalControl.open} />
      </Root>

      {deleteModalControl.opened && (
        <WarningModal
          height="fit-content"
          maxHeight="fit-content"
          approveLoading={deleting}
          isOpened={deleteModalControl.opened}
          title={t('delete_warning_title', { title })}
          annotation={t('delete_warning_annotation')}
          onApprove={handleDelete}
          onClose={deleteModalControl.close}
        />
      )}
    </>
  );
};

export { IntegrationAccountItem };
