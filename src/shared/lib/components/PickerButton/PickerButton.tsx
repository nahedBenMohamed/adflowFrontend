import type { CSSProperties, ReactNode, Ref } from 'react';
import styled, { css } from 'styled-components';
import { TruncateMixin } from '../../mixins';
import { RoundedDashedFrame, type ButtonSize } from './components';

export type PickerButtonVariant = 'primary' | 'secondary' | 'secondary-smaller';

interface PickerValueProps {
  $active: boolean;
  $fontWeight: FontWeight;
  $selectedValue?: boolean;
  $variant?: PickerButtonVariant;
}

const PickerValue = styled.div<PickerValueProps>`
  font-size: 14px;
  line-height: 20px;
  font-weight: ${p => p.$fontWeight};
  transition: var(--transition-200);

  input::placeholder {
    color: var(--button-text-graphite-secondary-text);
  }

  // overriding antd styles
  input {
    font-weight: 500 !important;
    transition: color var(--transition-200) !important;

    &::placeholder {
      transition: color var(--transition-200);
    }
  }

  ${p =>
    (p.$active || p.$selectedValue) &&
    css`
      color: var(--button-text-graphite-primary-text);

      // overriding antd styles
      input {
        color: var(--button-text-graphite-primary-text) !important;

        &::placeholder {
          color: var(--button-text-graphite-primary-text);
        }
      }
    `}

  ${TruncateMixin}
`;

interface RootProps {
  $active: boolean;
  $disabled: boolean;
  $selectedValue?: boolean;
  $hiddenlyDisabled?: boolean;
  $variant?: PickerButtonVariant;
  $width?: CSSProperties['width'];
}

const Root = styled.div<RootProps>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-weight: 500;
  color: var(--button-text-graphite-secondary-text);

  svg {
    rect,
    circle,
    ellipse,
    path {
      transition: fill var(--transition-200);
    }

    rect {
      transition: stroke var(--transition-200);
    }
  }

  &:hover {
    cursor: pointer;
  }

  ${p => p.$width && `width: ${p.$width}`};
  ${p => p.$hiddenlyDisabled && `pointer-events: none`};

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;
      opacity: 0.35;

      * {
        pointer-events: none;
      }
    `}

  ${p =>
    p.$variant === 'primary' &&
    !p.$active &&
    !p.$selectedValue &&
    css`
      &:hover {
        // rounded dashed frame
        .rounded_icon {
          svg rect {
            stroke: var(--primary-statuses-green-520);
          }
        }

        svg {
          rect:not(:first-child),
          circle,
          ellipse,
          path {
            fill:  var(--primary-statuses-green-520);
          }
        }

        ${PickerValue} {
          color: var(--primary-statuses-green-520);

          // overriding antd styles
          input {
            transition: color var(--transition-200);
            color: var(--primary-statuses-green-520); !important;

            &::placeholder {
              color: var(--primary-statuses-green-520);
            }
          }
        }
      }
    `}

  ${p =>
    (p.$variant === 'secondary' || p.$variant === 'secondary-smaller') &&
    css`
      flex-shrink: 0;

      padding: ${p.$variant === 'secondary' ? '8px 12px 8px 8px' : '4px 8px'};
      border-radius: var(--border-radius-block);
      transition: var(--transition-200);

      ${p.$active && `box-shadow: inset 0 0 0 1px var(--primary-statuses-green-520)`};

      ${PickerValue} {
        color: ${p.$selectedValue || p.$active
          ? 'var(--graphite-graphite-680)'
          : 'var(--button-text-graphite-secondary-text)'};
      }

      svg path {
        transition: var(--transition-200);
        ${p.$active && 'fill: var(--graphite-graphite-680)'}
      }

      &:hover {
        ${!p.$active &&
        css`
          background-color: #f3fded;

          svg path {
            fill: var(--button-text-green-active);
          }

          ${PickerValue} {
            color: var(--button-text-green-active);
          }
        `}
      }

      &:active {
        ${!p.$active &&
        css`
          background-color: #e6fbda;

          svg path {
            fill: var(--button-text-green-hover);
          }

          ${PickerValue} {
            color: var(--button-text-green-hover);
          }
        `}
      }
    `}
`;

type FontWeight = CSSProperties['fontWeight'];

interface Props {
  ref?: Ref<HTMLDivElement>;
  value: string | ReactNode;
  Icon: ReactNode;
  active?: boolean;
  selectedValue?: boolean;
  showValue?: boolean;
  disabled?: boolean;
  hiddenlyDisabled?: boolean;
  iconOutlined?: boolean;
  width?: CSSProperties['width'];
  fontWeight?: FontWeight;
  buttonSize?: ButtonSize;
  variant?: PickerButtonVariant;
  onClick?: () => void;
}

const PickerButton = (props: Props) => {
  const {
    ref,
    Icon,
    value,
    active = false,
    selectedValue,
    showValue = true,
    disabled = false,
    hiddenlyDisabled,
    iconOutlined = true,
    width,
    fontWeight = 'medium',
    buttonSize = 'medium',
    variant = 'primary',
    onClick,
  } = props;

  return (
    <Root
      ref={ref}
      $width={width}
      $active={active}
      $variant={variant}
      $disabled={disabled}
      $selectedValue={selectedValue}
      $hiddenlyDisabled={hiddenlyDisabled}
      className="workspace__PickerButton--Root"
      onClick={onClick}
    >
      <RoundedDashedFrame active={active} outlined={iconOutlined} size={buttonSize}>
        {Icon}
      </RoundedDashedFrame>

      {showValue &&
        (typeof value === 'string' ? (
          <PickerValue
            title={value}
            $active={active}
            $variant={variant}
            $fontWeight={fontWeight}
            $selectedValue={selectedValue ?? active}
            className="workspace__PickerButton--PickerValue"
          >
            {value}
          </PickerValue>
        ) : (
          <PickerValue
            $active={active}
            $variant={variant}
            $fontWeight={fontWeight}
            $selectedValue={selectedValue}
          >
            {value}
          </PickerValue>
        ))}
    </Root>
  );
};

export { PickerButton };
