import { HEADER_HEIGHT, Hint } from '@/shared';
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DraggingStyle,
  type DropResult,
} from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { TutorialItemForm } from '../../../../../../models';
import { TutorialEditGroupItemForm } from '../TutorialEditGroupItemForm/TutorialEditGroupItemForm';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;

  padding-left: 36px;
`;

const HeaderItem = styled.div`
  height: 20px;
  width: var(--tutorial-item-column-width);

  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding-left: 8px;
`;

const ItemsFormList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const TutorialEditGroupItemFormWrapper = styled.li`
  // to prevent issues when drag occurs in a container with fixed position (MyDrawer)
  // https://github.com/atlassian/react-beautiful-dnd/issues/1881#issuecomment-1464944428
  left: auto !important;

  width: 100%;
`;

interface Props {
  groupId: number;
  itemsForms: TutorialItemForm[];
  handleSaveForm: () => void;
  deleteItemForm: (itemId: number) => void;
  handleUpdateItemFormName: (itemId: number) => void;
  handleUpdateItemFormLink: (itemId: number) => void;
  handleUpdateItemFormUsersIds: (itemId: number) => void;
  handleUpdateItemFormProducts: (itemId: number) => void;
  handleChangeItemsFormsSortOrder: (result: DropResult) => void;
}

const TutorialEditGroupItemsForms = observer((props: Props) => {
  const {
    groupId,
    itemsForms,
    handleSaveForm,
    deleteItemForm,
    handleUpdateItemFormName,
    handleUpdateItemFormLink,
    handleUpdateItemFormUsersIds,
    handleUpdateItemFormProducts,
    handleChangeItemsFormsSortOrder,
  } = props;

  const { t } = useTranslation('module.tutorial', {
    keyPrefix: 'tutorial.tutorial_drawer.tutorial_edit_group_items_forms',
  });

  const getDeleteItemFormHandler = useCallback(
    (itemId: number) => () => deleteItemForm(itemId),
    [deleteItemForm]
  );

  const getUpdateItemFormNameHandler = useCallback(
    (itemId: number) => () => handleUpdateItemFormName(itemId),
    [handleUpdateItemFormName]
  );

  const getUpdateItemFormLinkHandler = useCallback(
    (itemId: number) => () => handleUpdateItemFormLink(itemId),
    [handleUpdateItemFormLink]
  );

  const getUpdateItemFormUsersIdsHandler = useCallback(
    (itemId: number) => () => handleUpdateItemFormUsersIds(itemId),
    [handleUpdateItemFormUsersIds]
  );

  const getUpdateItemFormProductsHandler = useCallback(
    (itemId: number) => () => handleUpdateItemFormProducts(itemId),
    [handleUpdateItemFormProducts]
  );

  return (
    <Root>
      {itemsForms.length > 0 && (
        <Header>
          <HeaderItem>{t('name')}</HeaderItem>
          <HeaderItem>{t('link')}</HeaderItem>
          <HeaderItem>{t('users')}</HeaderItem>
          <HeaderItem>
            {t('products')}

            <Hint text={t('products_hint')} />
          </HeaderItem>
        </Header>
      )}

      {/* display only saved items forms in this list*/}
      <DragDropContext onDragEnd={handleChangeItemsFormsSortOrder}>
        <Droppable droppableId="workspace__TutorialEditGroupItemsForms--ItemsFormList">
          {provided => (
            <ItemsFormList ref={provided.innerRef} {...provided.droppableProps}>
              {/* Sorting in JSX made intentionally because otherwise DND lags */}
              {itemsForms
                .filter(f => f.id > 0)
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((f, idx) => (
                  <Draggable key={f.id} draggableId={`${groupId}-${f.id}`} index={idx}>
                    {(provided, { isDragging }) => {
                      // https://github.com/atlassian/react-beautiful-dnd/issues/1881#issuecomment-691237307
                      const draggingStyle = provided.draggableProps.style as DraggingStyle;

                      if (isDragging && draggingStyle)
                        (provided.draggableProps.style as DraggingStyle).top =
                          draggingStyle.top - HEADER_HEIGHT;

                      return (
                        <TutorialEditGroupItemFormWrapper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <TutorialEditGroupItemForm
                            key={f.id}
                            itemForm={f}
                            isDragging={isDragging}
                            dragHandleProps={provided.dragHandleProps}
                            handleSaveForm={handleSaveForm}
                            handleDeleteForm={getDeleteItemFormHandler(f.id)}
                            handleUpdateName={getUpdateItemFormNameHandler(f.id)}
                            handleUpdateLink={getUpdateItemFormLinkHandler(f.id)}
                            handleUpdateUserIds={getUpdateItemFormUsersIdsHandler(f.id)}
                            handleUpdateProducts={getUpdateItemFormProductsHandler(f.id)}
                          />
                        </TutorialEditGroupItemFormWrapper>
                      );
                    }}
                  </Draggable>
                ))}

              {provided.placeholder}
            </ItemsFormList>
          )}
        </Droppable>
      </DragDropContext>
    </Root>
  );
});

TutorialEditGroupItemsForms.displayName = 'TutorialEditGroupItemsForms';
export { TutorialEditGroupItemsForms };
