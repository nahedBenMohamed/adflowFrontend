import styled from 'styled-components';
import type { VoximplantUser } from '../../../../shared';
import { TelephonyUserItem } from '../TelephonyUserItem/TelephonyUserItem';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  users: VoximplantUser[];
}

const TelephonyUsersList = (props: Props) => {
  const { users } = props;

  return (
    <Root>
      {users.map(u => (
        <TelephonyUserItem key={u.userId} user={u} />
      ))}
    </Root>
  );
};

export { TelephonyUsersList };
