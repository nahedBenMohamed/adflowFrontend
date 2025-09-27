import { useWindowEvent } from '@mantine/hooks';
import {
  useCallback,
  useMemo,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { ModalCloseCrossPrimaryIcon } from '../../../../../assets';
import { DropdownScrollbarMixin } from '../../../../mixins';
import { MiniLoader } from '../../../Loaders/MiniLoader/MiniLoader';
import { OverlayingModal } from '../../OverlayingModal/OverlayingModal';

interface RootProps {
  $maxHeight: string;
  $width: string;
  $height: string;
  $header?: boolean;
}

const Root = styled.div<RootProps>`
  position: relative;

  height: ${p => p.$height};
  max-height: ${p => p.$maxHeight};
  width: ${p => p.$width};

  display: flex;
  flex-direction: column;

  border-radius: var(--border-radius-modal);
  background: var(--primary-statuses-white-0);
  padding-top: ${p => (p.$header ? 0 : '40px')};
  box-shadow:
    0px 101px 40px rgba(146, 151, 176, 0.01),
    0px 57px 34px rgba(146, 151, 176, 0.05),
    0px 25px 25px rgba(146, 151, 176, 0.09),
    0px 6px 14px rgba(146, 151, 176, 0.1),
    0px 0px 0px rgba(146, 151, 176, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  padding: 14px 32px;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  ${DropdownScrollbarMixin}

  padding: 0;
`;

const Controls = styled.div<{ $justifyContent: string }>`
  padding: 16px 24px;

  display: flex;
  justify-content: ${p => p.$justifyContent || 'center'};
  gap: 16px;

  background-color: var(--graphite-graphite-20);
  border-top: 1px solid var(--graphite-graphite-40);
  border-radius: 0px 0px 8px 8px;
`;

const CloseCrossIconWrapper = styled.button<{ $header?: boolean }>`
  ${p =>
    !p.$header &&
    css`
      position: absolute;
      top: 14px;
      right: 16px;
    `}

  line-height: 100%;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-default);
    }
  }
`;

interface ApproveButtonProps {
  $danger: boolean;
  $loading: boolean;
}

const ApproveButton = styled.button<ApproveButtonProps>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: var(--primary-statuses-white-0);

  border-radius: 40px;
  padding: ${p => (p.$loading ? '11px 33px 12px 25px' : '11px 41px 12px 41px')};
  background-color: ${p =>
    p.$danger ? 'var(--button-text-red-default)' : 'var(--button-text-green-default)'};
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.5;
  }

  &:active {
    background-color: ${p =>
      p.$danger ? 'var(--button-text-red-active)' : 'var(--button-text-green-active)'};
  }
`;

const CancelButton = styled.button<{ $loading: boolean }>`
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: var(--button-text-graphite-priory-text);

  border-radius: 40px;
  background: transparent;
  padding: 11px 41px 12px 41px;
  border: 1px solid var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }

  &:disabled {
    color: var(--button-text-graphite-secondary-text);

    border: 1px solid var(--button-text-graphite-secondary-text);
  }

  ${p =>
    p.$loading &&
    css`
      opacity: 0.5;

      &:hover {
        cursor: progress;
      }
    `}
`;

interface ApproveLinkProps {
  to: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
}

export interface DialogModalPrimaryProps {
  children: ReactNode;
  isOpened: boolean;
  cancelOnClose?: boolean;
  cancelTitle?: string;
  approveTitle?: string;
  isDanger?: boolean;
  width?: string;
  height?: string;
  maxHeight?: string;
  approveDisabled?: boolean;
  cancelDisabled?: boolean;
  justifyControlsContent?: 'center' | 'flex-end' | 'flex-start';
  approveLoading?: boolean;
  cancelLoading?: boolean;
  hideCancel?: boolean;
  hideApprove?: boolean;
  hideControls?: boolean;
  Header?: ReactNode;
  CustomControls?: ReactNode;
  approveLinkProps?: ApproveLinkProps;
  zIndex?: CSSProperties['zIndex'];
  hideCloseCross?: boolean;
  onClose: () => void;
  onApprove?: (...args: any[]) => void;
  onCancel?: (...args: any[]) => void;
}

const DialogModalPrimary = (props: DialogModalPrimaryProps) => {
  const { t } = useTranslation();

  const {
    children,
    isOpened,
    cancelOnClose = true,
    isDanger = false,
    cancelTitle = t('buttons.cancel'),
    approveTitle = t('buttons.save'),
    height = '100%',
    width = '400px',
    maxHeight = '650px',
    approveDisabled = false,
    cancelDisabled = false,
    justifyControlsContent = 'center',
    approveLoading = false,
    cancelLoading = false,
    hideCancel = false,
    hideApprove = false,
    hideControls = false,
    Header: header = null,
    CustomControls: customControls = null,
    approveLinkProps,
    zIndex,
    hideCloseCross,
    onClose,
    onApprove,
    onCancel,
  } = props;

  const handleClose = useCallback(() => {
    if (cancelOnClose) onCancel?.();

    onClose();
  }, [cancelOnClose, onClose, onCancel]);

  const handleApprove = useCallback(() => {
    if (approveLinkProps) window.open(approveLinkProps.to, approveLinkProps.target ?? '_self');

    if (onApprove) {
      onApprove();
    } else {
      onClose();
    }
  }, [approveLinkProps, onClose, onApprove]);

  useWindowEvent('keydown', e => {
    if (e.key === 'Escape') handleClose();
  });

  const CloseCross = useMemo<ReactNode>(
    () =>
      hideCloseCross ? null : (
        <CloseCrossIconWrapper>
          <ModalCloseCrossPrimaryIcon onClick={handleClose} />
        </CloseCrossIconWrapper>
      ),
    [hideCloseCross, handleClose]
  );

  return (
    <OverlayingModal zIndex={zIndex} isOpened={isOpened} onClose={handleClose}>
      <Root $width={width} $maxHeight={maxHeight} $height={height} $header={Boolean(header)}>
        {header ? (
          <Header>
            {header}

            {CloseCross}
          </Header>
        ) : (
          CloseCross
        )}

        <Content>{children}</Content>

        {!hideControls &&
          (customControls ? (
            customControls
          ) : (
            <Controls $justifyContent={justifyControlsContent}>
              {!hideApprove && (
                <ApproveButton
                  $danger={isDanger}
                  $loading={approveLoading}
                  disabled={approveDisabled || approveLoading}
                  onClick={handleApprove}
                >
                  {approveLoading && <MiniLoader />}

                  {approveTitle}
                </ApproveButton>
              )}

              {!hideCancel && (
                <CancelButton
                  $loading={cancelLoading}
                  disabled={cancelDisabled}
                  onClick={onCancel ? onCancel : onClose}
                >
                  {cancelTitle}
                </CancelButton>
              )}
            </Controls>
          ))}
      </Root>
    </OverlayingModal>
  );
};

export { DialogModalPrimary };
