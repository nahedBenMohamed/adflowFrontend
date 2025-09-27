import { useEffect, type Dispatch, type SetStateAction } from 'react';
import styled from 'styled-components';
import { useGetProjectEntities } from '../../../../../../../../api';
import {
  ProjectReportType,
  type BoardHasEntitiesState,
  type RenderTabs,
} from '../../../../../../../../shared';
import { StyledTab } from '../StyledTab/StyledTab';

const Tab = styled(StyledTab)`
  padding: 6px 8px 6px 40px;
`;

interface Props {
  boardId: number;
  entityTypeId: number;
  setProjectReportTabs: Dispatch<SetStateAction<RenderTabs<ProjectReportType>[]>>;
  setBoardHasEntitiesStateArray: Dispatch<SetStateAction<BoardHasEntitiesState[]>>;
}

const generateCompositeValue = ({
  boardId,
  entityId,
}: {
  boardId: number;
  entityId: number;
}): string => `${boardId}_${entityId}`;

const ProjectEntitiesTabs = (props: Props) => {
  const { entityTypeId, boardId, setProjectReportTabs, setBoardHasEntitiesStateArray } = props;

  const { data: entities, isLoading } = useGetProjectEntities({ entityTypeId, boardId });

  useEffect(() => {
    if (isLoading) return;

    setBoardHasEntitiesStateArray(prev => [
      ...prev.filter(p => p.boardId !== boardId),
      { boardId, hasEntities: Boolean(entities && entities.length > 0) },
    ]);
  }, [boardId, entities, isLoading, setBoardHasEntitiesStateArray]);

  useEffect(() => {
    if (!entities) return;

    const tabs = entities.map<RenderTabs<ProjectReportType>>(e => ({
      value: generateCompositeValue({ entityId: e.id, boardId }),
      reportType: ProjectReportType.PROJECT_TASK_USERS,
    }));

    setProjectReportTabs(prev => {
      const oldTabs = prev.filter(t => !tabs.map(t => t.value).includes(t.value));

      return [...oldTabs, ...tabs];
    });
  }, [entities, boardId, setProjectReportTabs]);

  return (
    entities &&
    entities.map(e => (
      <Tab key={e.id} title={e.name} value={generateCompositeValue({ entityId: e.id, boardId })}>
        {e.name}
      </Tab>
    ))
  );
};

export { ProjectEntitiesTabs };
