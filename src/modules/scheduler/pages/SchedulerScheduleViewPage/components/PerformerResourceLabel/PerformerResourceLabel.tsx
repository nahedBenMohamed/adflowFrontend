import { userStore } from '@/app';
import { departmentsSettingsStore } from '@/modules/settings';
import { AvatarCircle, GroupIcon, SubgroupIcon, TruncateMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, type ReactNode } from 'react';
import styled from 'styled-components';
import { SchedulePerformerType, type SchedulePerformer } from '../../../../shared';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
  padding: 8px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  overflow: hidden;
  word-wrap: break-word;
  text-align: left;
`;

const Position = styled.p`
  font-size: 10px;
  font-weight: 400;
  text-align: left;
  line-height: 14px;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

interface Props {
  performer: SchedulePerformer;
}

const PerformerResourceLabel = observer((props: Props) => {
  const {
    performer: { type, userId, departmentId },
  } = props;

  const getResourceContent = useCallback((): ReactNode => {
    if (type === SchedulePerformerType.USER && userId) {
      const { fullName, position, getAvatar } = userStore.getById(userId);

      return (
        <>
          <AvatarCircle size="large" avatar={getAvatar()} />

          <Content>
            <Name title={fullName}>{fullName}</Name>

            {position && <Position>{position}</Position>}
          </Content>
        </>
      );
    } else if (departmentId) {
      const department = departmentsSettingsStore.getById(departmentId);

      return (
        <>
          {department.parentId ? <SubgroupIcon /> : <GroupIcon />}

          <Content>{department.name}</Content>
        </>
      );
    }
  }, [type, userId, departmentId]);

  const ResourceContent = getResourceContent();

  return <Root>{ResourceContent}</Root>;
});

PerformerResourceLabel.displayName = 'PerformerResourceLabel';
export { PerformerResourceLabel };
