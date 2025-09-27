import styled from 'styled-components';

interface IconWrapperProps {
  $top?: string;
  $left?: string;
  $right?: string;
  $bottom?: string;
}

export const IconWrapper = styled.button<IconWrapperProps>`
  position: absolute;
  right: ${p => p.$right};
  top: ${p => p.$top};
  left: ${p => p.$left};
  bottom: ${p => p.$bottom};

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }
`;
