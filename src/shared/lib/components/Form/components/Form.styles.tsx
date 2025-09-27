import { MediaBreakpoints } from '@/shared';
import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { TruncateMixin } from '../../../mixins';

interface FormGroupProps {
  $alignItems?: CSSProperties['alignItems'];
  $gridRow?: CSSProperties['gridRow'];
  $position?: CSSProperties['position'];
  $gridTemplateColumns?: CSSProperties['gridTemplateColumns'];
  $margin?: CSSProperties['margin'];
  $gap?: CSSProperties['gap'];
  $cardFields?: boolean;
  $noEllipsis?: boolean;
  $mobileColumn?: boolean;
}

const FormGroup = styled.div<FormGroupProps>`
  position: ${p => p.$position};

  width: 100%;

  display: grid;
  align-items: center;
  grid-template-columns: ${p => p.$gridTemplateColumns ?? '24% 74%'};
  grid-template-columns: ${p => p.$cardFields && '38% 58%'};
  gap: ${p => p.$gap ?? '2%'};
  gap: ${p => p.$cardFields && '4%'};

  margin: ${p => p.$margin ?? '0 0 8px 0'};

  ${p => p.$alignItems && `align-items: ${p.$alignItems}`};
  ${p => p.$gridRow && `grid-row: ${p.$gridRow}`};

  ${p =>
    !p.$noEllipsis &&
    css`
      ${TruncateMixin}
    `}

  ${p =>
    p.$mobileColumn &&
    css`
      @media ${MediaBreakpoints.SM} {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }
    `};
`;

interface LabelProps {
  $capitalize?: boolean;
  $color?: CSSProperties['color'];
  $gap?: CSSProperties['gap'];
  $noEllipsis?: boolean;
  $inlineFlex?: boolean;
}

const Label = styled.label<LabelProps>`
  width: 100%;
  min-height: 30px;

  gap: ${p => p.$gap};
  align-items: center;
  display: ${p => (p.$inlineFlex ? 'inline-flex' : 'flex')};

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${p => p.$color ?? 'var(--button-text-graphite-primary-text)'};

  input {
    color: var(--button-text-graphite-secondary-text);
    transition: var(--transition-200);

    &:hover,
    &:focus {
      color: var(--button-text-graphite-primary-text);
    }
  }

  ${p => p.$capitalize && `text-transform: capitalize`};

  ${p =>
    !p.$noEllipsis &&
    css`
      ${TruncateMixin}
    `}
`;

export { FormGroup, Label };
