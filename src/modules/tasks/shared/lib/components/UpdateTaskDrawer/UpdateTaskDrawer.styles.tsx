import styled from 'styled-components';

export const Root = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 24px;
`;

export const TopControlsWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
`;

export const TitleBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MetaInfoWrapper = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 24px;
`;

export const CloseCrossIconWrapper = styled.button`
  width: 20px;
  height: 20px;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }
`;

export const FileInputWrapper = styled.div<{ $hasGap?: boolean }>`
  display: flex;
  flex-direction: column;

  ${p => p.$hasGap && `gap: 16px`};
`;

export const IconsBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;
