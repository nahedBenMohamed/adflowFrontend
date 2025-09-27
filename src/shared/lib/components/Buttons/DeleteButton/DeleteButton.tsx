import { memo, type ButtonHTMLAttributes } from 'react';
import styled, { css, type CSSProperties } from 'styled-components';
import { TrashbinMediumIcon, TrashbinSmallIcon } from '../../../../assets';
import { MiniLoader } from '../../../components';

interface RootProps {
  $fontWeight: CSSProperties['fontWeight'];
  $hidden?: boolean;
}

const Root = styled.button<RootProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 6px;

  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-red-default);
  font-weight: ${p => p.$fontWeight ?? 500};
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-red-hover);

    svg path {
      fill: var(--button-text-red-hover);
    }
  }

  &:active {
    color: var(--button-text-red-active);

    svg path {
      fill: var(--button-text-red-active);
    }
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.5;
  }

  ${p =>
    p.$hidden &&
    css`
      pointer-events: none;
      display: none;
    `}
`;

interface IconWrapperProps {
  $defaultRed: boolean;
  $size: DeleteButtonSize;
}

const IconWrapper = styled.div<IconWrapperProps>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;

    path {
      fill: ${p =>
        p.$defaultRed
          ? 'var(--button-text-red-default)'
          : 'var(--button-text-graphite-primary-text)'};
      transition: var(--transition-200);
    }
  }

  ${p =>
    p.$size === 'small' &&
    css`
      width: 16px;
      height: 16px;

      svg {
        width: 16px;
        height: 16px;
      }
    `}
`;

type DeleteButtonSize = 'small' | 'medium';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement & HTMLDivElement> {
  text?: string;
  asDiv?: boolean;
  hidden?: boolean;
  deleting?: boolean;
  size?: DeleteButtonSize;
  fontWeight?: CSSProperties['fontWeight'];
}

const DeleteButton = memo((props: Props) => {
  const { deleting, text, asDiv, hidden, size = 'medium', fontWeight, disabled, ...rest } = props;

  const DeleteIcon = size === 'small' ? <TrashbinSmallIcon /> : <TrashbinMediumIcon />;

  const hasText = Boolean(text);

  return (
    <Root
      as={asDiv ? 'div' : 'button'}
      type="button"
      {...rest}
      $fontWeight={fontWeight}
      $hidden={hidden}
      disabled={deleting || disabled}
      className="workspace__DeleteButton--Root"
    >
      <IconWrapper $size={size} $defaultRed={hasText}>
        {deleting ? (
          <MiniLoader
            size="small"
            color={
              hasText
                ? 'var(--button-text-red-default)'
                : 'var(--button-text-graphite-primary-text)'
            }
          />
        ) : (
          DeleteIcon
        )}
      </IconWrapper>

      {text}
    </Root>
  );
});

DeleteButton.displayName = 'DeleteButton';
export { DeleteButton };
