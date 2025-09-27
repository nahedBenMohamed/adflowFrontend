import { SubgroupIcon, TotalTag, type User } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import type { Department } from '../../../../../shared';
import { UserList } from '../UserList/UserList';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px;
`;

const SubdepartmentIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  subdepartment: Department;
  users: User[];
  onDeleteUser: (userId: number) => void;
}

const SubdepartmentBlock = observer((props: Props) => {
  const { subdepartment, users, onDeleteUser } = props;

  const total = users.length;

  return (
    <Root>
      <TitleWrapper>
        <SubdepartmentIconWrapper>
          <SubgroupIcon />
        </SubdepartmentIconWrapper>

        <Title>{subdepartment.name}</Title>

        <TotalTag total={total} />
      </TitleWrapper>

      <UserList users={users} onDelete={onDeleteUser} />
    </Root>
  );
});

SubdepartmentBlock.displayName = 'SubdepartmentBlock';
export { SubdepartmentBlock };
