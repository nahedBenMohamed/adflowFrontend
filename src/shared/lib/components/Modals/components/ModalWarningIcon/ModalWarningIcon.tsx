import { memo } from 'react';
import styled from 'styled-components';
import { ModalWarningIcon as Icon } from '../../../../../assets';

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const ModalWarningIcon = memo(() => {
  return (
    <Root>
      <Icon />
    </Root>
  );
});

ModalWarningIcon.displayName = 'ModalWarningIcon';
export { ModalWarningIcon };
