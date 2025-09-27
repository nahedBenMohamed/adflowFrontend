import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  DialogModalPrimary,
  type DialogModalPrimaryProps,
} from '../Dialog/DialogModalPrimary/DialogModalPrimary';
import {
  ModalAnnotation,
  ModalContentTitle,
  ModalTrashBinIcon,
  ModalWarningIcon,
} from '../components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  padding: 8px 24px 32px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

type IconType = 'trashbin' | 'warning';

type OmittedDialogModalPrimaryProps = Omit<DialogModalPrimaryProps, 'children'>;

interface WarningModalProps extends OmittedDialogModalPrimaryProps {
  title: string;
  annotation: string | ReactNode;
  children?: ReactNode;
  icon?: IconType;
}

const WarningModal = (props: WarningModalProps) => {
  const { t } = useTranslation();

  const {
    title,
    annotation,
    maxHeight = '340px',
    approveTitle = t('buttons.delete'),
    icon = 'trashbin',
    isDanger = true,
    children,
    ...rest
  } = props;

  return (
    <DialogModalPrimary
      {...rest}
      approveTitle={approveTitle}
      maxHeight={maxHeight}
      isDanger={isDanger}
    >
      <Root>
        {icon === 'trashbin' && <ModalTrashBinIcon />}
        {icon === 'warning' && <ModalWarningIcon />}

        <Content>
          <ModalContentTitle>{title}</ModalContentTitle>

          <ModalAnnotation>{annotation}</ModalAnnotation>

          {children}
        </Content>
      </Root>
    </DialogModalPrimary>
  );
};

export { WarningModal };
