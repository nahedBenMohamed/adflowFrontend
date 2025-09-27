import { memo } from 'react';
import styled from 'styled-components';
import { ClipSmallIcon as Icon } from '../../../../shared';

const ClipIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ClipIcon = memo(() => {
  return (
    <ClipIconWrapper>
      <Icon />
    </ClipIconWrapper>
  );
});

ClipIcon.displayName = 'ClipIcon';
export { ClipIcon };
