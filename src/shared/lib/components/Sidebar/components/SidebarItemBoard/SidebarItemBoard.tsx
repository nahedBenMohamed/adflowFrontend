import { boardApiUtil } from '@/app';
import { MiniLoader } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useMemo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { isPathnameOnEntitySection } from '../../../../helpers';
import { useToggleControl } from '../../../../hooks';
import type { SectionView } from '../../../../models';
import { SectionLinkUtil } from '../../../../utils';
import { BoardListWithLinks } from '../../../BoardList/BoardListWithLinks/BoardListWithLinks';
import { SidebarHoverCard } from '../SidebarHoverCard/SidebarHoverCard';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import { NavigatorHeaderTitle } from '../SidebarItemCategory/SidebarItemCategory';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  padding: 10px 8px 12px 4px;
`;

interface Props {
  children: ReactNode;
  entityTypeId: number;
  active: boolean;
  title: string;
  activeColor: string;
  tabFromParams?: SectionView;
}

const SidebarItemBoard = observer((props: Props) => {
  const { children, entityTypeId, active, title, tabFromParams, activeColor } = props;

  const { pathname } = useLocation();

  const isOnEntitiesSection = useMemo<boolean>(
    (): boolean => isPathnameOnEntitySection({ pathname, entityTypeId }),
    [pathname, entityTypeId]
  );

  const rootControl = useToggleControl(false);

  const [isHovering, { open: setHovering, close: setNotHovering }] = useDisclosure(false);

  const { data: boards, isLoading: areBoardsLoading } = boardApiUtil.useGetBoardsByEntityTypeId({
    entityTypeId,
    enabled: isHovering,
  });

  const path = SectionLinkUtil.getSectionLink(entityTypeId);

  const hasMultipleBoards = boards && boards.length > 1;

  const Item = (
    <SidebarItem
      path={path}
      active={active}
      loading={areBoardsLoading && !hasMultipleBoards}
      hovering={rootControl.active}
      tooltip={hasMultipleBoards ? undefined : title}
      activeColor={activeColor}
    >
      {children}
    </SidebarItem>
  );

  return (
    <div onMouseEnter={setHovering} onMouseLeave={setNotHovering}>
      {hasMultipleBoards ? (
        <SidebarHoverCard target={Item} onOpen={rootControl.open} onClose={rootControl.close}>
          <Content>
            <NavigatorHeaderTitle>
              {title}

              {areBoardsLoading && (
                <MiniLoader size="small" color="var(--primary-statuses-green-520)" />
              )}
            </NavigatorHeaderTitle>

            <BoardListWithLinks
              noPadding
              boards={boards}
              linkType="common"
              hasEditMode={false}
              entityTypeId={entityTypeId}
              // Tab is only used when we're changing boards from entities sections to preserve current active tab.
              // e.g. we're on entities board page -> list tab -> changing board -> we're on another board on the same list tab.
              // In other cases we don't need to pass tab to BoardListWithLinks, because it could lead to errors (such
              // as when we're on page which also has tab path param, let's say "Overview", and we don't want to pass it because
              // on entities section page it will lead to blank screen).
              tabFromParams={isOnEntitiesSection ? tabFromParams : undefined}
            />
          </Content>
        </SidebarHoverCard>
      ) : (
        Item
      )}
    </div>
  );
});

SidebarItemBoard.displayName = 'SidebarItemBoard';
export { SidebarItemBoard };
