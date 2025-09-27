import styled, { css, type CSSProperties } from 'styled-components';
import type { MyInputFontSize, MyInputVariant } from '../../../../../models';

interface StyledInputProps {
  $alwaysActive: boolean;
  $variant: MyInputVariant;
  $activeBgColor?: boolean;
  $hasBorderBottom: boolean;
  $hasPaddingBottom: boolean;
  $fontSize: MyInputFontSize;
  $hasBorderBottomLight: boolean;
  $hideNumberInputControls: boolean;
  $textAlign: CSSProperties['textAlign'];
  $medium?: boolean;
  $invalid?: boolean;
  $hasRightIcon?: boolean;
  $width?: CSSProperties['width'];
  $padding?: CSSProperties['padding'];
}

export const StyledInput = styled.input<StyledInputProps>`
  height: 100%;
  width: ${p => p.$width ?? '100%'};

  vertical-align: top;

  font-size: ${p => {
    switch (p.$fontSize) {
      case 'small':
        return '12px';

      case 'normal':
        return '14px';

      case 'medium':
        return '18px';

      case 'large':
        return '24px';
    }
  }};
  text-align: ${p => p.$textAlign};
  font-weight: ${p => (p.$medium ? 500 : 400)};
  color: var(--button-text-graphite-priory-text);

  background-color: transparent;
  border-bottom: 1px solid
    ${p => (p.$hasBorderBottom ? 'var(--graphite-graphite-120)' : 'transparent')};
  ${p => p.$hasBorderBottomLight && `border-color: var(--graphite-graphite-120)`};
  ${p => p.$alwaysActive && 'border-bottom: 1px solid var(--button-text-green-hover)'};

  padding-left: 0;
  padding-bottom: ${p => (p.$hasPaddingBottom ? '3px' : 0)};
  transition: border var(--transition-200);

  &:focus,
  &:hover {
    ${p => !p.$invalid && `border-bottom: 1px solid var(--button-text-green-hover)`};
  }

  &:focus {
    outline: none;
  }

  ${p => p.$invalid && `border-bottom: 1px solid var(--button-text-red-hover)`};

  &::placeholder {
    color: var(--button-text-graphite-secondary-text);
  }

  ${p =>
    p.$hideNumberInputControls &&
    css`
      // hide number input controls
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      // hide number input controls in Firefox
      -moz-appearance: textfield !important;
    `}

  ${p =>
    p.$variant === 'filled' &&
    css`
      width: 100%;

      background: #f8fafbd7;
      padding: 3px 8px;
      border-radius: var(--border-radius-element);
      border: 1px solid ${p.$invalid ? 'var(--button-text-red-hover)' : 'transparent'};

      &:focus,
      &:hover {
        ${p.$invalid && `border-bottom: 1px solid var(--button-text-green-hover)`};
      }
    `}

  ${p =>
    (p.$variant === 'outlined' || p.$variant === 'outlined-tall') &&
    css`
      width: 100%;
      height: ${p.$variant === 'outlined-tall' ? 36 : 28}px;

      padding: 4px 8px;
      color: var(--button-text-graphite-priory-text);
      border: 1px solid
        ${p.$invalid ? 'var(--button-text-red-hover)' : 'var(--graphite-graphite-120)'};
      border-radius: var(--border-radius-element);

      &:focus,
      &:hover {
        ${!p.$invalid && `border-color: var(--button-text-graphite-secondary-text)`};
      }
    `}

  ${p =>
    p.$activeBgColor &&
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

  ${p => p.$hasRightIcon && `padding-right: 24px`};
  ${p => p.$padding && `padding: ${p.$padding}`};
`;
