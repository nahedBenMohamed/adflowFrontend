import styled, { css, type CSSProperties } from 'styled-components';

interface RootProps {
  $disabled: boolean;
  $width?: CSSProperties['width'];
  $height?: CSSProperties['height'];
  $hiddenlyDisabled?: boolean;
}

export const StyledInputWrapper = styled.div<RootProps>`
  position: relative;

  height: ${p => p.$height};
  width: ${p => p.$width ?? '100%'};

  &::before {
    display: none;
  }

  ${p =>
    p.$disabled &&
    css`
      cursor: default;

      opacity: 0.8;

      * {
        pointer-events: none;
      }
    `}

  ${p => p.$hiddenlyDisabled && `pointer-events: none`};
`;
