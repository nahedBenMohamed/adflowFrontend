import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ControlButton } from '../ControlButton/ControlButton';

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

interface Props {
  saveLoading?: boolean;
  saveDisabled?: boolean;
  cancelDisabled?: boolean;
  handleSave: () => void;
  handleCancel: () => void;
}

const SaveCancelButtons = observer((props: Props) => {
  const { saveLoading, saveDisabled, cancelDisabled, handleSave, handleCancel } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'buttons',
  });

  return (
    <ControlsWrapper>
      <ControlButton
        disabled={saveLoading || saveDisabled}
        loading={saveLoading}
        onClick={handleSave}
      >
        {t('save')}
      </ControlButton>

      <ControlButton variant="cancel" disabled={cancelDisabled} onClick={handleCancel}>
        {t('cancel')}
      </ControlButton>
    </ControlsWrapper>
  );
});

SaveCancelButtons.displayName = 'SaveCancelButtons';
export { SaveCancelButtons };
