import { MediaBreakpoints } from '@/shared';
import { NoSelectMixin } from '@/shared/lib/mixins/NoSelect.mixin';
import { TruncateMixin } from '@/shared/lib/mixins/Truncate.mixin';
import styled, { css, keyframes } from 'styled-components';

export const Root = styled.div`
  position: relative;

  width: 279px;
  min-width: 279px;

  display: flex;
  flex-direction: column;

  padding-top: 4px;
  border-radius: 6px;

  @media ${MediaBreakpoints.SM} {
    width: calc(100vw - var(--sidebar-width) - 32px);
  }
`;

export const ColumnHeader = styled.div`
  display: flex;
  flex-direction: column;

  padding-right: 16px;
  margin-bottom: 10px;

  ${NoSelectMixin}
`;

export const ColumnHeaderDivider = styled.div<{ $bgColor?: string }>`
  height: 4px;
  width: 100%;

  border-radius: var(--border-radius-block);
  background-color: ${p => p.$bgColor ?? 'var(--primary-blue)'};
`;

const pencilPop = keyframes`
  0% {
    opacity: 0;
    scale: 0;
  }

  100% {
    opacity: 1;
    scale: 1;   
  }
`;

export const ColumnTop = styled.div<{ $hoverable?: boolean }>`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;

  padding: 0 4px;
  margin-bottom: 8px;

  .workspace__PencilButton--Root {
    display: none;
  }

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;

        .workspace__PencilButton--Root {
          display: flex;

          animation-delay: var(--transition-200);
          animation: ${pencilPop} var(--transition-200);
        }
      }
    `}
`;

interface ColumnTitleProps {
  $editMode?: boolean;
  $titleColor: string;
}

export const ColumnTitle = styled.div<ColumnTitleProps>`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${p => p.$titleColor};

  &:hover {
    ${p =>
      p.$editMode &&
      css`
        cursor: pointer;
      `}
  }

  ${TruncateMixin}
`;

export const ColumnHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TotalSum = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  text-align: center;
  color: var(--button-text-graphite-secondary-text);

  margin-top: 10px;

  ${TruncateMixin}
`;

export const IconWrapper = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;

  svg {
    width: 20px;
    height: 13px;

    path {
      stroke: ${p => p.$color};
    }
  }
`;

export const CardListDroppableArea = styled.div`
  min-height: 100%;

  @media ${MediaBreakpoints.SM} {
    overflow-x: hidden;
  }
`;

export const CardList = styled.div<{ $empty: boolean }>`
  position: relative;

  width: 263px;

  padding: 4px;
  margin-right: 16px;
  background: var(--background-blue-20);
  border-radius: var(--border-radius-block);
  transition: var(--transition-200);

  &:hover {
    background: var(--background-blue-40);
  }

  ${p => p.$empty && `padding: 0`};

  @media ${MediaBreakpoints.SM} {
    width: 100%;
  }

  ${NoSelectMixin}
`;

export const LoadMoreObserver = styled.div`
  pointer-events: none;

  position: absolute;
  bottom: 0;

  width: 100%;
  height: 450px;
`;
