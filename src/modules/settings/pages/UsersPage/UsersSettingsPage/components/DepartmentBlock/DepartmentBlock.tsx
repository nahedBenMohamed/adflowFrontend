import { GroupIcon, TotalTag, type User } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import type { Department } from '../../../../../shared';
import { SubdepartmentBlock } from '../SubdepartmentBlock/SubdepartmentBlock';
import { UserList } from '../UserList/UserList';

const Root = styled.li`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 5px 8px;
`;

const DepartmentIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 600;
  line-height: 26px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  department: Department;
  users: User[];
  onDeleteUser: (userId: number) => void;
}

const DepartmentBlock = observer((props: Props) => {
  const { department, users, onDeleteUser } = props;

  const usersInDepartment: User[] = users.filter(user => user.departmentId === department.id);

  const total =
    usersInDepartment.length +
    department.subordinates.reduce((acc, sub) => {
      const usersInSubdepartment: User[] = users.filter(user => user.departmentId === sub.id);

      return acc + usersInSubdepartment.length;
    }, 0);

  if (total === 0) {
    return null;
  }

  return (
    <Root>
      <TitleWrapper>
        <DepartmentIconWrapper>
          <GroupIcon />
        </DepartmentIconWrapper>

        <Title>{department.name}</Title>

        <TotalTag total={total} />
      </TitleWrapper>

      {!!usersInDepartment.length && <UserList users={usersInDepartment} onDelete={onDeleteUser} />}

      {department.subordinates.map(sub => {
        const usersInSubgroup: User[] = users.filter(user => user.departmentId === sub.id);

        if (usersInSubgroup.length === 0) return null;

        return (
          <SubdepartmentBlock
            key={sub.id}
            subdepartment={sub}
            users={usersInSubgroup}
            onDeleteUser={onDeleteUser}
          />
        );
      })}
    </Root>
  );
});

DepartmentBlock.displayName = 'DepartmentBlock';
export { DepartmentBlock };
