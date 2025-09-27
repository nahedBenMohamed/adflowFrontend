import { boardApiUtil } from '@/app';
import { MiniLoader } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { useToggleControl } from '../../../../hooks';
import { DropdownScrollbarMixin } from '../../../../mixins';
import type { EntityType, SectionView } from '../../../../models';
import type { Nullable } from '../../../../types';
import { SectionLinkUtil } from '../../../../utils';
import { EntitiesAndBoardsList } from '../../../BoardPicker/EntityPicker/components';
import { SidebarHoverCard } from '../SidebarHoverCard/SidebarHoverCard';
import { SidebarItem } from '../SidebarItem/SidebarItem';

export const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;

  ${DropdownScrollbarMixin}

  padding: 10px 12px 10px 4px;
`;

export const NavigatorHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 10px;
  line-height: 18px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--button-text-graphite-primary-text);

  margin-left: 8px;
`;

interface Props {
  children: ReactNode;
  entityTypes: EntityType[];
  active: boolean;
  title: string;
  activeColor: string;
  currentTab: Nullable<SectionView>;
}

const SidebarItemCategory = observer((props: Props) => {
  const { children, entityTypes, active, title, activeColor, currentTab } = props;

  if (!entityTypes[0]) throw new Error('SidebarItemCategory must have at least one entity type');

  const rootControl = useToggleControl(false);

  const path = SectionLinkUtil.getSectionLink(entityTypes[0].id);

  const [isHovering, { open: setHovering, close: setNotHovering }] = useDisclosure(false);

  const { data: firstEntityTypesBoards, isLoading: areFirstEntityTypesBoardsLoading } =
    boardApiUtil.useGetBoardsByEntityTypeId({
      entityTypeId: entityTypes[0].id,
      enabled: isHovering,
    });

  const hasMultipleEntityTypesOrBoards =
    entityTypes.length > 1 || (firstEntityTypesBoards && firstEntityTypesBoards?.length > 1);

  const Item = (
    <SidebarItem
      path={path}
      active={active}
      activeColor={activeColor}
      hovering={rootControl.active}
      loading={areFirstEntityTypesBoardsLoading && !hasMultipleEntityTypesOrBoards}
      tooltip={hasMultipleEntityTypesOrBoards ? undefined : entityTypes[0].section.name}
    >
      {children}
    </SidebarItem>
  );

  return (
    <div onMouseEnter={setHovering} onMouseLeave={setNotHovering}>
      {hasMultipleEntityTypesOrBoards ? (
        <SidebarHoverCard target={Item} onOpen={rootControl.open} onClose={rootControl.close}>
          <Root>
            <NavigatorHeaderTitle>
              {title}

              {areFirstEntityTypesBoardsLoading && (
                <MiniLoader size="small" color="var(--primary-statuses-green-520)" />
              )}
            </NavigatorHeaderTitle>

            <EntitiesAndBoardsList
              noPadding
              maxHeight="400px"
              currentTab={currentTab}
              entityTypes={entityTypes}
              hasBoardNameEditMode={false}
            />
          </Root>
        </SidebarHoverCard>
      ) : (
        Item
      )}
    </div>
  );
});

SidebarItemCategory.displayName = 'SidebarItemCategory';
export { SidebarItemCategory };
