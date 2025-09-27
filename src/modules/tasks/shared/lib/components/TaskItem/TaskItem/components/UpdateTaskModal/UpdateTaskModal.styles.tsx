import { DropdownScrollbarMixin } from '@/shared';
import styled from 'styled-components';

const Root = styled.div<{ $flex?: boolean }>`
  height: 100%;
  width: 100%;
  max-height: 716px;
  max-width: 1206px;

  display: grid;
  grid-template-columns: 60% auto 40%;

  overflow: hidden;
  border-radius: var(--border-radius-modal);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 101px 40px rgba(146, 151, 176, 0.01),
    0px 57px 34px rgba(146, 151, 176, 0.05),
    0px 25px 25px rgba(146, 151, 176, 0.09),
    0px 6px 14px rgba(146, 151, 176, 0.1),
    0px 0px 0px rgba(146, 151, 176, 0.1);

  ${p => p.$flex && `display: flex`};
`;

const LeftBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${DropdownScrollbarMixin}

  padding: 24px;
`;

const LeftBlockHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RightBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  overflow-y: hidden;
`;

const Delimiter = styled.div`
  width: 1px;

  flex: 1;

  background-color: var(--graphite-graphite-80);
`;

const RightBlockHeader = styled.div`
  position: relative;

  display: flex;
  justify-content: space-between;
  gap: 16px;

  padding: 24px;
  padding-bottom: 16px;
`;

const IconsBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const RightBlockContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;

  ${DropdownScrollbarMixin}

  padding: 24px;
`;

const CloseCrossIconWrapper = styled.button`
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

const FileInputWrapper = styled.div<{ $hasGap?: boolean }>`
  display: flex;
  flex-direction: column;

  ${p => p.$hasGap && `gap: 16px`};
`;

export {
  CloseCrossIconWrapper,
  Delimiter,
  FileInputWrapper,
  IconsBlock,
  LeftBlock,
  LeftBlockHeader,
  RightBlock,
  RightBlockContent,
  RightBlockHeader,
  Root,
};
