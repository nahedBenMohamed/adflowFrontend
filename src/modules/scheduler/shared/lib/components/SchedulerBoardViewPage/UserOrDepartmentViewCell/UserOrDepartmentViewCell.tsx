import { userStore } from '@/app';
import { departmentsSettingsStore } from '@/modules/settings';
import { GroupIcon, SubgroupIcon, UserView } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { SchedulePerformerType } from '../../../models';

const DepartmentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const DepartmentIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  performerObjectId: number;
  performerType: SchedulePerformerType;
}

const UserOrDepartmentViewCell = observer((props: Props) => {
  const { performerObjectId, performerType } = props;

  switch (performerType) {
    case SchedulePerformerType.USER:
      return <UserView size="small" user={userStore.getById(performerObjectId)} />;

    case SchedulePerformerType.DEPARTMENT: {
      const department = departmentsSettingsStore.getById(performerObjectId);

      return (
        <DepartmentWrapper>
          <DepartmentIconWrapper>
            {department.parentId ? <SubgroupIcon /> : <GroupIcon />}
          </DepartmentIconWrapper>

          {department.name}
        </DepartmentWrapper>
      );
    }
  }
});

UserOrDepartmentViewCell.displayName = 'UserOrDepartmentViewCell';
export { UserOrDepartmentViewCell };
