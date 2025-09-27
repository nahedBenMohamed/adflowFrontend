import { appStore, generalSettingsStore, routes } from '@/app';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteDemoIcon } from '../../../../../assets';
import { WarningModal } from '../../../Modals/WarningModal/WarningModal';
import { SubheaderButton } from '../../../Subheader/SubheaderButton';

const DeleteDemoButton = observer(() => {
  const { t } = useTranslation('common', {
    keyPrefix: 'delete_demo',
  });

  const [modalOpened, { close: hideModal, open: showModal }] = useDisclosure(false);

  const { isDemoDeleting, deleteDemoData } = generalSettingsStore;

  const onApprove = useCallback(async (): Promise<void> => {
    await deleteDemoData();

    hideModal();

    window.location.reload();
    window.location.href = routes.root;
  }, [deleteDemoData, hideModal]);

  return appStore.isLoaded ? (
    <>
      <SubheaderButton
        type="button"
        text={t('button_text')}
        Icon={<DeleteDemoIcon />}
        onClick={showModal}
      />

      <WarningModal
        maxHeight="376px"
        isOpened={modalOpened}
        title={t('modal_title')}
        approveLoading={isDemoDeleting}
        approveDisabled={isDemoDeleting}
        annotation={t('modal_annotation')}
        onClose={hideModal}
        onApprove={onApprove}
      />
    </>
  ) : null;
});

DeleteDemoButton.displayName = 'DeleteDemoButton';
export { DeleteDemoButton };
