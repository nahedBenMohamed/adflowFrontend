import { memo } from 'react';
import styled from 'styled-components';
import { ModalTrashBinIcon as Icon } from '../../../../../assets';

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const ModalTrashBinIcon = memo(() => {
  return (
    <Root>
      <Icon />
    </Root>
  );
});

ModalTrashBinIcon.displayName = 'ModalTrashBinIcon';
export { ModalTrashBinIcon };
