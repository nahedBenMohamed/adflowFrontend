import { ControlButton } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  padding: 8px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

interface Props {
  onTransfer: () => void;
  onCancel: () => void;
}

const TransferConfirmationControls = (props: Props) => {
  const { onTransfer, onCancel } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal.active_call_control',
  });

  return (
    <Root>
      <ControlButton type="button" variant="cancel" onClick={onCancel}>
        {t('cancel')}
      </ControlButton>

      <ControlButton type="button" variant="save" onClick={onTransfer}>
        {t('transfer')}
      </ControlButton>
    </Root>
  );
};

export { TransferConfirmationControls };
