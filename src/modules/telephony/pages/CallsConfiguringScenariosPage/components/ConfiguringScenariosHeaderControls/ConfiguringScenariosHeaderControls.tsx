import { PrimaryButton } from '@/shared';
import { Transition } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { VoximplantScenariosStore } from '../../../../store';

const ControlsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

interface Props {
  voximplantScenariosStore: VoximplantScenariosStore;
}

const ConfiguringScenariosHeaderControls = observer((props: Props) => {
  const {
    voximplantScenariosStore: { isLoaded, isSaving, clearChanges, saveChanges, isJsonStateChanged },
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix:
      'telephony.pages.calls_configuring_scenarios_page.components.configuring_scenarios_header_controls',
  });

  const stateChanged = isJsonStateChanged();

  return (
    <Transition mounted={isLoaded && stateChanged} transition="pop">
      {transitionStyles => (
        <ControlsWrapper style={transitionStyles}>
          <PrimaryButton variant="outlined" onClick={() => clearChanges(t('failed_to_reach'))}>
            {t('cancel')}
          </PrimaryButton>

          <PrimaryButton loading={isSaving} disabled={isSaving} onClick={saveChanges}>
            {t('save_scenarios')}
          </PrimaryButton>
        </ControlsWrapper>
      )}
    </Transition>
  );
});

ConfiguringScenariosHeaderControls.displayName = 'ConfiguringScenariosHeaderControls';
export { ConfiguringScenariosHeaderControls };
