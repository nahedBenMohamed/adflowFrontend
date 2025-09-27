import { MediaBreakpoints, TruncateMixin } from '@/shared';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const CardItemRoot = styled(Link)<{ $dragging: boolean }>`
  position: relative;

  width: 255px;

  display: block;

  margin-bottom: 8px;

  &:nth-last-child(2) {
    margin-bottom: 0;
  }

  ${p => p.$dragging && `margin-bottom: 0`};

  @media ${MediaBreakpoints.SM} {
    width: 100%;
  }
`;

interface CardBlockProps {
  $gap: number;
  $dragging: boolean;
  $focused?: boolean;
  $draggable?: boolean;
}

export const CardBlock = styled.div<CardBlockProps>`
  position: relative;

  max-height: 150px;
  min-height: 46px;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: ${p => p.$gap}px;

  padding: 10px;
  background-color: var(--primary-statuses-white-0);
  border: 1px solid transparent;
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
  border-radius: var(--border-radius-block);
  transition: var(--transition-200);

  ${p => p.$dragging && `opacity: 0.4`};

  ${p =>
    p.$focused &&
    css`
      border: 1px solid var(--primary-statuses-green-520);
      box-shadow:
        0px 0px 2px var(--primary-statuses-green-520),
        0px 1px 2px var(--button-text-green-hover);
    `}
`;

export const CardName = styled.div<{ $gray: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${p => (p.$gray ? 'var(--button-text-graphite-secondary-text)' : 'var(--primary-blue)')};
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: ${p =>
      p.$gray ? 'var(--button-text-graphite-primary-text)' : 'var(--button-text-blue-hover)'};
  }

  &:active {
    color: ${p =>
      p.$gray ? 'var(--button-text-graphite-primary-text)' : 'var(--button-text-blue-active)'};
  }

  ${TruncateMixin}
`;
