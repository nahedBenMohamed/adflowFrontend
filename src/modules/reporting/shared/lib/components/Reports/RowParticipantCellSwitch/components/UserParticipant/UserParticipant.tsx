import { userStore } from '@/app';
import { UserView } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const CallIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  userId: number;
  callIcon: ReactNode;
}

const UserParticipant = (props: Props) => {
  const { callIcon, userId } = props;

  const user = userStore.getById(userId);

  return (
    <Root>
      <CallIconWrapper>{callIcon}</CallIconWrapper>

      <UserView user={user} />
    </Root>
  );
};

export { UserParticipant };
