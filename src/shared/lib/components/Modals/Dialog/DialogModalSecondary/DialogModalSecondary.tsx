import { useWindowEvent } from '@mantine/hooks';
import { useCallback, type CSSProperties, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ModalCloseCrossSecondaryIcon, WarningIcon } from '../../../../../assets';
import { DropdownScrollbarMixin } from '../../../../mixins';
import type { Nullable } from '../../../../types';
import { PrimaryButton } from '../../../Buttons/PrimaryButton/PrimaryButton';
import { OverlayingModal } from '../../OverlayingModal/OverlayingModal';

interface RootProps {
  $width: CSSProperties['width'];
  $maxHeight: CSSProperties['maxHeight'];
  $height?: CSSProperties['height'];
  $maxWidth?: CSSProperties['maxWidth'];
}

const Root = styled.div<RootProps>`
  width: ${p => p.$width};
  max-width: ${p => p.$maxWidth};
  max-height: ${p => p.$maxHeight};
  height: ${p => p.$height ?? '100%'};

  display: flex;
  flex-direction: column;

  border-radius: var(--border-radius-modal);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 101px 40px rgba(146, 151, 176, 0.01),
    0px 57px 34px rgba(146, 151, 176, 0.05),
    0px 25px 25px rgba(146, 151, 176, 0.09),
    0px 6px 14px rgba(146, 151, 176, 0.1),
    0px 0px 0px rgba(146, 151, 176, 0.1);
`;

const HeaderWrapper = styled.div`
  position: relative;

  display: flex;
  align-items: center;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 14px 44px 14px 32px;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const CloseCrossIconWrapper = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;

  width: 20px;
  height: 20px;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-default);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }
`;

const Content = styled.div<{ $height?: CSSProperties['height'] }>`
  height: ${p => p.$height};

  display: flex;
  flex-direction: column;
  flex: 1;

  ${DropdownScrollbarMixin}

  padding: 0;
`;

const WarningIconWrapper = styled.div`
  width: 16px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ErrorMessageBlock = styled.div`
  display: flex;
  gap: 4px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-red-default);

  padding: 8px 24px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  padding: 12px 24px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

const LeftControlsWrapper = styled.div`
  margin-right: auto;
`;

export interface DialogModalSecondaryProps {
  Header: ReactNode;
  isOpened: boolean;
  children: ReactNode;
  zIndex?: number;
  loading?: boolean;
  cancelTitle?: string;
  hideCancel?: boolean;
  hideApprove?: boolean;
  approveTitle?: string;
  hideControls?: boolean;
  LeftControls?: ReactNode;
  approveDisabled?: boolean;
  CustomControls?: ReactNode;
  width?: CSSProperties['width'];
  errorMessage?: Nullable<string>;
  height?: CSSProperties['height'];
  maxWidth?: CSSProperties['maxWidth'];
  maxHeight?: CSSProperties['maxHeight'];
  contentHeight?: CSSProperties['height'];
  onClose: () => void;
  onApprove?: () => void;
  onCancel?: () => void;
}

const DialogModalSecondary = (props: DialogModalSecondaryProps) => {
  const { t } = useTranslation();

  const {
    Header,
    zIndex,
    height,
    children,
    isOpened,
    maxWidth,
    errorMessage,
    LeftControls,
    contentHeight,
    CustomControls,
    loading = false,
    width = '400px',
    hideCancel = false,
    hideApprove = false,
    maxHeight = '650px',
    hideControls = false,
    approveDisabled = false,
    approveTitle = t('buttons.save'),
    cancelTitle = t('buttons.cancel'),
    onClose,
    onApprove,
    onCancel,
  } = props;

  const handleApprove = useCallback(() => {
    if (onApprove) {
      onApprove();
    } else {
      onClose();
    }
  }, [onApprove, onClose]);

  useWindowEvent('keydown', e => {
    if (e.key === 'Escape') onClose();
  });

  return (
    <OverlayingModal zIndex={zIndex} isOpened={isOpened} onClose={onClose}>
      <Root $width={width} $height={height} $maxHeight={maxHeight} $maxWidth={maxWidth}>
        <HeaderWrapper>
          {Header}

          <CloseCrossIconWrapper onClick={onClose}>
            <ModalCloseCrossSecondaryIcon />
          </CloseCrossIconWrapper>
        </HeaderWrapper>

        <Content $height={contentHeight}>{children}</Content>

        {errorMessage && (
          <ErrorMessageBlock>
            <WarningIconWrapper>
              <WarningIcon />
            </WarningIconWrapper>

            {errorMessage}
          </ErrorMessageBlock>
        )}

        {!hideControls &&
          (CustomControls ? (
            CustomControls
          ) : (
            <Controls>
              {LeftControls && <LeftControlsWrapper>{LeftControls}</LeftControlsWrapper>}

              {!hideCancel && (
                <PrimaryButton variant="empty" onClick={onCancel ? onCancel : onClose}>
                  {cancelTitle}
                </PrimaryButton>
              )}

              {!hideApprove && (
                <PrimaryButton disabled={approveDisabled} loading={loading} onClick={handleApprove}>
                  {approveTitle}
                </PrimaryButton>
              )}
            </Controls>
          ))}
      </Root>
    </OverlayingModal>
  );
};

export { DialogModalSecondary };
