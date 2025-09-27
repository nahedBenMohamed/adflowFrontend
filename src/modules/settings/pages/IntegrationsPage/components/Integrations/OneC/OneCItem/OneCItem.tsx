import { useQueryParamModalControl } from '@/shared';
import { ONE_C_INFO_MODAL_QUERY_PARAM, OneCLogo } from '../../../../../../shared';
import { IntegrationItem } from '../../../IntegrationItem/IntegrationItem';
import { OneCManualModal } from '../modals/OneCManualModal/OneCManualModal';

const OneCItem = () => {
  const modalControl = useQueryParamModalControl(ONE_C_INFO_MODAL_QUERY_PARAM);

  return (
    <>
      <IntegrationItem
        Icon={<OneCLogo />}
        description="Интеграция Mywork с 1С: Управление торговлей"
        onInstall={modalControl.open}
      />

      {modalControl.opened && (
        <OneCManualModal
          opened={modalControl.opened}
          hide={modalControl.close}
          onApprove={modalControl.close}
        />
      )}
    </>
  );
};

export { OneCItem };
