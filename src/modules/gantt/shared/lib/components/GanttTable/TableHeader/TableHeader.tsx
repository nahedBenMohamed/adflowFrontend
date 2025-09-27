import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import { AddTaskButton, TaskSettingsIdentifier } from '@/modules/tasks';
import { ChangePeriodControls, CreateButton, PermissionObjectType, UriCodingUtil } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGanttContext } from '../../../../../context';

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  height: 56px;

  z-index: 6;
  overflow: hidden;
`;

const Head = styled.div`
  position: relative;

  height: 56px;
`;

const Row = styled.div`
  position: absolute;
  left: 0;

  width: 100%;
  height: 56px;

  display: flex;
`;

const Cell = styled.div`
  position: relative;

  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  padding: 0 24px 0 30px;
  border-right: 1px solid var(--graphite-graphite-80);
`;

const TableHeader = observer(() => {
  const { store, tasksProps, entityId, entityTypeId } = useGanttContext();
  const { tableWidth: width, boardId, scrollToNextMajorAmp, scrollToPrevMajorAmp } = store;

  const { user: currentUser } = authStore;

  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const createEntityPath =
    entityTypeId && currentUser?.canCreate(PermissionObjectType.ENTITY_TYPE, entityTypeId)
      ? routes.addCard({ entityTypeId, boardId, from: currentPageEncodedUrl })
      : null;

  const identifier = TaskSettingsIdentifier.forTaskBoard(boardId);

  const handleCreateProject = useCallback(() => {
    if (createEntityPath) navigate(createEntityPath);
  }, [createEntityPath, navigate]);

  return (
    <Root style={{ width }}>
      <Head style={{ width }}>
        <Row>
          <Cell>
            {entityTypeId && createEntityPath ? (
              <CreateButton onClick={handleCreateProject} />
            ) : tasksProps ? (
              <AddTaskButton
                identifier={identifier}
                entityId={entityId}
                boardId={boardId}
                handleAddTask={tasksProps.addTask}
              />
            ) : null}

            <ChangePeriodControls
              onClickPrev={scrollToPrevMajorAmp}
              onClickNext={scrollToNextMajorAmp}
            />
          </Cell>
        </Row>
      </Head>
    </Root>
  );
});

TableHeader.displayName = 'TableHeader';
export { TableHeader };
