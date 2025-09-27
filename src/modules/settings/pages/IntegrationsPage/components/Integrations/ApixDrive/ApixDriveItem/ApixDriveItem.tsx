import { useQueryParamModalControl } from '@/shared';
import { APIX_DRIVE_INFO_MODAL_QUERY_PARAM, ApixDriveIcon } from '../../../../../../shared';
import { IntegrationItem } from '../../../IntegrationItem/IntegrationItem';
import { ApixDriveManualModal } from '../modals/ApixDriveManualModal/ApixDriveManualModal';

const ApixDriveItem = () => {
  const modalControl = useQueryParamModalControl(APIX_DRIVE_INFO_MODAL_QUERY_PARAM);

  return (
    <>
      <IntegrationItem
        Icon={<ApixDriveIcon />}
        description="Automate your work with ApiX-Drive"
        onInstall={modalControl.open}
      />

      {modalControl.opened && (
        <ApixDriveManualModal
          opened={modalControl.opened}
          hide={modalControl.close}
          onApprove={modalControl.close}
        />
      )}
    </>
  );
};

export { ApixDriveItem };
