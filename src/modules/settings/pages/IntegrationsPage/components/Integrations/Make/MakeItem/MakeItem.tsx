import { useQueryParamModalControl } from '@/shared';
import { MAKE_INFO_MODAL_QUERY_PARAM, MakeIcon } from '../../../../../../shared';
import { IntegrationItem } from '../../../IntegrationItem/IntegrationItem';
import { MakeManualModal } from '../modals/MakeManualModal/MakeManualModal';

const MakeItem = () => {
  const modalControl = useQueryParamModalControl(MAKE_INFO_MODAL_QUERY_PARAM);

  return (
    <>
      <IntegrationItem
        Icon={<MakeIcon />}
        description="Automate your workflows in seconds with Make"
        onInstall={modalControl.open}
      />

      {modalControl.opened && (
        <MakeManualModal
          opened={modalControl.opened}
          hide={modalControl.close}
          onApprove={modalControl.close}
        />
      )}
    </>
  );
};

export { MakeItem };
