import { DialogModalPrimary, ModalAnnotation } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  padding: 24px 32px;
`;

interface Props {
  isOpened: boolean;
  text: string;
  onClose: () => void;
}

const PaymentResultModal = observer((props: Props) => {
  const { isOpened, text, onClose } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'buttons',
  });

  return (
    <DialogModalPrimary
      height="auto"
      hideCancel={true}
      isOpened={isOpened}
      approveTitle={t('ok')}
      onApprove={onClose}
      onClose={onClose}
    >
      <Root>
        <ModalAnnotation>{text}</ModalAnnotation>
      </Root>
    </DialogModalPrimary>
  );
});

PaymentResultModal.displayName = 'PaymentResultModal';
export { PaymentResultModal };
