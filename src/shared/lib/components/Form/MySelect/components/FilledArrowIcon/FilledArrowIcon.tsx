import { memo } from 'react';
import styled from 'styled-components';
import { FilledArrowDownIcon } from '../../../../../../assets';

const Root = styled.div<{ $arrowUp: boolean }>`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transition: var(--transition-200);
  transform: rotate(${p => (p.$arrowUp ? 180 : 0)}deg);

  svg path {
    transition: var(--transition-200);
  }
`;

interface Props {
  isArrowUp: boolean;
}

const FilledArrowIcon = memo((props: Props) => {
  const { isArrowUp } = props;

  return (
    <Root $arrowUp={isArrowUp}>
      <FilledArrowDownIcon />
    </Root>
  );
});

FilledArrowIcon.displayName = 'FilledArrowIcon';
export { FilledArrowIcon };
