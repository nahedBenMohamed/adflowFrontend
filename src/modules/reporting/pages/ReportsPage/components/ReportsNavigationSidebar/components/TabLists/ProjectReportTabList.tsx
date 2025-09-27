import { boardApiUtil, entityTypeStore } from '@/app';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import {
  ProjectReportType,
  type BoardHasEntitiesState,
  type RenderTabs,
  type ReportsSection,
} from '../../../../../../shared';
import { CollapsibleGroup, CollapsibleTab, ProjectEntitiesTabs } from './components';

interface Props {
  entityTypeId: number;
  activeTab: ReportsSection | string;
  setProjectReportTabs: Dispatch<SetStateAction<RenderTabs<ProjectReportType>[]>>;
}

const ProjectReportTabList = (props: Props) => {
  const { entityTypeId, activeTab, setProjectReportTabs } = props;

  const projectEntity = entityTypeStore.getById(entityTypeId);

  const { data: projectsBoards } = boardApiUtil.useGetBoardsByEntityTypeId({ entityTypeId });

  const [boardEntitiesStateArray, setBoardHasEntitiesStateArray] = useState<
    BoardHasEntitiesState[]
  >(() => projectsBoards?.map(p => ({ boardId: p.id, hasEntities: false })) ?? []);

  useEffect(() => {
    if (!projectsBoards?.length) return;

    const tabs = projectsBoards.map<RenderTabs<ProjectReportType>>(b => ({
      value: String(b.id),
      reportType: ProjectReportType.PROJECT_ENTITIES,
    }));

    setProjectReportTabs(prev => {
      const oldTabs = prev.filter(t => !tabs.map(t => t.value).includes(t.value));

      return [...oldTabs, ...tabs];
    });
  }, [projectsBoards, setProjectReportTabs]);

  const [boardIdFromParams] = activeTab.split('_');
  const boardId = boardIdFromParams ? Number(boardIdFromParams) : null;

  return (
    <CollapsibleGroup title={projectEntity.name}>
      {projectsBoards &&
        projectsBoards.map(b => (
          <CollapsibleTab
            key={b.id}
            title={b.name}
            value={String(b.id)}
            defaultExpanded={boardId === b.id}
            disabled={!boardEntitiesStateArray.find(p => p.boardId === b.id)?.hasEntities}
          >
            <ProjectEntitiesTabs
              boardId={b.id}
              entityTypeId={entityTypeId}
              setProjectReportTabs={setProjectReportTabs}
              setBoardHasEntitiesStateArray={setBoardHasEntitiesStateArray}
            />
          </CollapsibleTab>
        ))}
    </CollapsibleGroup>
  );
};

export { ProjectReportTabList };
