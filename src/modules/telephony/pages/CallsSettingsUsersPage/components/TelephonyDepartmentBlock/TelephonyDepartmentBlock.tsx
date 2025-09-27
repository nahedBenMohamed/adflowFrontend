import { userStore } from '@/app';
import type { Department } from '@/modules/settings';
import { GroupIcon, TotalTag } from '@/shared';
import styled from 'styled-components';
import type { VoximplantUser } from '../../../../shared';
import { TelephonySubdepartmentBlock } from '../TelephonySubdepartmentBlock/TelephonySubdepartmentBlock';
import { TelephonyUsersList } from '../TelephonyUsersList/TelephonyUsersList';

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
  users: VoximplantUser[];
  department: Department;
}

const TelephonyDepartmentBlock = (props: Props) => {
  const { users, department } = props;

  const usersInDepartment: VoximplantUser[] = users.filter(
    u => userStore.getById(u.userId).departmentId === department.id
  );

  const total =
    usersInDepartment.length +
    department.subordinates.reduce((acc, sub) => {
      const usersInSubdepartment: VoximplantUser[] = users.filter(
        u => userStore.getById(u.userId).departmentId === sub.id
      );

      return acc + usersInSubdepartment.length;
    }, 0);

  if (total === 0) return null;

  return (
    <Root>
      <TitleWrapper>
        <DepartmentIconWrapper>
          <GroupIcon />
        </DepartmentIconWrapper>

        <Title>{department.name}</Title>

        <TotalTag total={total} />
      </TitleWrapper>

      {usersInDepartment.length > 0 && <TelephonyUsersList users={usersInDepartment} />}

      {department.subordinates.map(sub => {
        const usersInSubgroup: VoximplantUser[] = users.filter(
          u => userStore.getById(u.userId).departmentId === sub.id
        );

        if (usersInSubgroup.length === 0) return null;

        return (
          <TelephonySubdepartmentBlock key={sub.id} subdepartment={sub} users={usersInSubgroup} />
        );
      })}
    </Root>
  );
};

export { TelephonyDepartmentBlock };
