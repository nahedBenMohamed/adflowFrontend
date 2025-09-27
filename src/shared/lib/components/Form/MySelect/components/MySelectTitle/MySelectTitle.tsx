import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { TruncateMixin } from '../../../../../mixins';
import type { MySelectTitleRootVariant } from '../../../../../models';
import { ColorUtil } from '../../../../../utils';
import type { MenuShowHideProps } from '../../MySelect/MySelect';
import { CLEAR_BUTTON_CLASS, ClearButton } from '../ClearButton/ClearButton';
import { FilledArrowIcon } from '../FilledArrowIcon/FilledArrowIcon';

const IconWrapper = styled.div`
  position: absolute;
  left: 3px;
  top: 50%;

  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transform: translateY(-50%);
`;

interface TitleProps {
  $active: boolean;
  $disabled: boolean;
  $hiddenlyDisabled: boolean;
  $variant: MySelectTitleRootVariant;
  $bgColor?: string;
  $hasIcon?: boolean;
  $invalid?: boolean;
  $greenBg?: boolean;
  $selectedValue?: boolean;
  $showPlaceholder?: boolean;
  $gap?: CSSProperties['gap'];
  $width?: CSSProperties['width'];
  $margin?: CSSProperties['margin'];
  $minWidth: CSSProperties['minWidth'];
  $maxWidth?: CSSProperties['maxWidth'];
}

export const MySelectTitleRoot = styled.div<TitleProps>`
  height: 28px;

  width: ${p => p.$width ?? '100%'};

  display: flex;
  align-items: center;
  gap: ${p => p.$gap ?? (p.$variant === 'empty' ? 8 : 16)}px;

  font-size: ${p => (p.$variant === 'filled-small' ? '12px' : '14px')};
  font-weight: 400;
  line-height: 17px;
  color: var(--button-text-graphite-priory-text);

  padding: ${p => (p.$variant === 'outlined-tall' ? '8px 4px 8px 8px' : '4px 4px 4px 8px')};
  border: 1px solid transparent;
  background-color: #f8fafbd7;
  border-radius: var(--border-radius-element);
  margin: ${p => (p.$margin ? p.$margin : 0)};

  transition-property: background-color, color, box-shadow, border-color;
  transition-duration: var(--transition-duration);
  transition-timing-function: var(--transition-timing-function);

  .${CLEAR_BUTTON_CLASS} {
    opacity: 0;
    scale: 0;
  }

  &[data-gantt-table-hidden='true'] {
    opacity: 0;
    pointer-events: none;
  }

  &:hover {
    cursor: pointer;

    background-color: var(--primary-statuses-white-0);
    color: var(--button-text-graphite-priory-text);
    box-shadow:
      0 1px 2px #d0daeb,
      0 0 2px #eef4fe;

    .${CLEAR_BUTTON_CLASS} {
      opacity: 1;
      scale: 1;
    }
  }

  ${p =>
    p.$active &&
    css`
      color: var(--button-text-graphite-priory-text);

      background-color: var(--primary-statuses-white-0);
      box-shadow:
        0 1px 2px #d0daeb,
        0 0 2px #eef4fe;
    `};

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.8;
    `}

  ${p => p.$hiddenlyDisabled && `pointer-events: none`};

  ${p =>
    p.$variant === 'filled-small' &&
    css`
      width: fit-content;
      min-width: unset !important;
      height: 18px;

      padding: 1px 6px 2px 6px;
    `}

  ${p =>
    (p.$variant === 'empty' || p.$variant === 'empty-small') &&
    css`
      width: fit-content;
      max-width: ${p.$width || '100%'};

      gap: 2px;

      padding: 2px 4px;
      background-color: transparent;

      ${p.$variant === 'empty-small' &&
      css`
        height: 16px;

        gap: 0;

        padding: 2px;

        font-size: 10px;
        font-weight: 600;
        line-height: 10px;
        text-transform: uppercase;
      `}

      &:hover {
        box-shadow: none;

        background-color: var(--graphite-graphite-40);
      }

      ${p.$active &&
      css`
        box-shadow: none;

        background-color: var(--graphite-graphite-80);
      `};
    `};

  ${p =>
    (p.$variant === 'outlined' ||
      p.$variant === 'outlined-without-active-shadow' ||
      p.$variant === 'outlined-tall') &&
    css`
      box-shadow: none;
      background-color: transparent;

      height: ${p.$variant === 'outlined-tall' ? 36 : 28}px;

      border: 1px solid var(--graphite-graphite-120);

      &:hover {
        box-shadow: none;

        background-color: transparent;
        border-color: var(--button-text-graphite-secondary-text);
      }

      ${p.$active &&
      css`
        background-color: transparent;
        border-color: var(--button-text-green-active);
        box-shadow: ${p.$variant !== 'outlined-without-active-shadow' &&
        '1px 1px 6px 0px var(--button-text-green-default)'};

        &:hover {
          background-color: transparent;

          border-color: var(--button-text-green-active);

          box-shadow: ${p.$variant !== 'outlined-without-active-shadow' &&
          '1px 1px 6px 0px var(--button-text-green-default)'};
        }
      `};
    `}

  ${p =>
    p.$variant === 'outlined-secondary' &&
    css`
      box-shadow: none;
      background-color: transparent;

      font-weight: 500;
      color: var(--button-text-graphite-priory-text);

      padding: 4px 8px 5px;
      border-radius: var(--border-radius-block);
      border: 1px solid var(--graphite-graphite-120);

      &:hover {
        box-shadow: none;
        background-color: transparent;

        border: 1px solid var(--button-text-graphite-secondary-text);
      }
    `}

  ${p =>
    p.$variant === 'empty-without-arrow' &&
    css`
      height: 32px;
      width: fit-content;

      gap: 8px;

      line-height: 20px;
      color: var(--button-text-graphite-secondary-text);

      padding: 8px 12px 8px 8px;
      background-color: transparent;
      border-radius: var(--border-radius-block);

      svg path {
        transition: var(--transition-200);
      }

      &:hover {
        box-shadow: none;
      }

      ${!p.$active &&
      css`
        &:hover {
          color: var(--button-text-graphite-priory-text);

          background-color: #f3fded;

          ${IconWrapper} {
            svg path {
              fill: var(--button-text-graphite-priory-text);
            }
          }
        }

        &:active {
          color: var(--button-text-graphite-primary-text);

          background-color: #e6fbda;

          ${IconWrapper} {
            svg path {
              fill: var(--button-text-graphite-primary-text);
            }
          }
        }
      `};

      ${p.$active &&
      css`
        box-shadow: none;

        color: var(--graphite-graphite-840);

        border-color: var(--button-text-green-active);

        ${IconWrapper} {
          svg path {
            fill: var(--graphite-graphite-840);
          }
        }
      `};

      ${p.$selectedValue && `color: var(--button-text-graphite-priory-text)`};
    `}

  ${p =>
    p.$showPlaceholder &&
    css`
      color: var(--button-text-graphite-secondary-text);

      &:hover {
        color: var(--button-text-graphite-secondary-text);
      }
    `}

  max-width: ${p => p.$maxWidth};
  min-width: ${p => p.$minWidth};

  ${p =>
    p.$bgColor &&
    css`
      color: ${ColorUtil.getTextContrastColorByBgColorHex(p.$bgColor)};

      box-shadow: none;
      border: 1px solid ${p.$bgColor};
      background-color: ${p.$bgColor};

      // to access FilledArrowIcon svg or clear icon
      div {
        svg path {
          fill: ${ColorUtil.getTextContrastColorByBgColorHex(p.$bgColor)};

          &:nth-child(2),
          &:nth-child(3) {
            stroke: ${p.$bgColor};
          }
        }
      }

      &:hover {
        color: ${ColorUtil.getTextContrastColorByBgColorHex(p.$bgColor)};

        border: 1px solid ${p.$bgColor};
        background-color: ${p.$bgColor};
      }

      ${p.$active &&
      css`
        box-shadow: none;

        color: ${ColorUtil.getTextContrastColorByBgColorHex(p.$bgColor)};

        background-color: ${p.$bgColor};
        border: 1px solid ${p.$bgColor};

        &:hover {
          box-shadow: none;
        }
      `};
    `}

  ${p =>
    p.$invalid &&
    css`
      && {
        box-shadow: none;

        border-color: var(--button-text-red-hover);
      }
    `};

  ${p =>
    p.$hasIcon &&
    css`
      position: relative;

      padding-left: 28px;
    `}

  ${p =>
    p.$greenBg &&
    css`
      color: var(--button-text-graphite-primary-text);

      background-color: var(--background-green-20);
      border: 1px solid var(--primary-statuses-green-520);

      &:hover,
      &:active {
        color: var(--button-text-graphite-primary-text);

        background-color: var(--background-green-20);
        border: 1px solid var(--primary-statuses-green-520);
      }
    `}
`;

const Title = styled.div`
  ${TruncateMixin}
`;

const RightBlock = styled.div<{ $variant: MySelectTitleRootVariant }>`
  display: flex;
  align-items: center;
  gap: 2px;

  margin-left: ${p => (p.$variant === 'empty' ? 0 : 'auto')};

  svg path {
    fill: ${p =>
      p.$variant === 'filled'
        ? 'var(--button-text-graphite-priory-text)'
        : 'var(--button-text-graphite-primary-text)'};
  }
`;

interface Props {
  ref?: Ref<HTMLDivElement>;
  children: ReactNode;
  active: boolean;
  Icon?: ReactNode;
  bgColor?: string;
  invalid?: boolean;
  greenBg?: boolean;
  disabled?: boolean;
  selectedValue?: boolean;
  showPlaceholder?: boolean;
  gap?: CSSProperties['gap'];
  hiddenlyDisabled?: boolean;
  width?: CSSProperties['width'];
  hideArrowWhenDisabled?: boolean;
  margin?: CSSProperties['margin'];
  variant?: MySelectTitleRootVariant;
  maxWidth?: CSSProperties['maxWidth'];
  minWidth?: CSSProperties['minWidth'];
  menuShowHideProps?: MenuShowHideProps;
  onClick?: () => void;
  onClear?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const MySelectTitle = (props: Props) => {
  const {
    ref,
    children,
    active,
    gap,
    Icon,
    width,
    margin,
    greenBg,
    bgColor,
    invalid,
    maxWidth,
    selectedValue,
    showPlaceholder,
    disabled = false,
    variant = 'filled',
    minWidth = '176px',
    hideArrowWhenDisabled,
    hiddenlyDisabled = false,
    menuShowHideProps,
    onClick,
    onClear,
  } = props;

  const { t } = useTranslation();

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') menuShowHideProps?.onOpen();
  };

  return (
    <MySelectTitleRoot
      ref={ref}
      $gap={gap}
      $width={width}
      $active={active}
      $margin={margin}
      $invalid={invalid}
      $variant={variant}
      $greenBg={greenBg}
      $maxWidth={maxWidth}
      $minWidth={minWidth}
      $disabled={disabled}
      $hasIcon={Boolean(Icon)}
      $selectedValue={selectedValue}
      $showPlaceholder={showPlaceholder}
      $hiddenlyDisabled={hiddenlyDisabled}
      title={disabled ? t('field_readonly') : undefined}
      $bgColor={bgColor ? ColorUtil.getProcessedBGColor(bgColor) : undefined}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      {Icon && <IconWrapper>{Icon}</IconWrapper>}

      <Title>{children}</Title>

      {(disabled && hideArrowWhenDisabled) ||
      ((variant === 'empty-without-arrow' || variant === 'filled-small') && !onClear) ? null : (
        <RightBlock $variant={variant}>
          {onClear && !showPlaceholder && (
            <ClearButton onClick={onClear} hoverState={bgColor ? 'semitransparent' : 'red'} />
          )}

          {variant !== 'empty-without-arrow' && <FilledArrowIcon isArrowUp={active} />}
        </RightBlock>
      )}
    </MySelectTitleRoot>
  );
};

export { MySelectTitle };
