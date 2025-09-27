import { ControlButton } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type { CellContext } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import {
  CreateVoximplantNumberDto,
  useCreateVoximplantPhoneNumber,
  useDeleteVoximplantPhoneNumber,
} from '../../../../../../api';
import type { VoximplantNumberRow } from '../../../../../../shared';
import { DeleteVoximplantNumberWarningModal } from '../DeleteVoximplantNumberWarningModal/DeleteVoximplantNumberWarningModal';

interface Props {
  cellContext: CellContext<VoximplantNumberRow, unknown>;
}

const VoximplantNumbersBlockStateCell = (props: Props) => {
  const {
    cellContext: {
      row: {
        original: { id, isConnected, phoneNumber, externalId, isExistsInVoximplant },
      },
    },
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_account_page',
  });

  const [
    deleteVoximplantNumberWarningModalOpened,
    {
      open: showDeleteVoximplantNumberWarningModal,
      close: closeDeleteVoximplantNumberWarningModal,
    },
  ] = useDisclosure(false);

  const { mutate: createVoximplantPhoneNumber, isPending: isCreatingVoximplantPhoneNumber } =
    useCreateVoximplantPhoneNumber();
  const { mutate: deleteVoximplantPhoneNumber, isPending: isDeletingVoximplantPhoneNumber } =
    useDeleteVoximplantPhoneNumber();

  const handleCreateVoximplantPhoneNumber = async () => {
    createVoximplantPhoneNumber(
      new CreateVoximplantNumberDto({
        externalId,
        phoneNumber,
      })
    );
  };

  const handleDeleteVoximplantPhoneNumber = async () => {
    if (!id)
      throw new Error(
        `Failed to delete Voximplant phone number, it was not connected in the first place, id ${id}`
      );

    deleteVoximplantPhoneNumber(id);
  };

  const handleApproveDeleteVoximplantPhoneNumber = async () => {
    handleDeleteVoximplantPhoneNumber();
    closeDeleteVoximplantNumberWarningModal();
  };

  if (isExistsInVoximplant) {
    return isConnected ? (
      <ControlButton
        variant="outlined"
        loading={isDeletingVoximplantPhoneNumber}
        disabled={isDeletingVoximplantPhoneNumber}
        onClick={handleDeleteVoximplantPhoneNumber}
      >
        {t('disconnect_phone_number')}
      </ControlButton>
    ) : (
      <ControlButton
        variant="save"
        loading={isCreatingVoximplantPhoneNumber}
        disabled={isCreatingVoximplantPhoneNumber}
        onClick={handleCreateVoximplantPhoneNumber}
      >
        {t('connect_phone_number')}
      </ControlButton>
    );
  } else {
    return (
      <>
        <ControlButton
          variant="cancel"
          loading={isDeletingVoximplantPhoneNumber}
          disabled={isDeletingVoximplantPhoneNumber}
          onClick={showDeleteVoximplantNumberWarningModal}
        >
          {t('delete_phone_number')}
        </ControlButton>

        {deleteVoximplantNumberWarningModalOpened && (
          <DeleteVoximplantNumberWarningModal
            phoneNumber={phoneNumber}
            isOpened={deleteVoximplantNumberWarningModalOpened}
            onApprove={handleDeleteVoximplantPhoneNumber}
            onClose={handleApproveDeleteVoximplantPhoneNumber}
          />
        )}
      </>
    );
  }
};

export { VoximplantNumbersBlockStateCell };
