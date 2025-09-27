import { TruncateMixin } from '@/shared';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const PotentialEntityLink = styled(Link)<{ $small?: boolean }>`
  width: 100%;

  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }

  ${p =>
    p.$small &&
    css`
      font-size: 12px;
      font-weight: 500;
      line-height: 14px;
    `}

  ${TruncateMixin}
`;
