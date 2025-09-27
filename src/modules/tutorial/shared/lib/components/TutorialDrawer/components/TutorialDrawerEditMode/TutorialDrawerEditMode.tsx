import { DefaultLoader, HEADER_HEIGHT, debounce } from '@/shared';
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DraggingStyle,
  type DropResult,
} from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';
import {
  SortOrderDto,
  SortOrderListDto,
  invalidateGetExpandedTutorialGroupsQuery,
  useCreateTutorialGroup,
  useCreateTutorialItem,
  useDeleteTutorialGroup,
  useDeleteTutorialItem,
  useUpdateTutorialGroupName,
  useUpdateTutorialItem,
} from '../../../../../../api';
import type { TutorialEditModeStore } from '../../../../../../store';
import { CreateTutorialGroupBlock, TutorialEditGroupForm } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoaderWrapper = styled.div`
  padding-top: 80px;
`;

const GroupFormList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const TutorialEditGroupFormWrapper = styled.li`
  // to prevent issues when drag occurs in a container with fixed position (MyDrawer)
  // https://github.com/atlassian/react-beautiful-dnd/issues/1881#issuecomment-1464944428
  left: auto !important;

  width: 100%;
`;

const DEBOUNCE_MS = 750;

interface Props {
  tutorialEditModeStore: TutorialEditModeStore;
}

const TutorialDrawerEditMode = observer((props: Props) => {
  const { tutorialEditModeStore } = props;

  const {
    isLoaded,
    queryParams,
    tutorialGroupsForms,
    isCreatingGroupForm,
    createdEmptyGroupForm,
    deleteItem,
    deleteGroup,
    updateItemName,
    updateItemLink,
    updateGroupName,
    getGroupFormById,
    saveEmptyItemForm,
    updateItemUsersIds,
    saveEmptyGroupForm,
    updateItemProducts,
    deleteEmptyItemForm,
    createEmptyItemForm,
    createEmptyGroupForm,
    deleteEmptyGroupForm,
    changeItemsSortOrder,
    changeGroupsSortOrder,
  } = tutorialEditModeStore;

  const { mutateAsync: createGroupMutateFn } = useCreateTutorialGroup(queryParams);

  const handleSaveEmptyGroupForm = useCallback(
    () => saveEmptyGroupForm({ handler: createGroupMutateFn }),
    [saveEmptyGroupForm, createGroupMutateFn]
  );

  const { mutateAsync: deleteGroupMutateFn } = useDeleteTutorialGroup(queryParams);

  const getGroupDeleteHandler = useCallback(
    (groupId: number) => () => deleteGroup({ groupId, handler: deleteGroupMutateFn }),
    [deleteGroup, deleteGroupMutateFn]
  );

  const { mutateAsync: updateGroupNameMutateFn } = useUpdateTutorialGroupName(queryParams);

  const getGroupNameUpdateHandler = useCallback(
    (groupId: number) =>
      debounce(() => updateGroupName({ groupId, handler: updateGroupNameMutateFn }), DEBOUNCE_MS),
    [updateGroupName, updateGroupNameMutateFn]
  );

  const getCreateEmptyItemFormHandler = useCallback(
    (groupId: number) => () => createEmptyItemForm(groupId),
    [createEmptyItemForm]
  );

  const getDeleteEmptyItemFormHandler = useCallback(
    (groupId: number) => () => deleteEmptyItemForm(groupId),
    [deleteEmptyItemForm]
  );

  const { mutateAsync: createItemMutateFn } = useCreateTutorialItem(queryParams);

  const getSaveEmptyItemFormHandler = useCallback(
    (groupId: number) => () => saveEmptyItemForm({ groupId, handler: createItemMutateFn }),
    [saveEmptyItemForm, createItemMutateFn]
  );

  const { mutateAsync: deleteItemMutateFn } = useDeleteTutorialItem(queryParams);

  const getDeleteItemFormHandler = useCallback(
    (groupId: number) => (itemId: number) =>
      deleteItem({ groupId, itemId, handler: deleteItemMutateFn }),
    [deleteItem, deleteItemMutateFn]
  );

  const { mutateAsync: updateItemMutationFn } = useUpdateTutorialItem(queryParams);

  const getUpdateItemFormNameHandler = useCallback(
    (groupId: number) =>
      debounce(
        (itemId: number) => updateItemName({ groupId, itemId, handler: updateItemMutationFn }),
        DEBOUNCE_MS
      ),
    [updateItemName, updateItemMutationFn]
  );

  const getUpdateItemFormLinkHandler = useCallback(
    (groupId: number) =>
      debounce(
        (itemId: number): Promise<void> =>
          updateItemLink({ groupId, itemId, handler: updateItemMutationFn }),
        DEBOUNCE_MS
      ),
    [updateItemLink, updateItemMutationFn]
  );

  const getUpdateItemFormUsersIdsHandler = useCallback(
    (groupId: number) =>
      debounce(async (itemId: number): Promise<void> => {
        await updateItemUsersIds({ groupId, itemId, handler: updateItemMutationFn });

        invalidateGetExpandedTutorialGroupsQuery(queryParams);
      }, DEBOUNCE_MS),
    [queryParams, updateItemUsersIds, updateItemMutationFn]
  );

  const getUpdateItemFormProductsHandler = useCallback(
    (groupId: number) =>
      debounce(async (itemId: number): Promise<void> => {
        await updateItemProducts({ groupId, itemId, handler: updateItemMutationFn });

        invalidateGetExpandedTutorialGroupsQuery(queryParams);
      }, DEBOUNCE_MS),
    [queryParams, updateItemProducts, updateItemMutationFn]
  );

  const getChangeItemsFormsSortOrderHandler = useCallback(
    (groupId: number) =>
      async ({ source, destination }: DropResult): Promise<void> => {
        if (!destination || destination.index === source.index) return;

        const groupForm = getGroupFormById(groupId);

        const [moved] = groupForm.itemsForms.splice(source.index, 1);

        if (!moved) throw new Error('Failed to end form group item drag, nothing was moved');

        groupForm.itemsForms.splice(destination.index, 0, moved);

        groupForm.itemsForms.forEach((f, idx) => f.changeSortOrder(idx));

        const sortOrderListDto = new SortOrderListDto({
          items: groupForm.itemsForms.map<SortOrderDto>(
            f => new SortOrderDto({ id: f.id, sortOrder: f.sortOrder })
          ),
        });

        await changeItemsSortOrder({ groupId, dto: sortOrderListDto });

        invalidateGetExpandedTutorialGroupsQuery(queryParams);
      },
    [queryParams, changeItemsSortOrder, getGroupFormById]
  );

  const handleChangeGroupsSortOrder = useCallback(
    async ({ source, destination }: DropResult): Promise<void> => {
      if (!destination || destination.index === source.index) return;

      const [moved] = tutorialGroupsForms.splice(source.index, 1);

      if (!moved) throw new Error('Failed to end form group drag, nothing was moved');

      tutorialGroupsForms.splice(destination.index, 0, moved);

      tutorialGroupsForms.forEach((f, idx) => f.changeSortOrder(idx));

      const sortOrderListDto = new SortOrderListDto({
        items: tutorialGroupsForms.map<SortOrderDto>(
          f => new SortOrderDto({ id: f.id, sortOrder: f.sortOrder })
        ),
      });

      await changeGroupsSortOrder(sortOrderListDto);

      invalidateGetExpandedTutorialGroupsQuery(queryParams);
    },
    [tutorialGroupsForms, queryParams, changeGroupsSortOrder]
  );

  return (
    <Root>
      {isLoaded ? (
        <>
          <CreateTutorialGroupBlock
            isSaving={isCreatingGroupForm}
            createdForm={createdEmptyGroupForm}
            handleDeleteForm={deleteEmptyGroupForm}
            handleCreateForm={createEmptyGroupForm}
            handleSaveForm={handleSaveEmptyGroupForm}
          />

          <DragDropContext onDragEnd={handleChangeGroupsSortOrder}>
            <Droppable droppableId="workspace__TutorialDrawerEditMode--GroupFormList">
              {provided => (
                <GroupFormList ref={provided.innerRef} {...provided.droppableProps}>
                  {tutorialGroupsForms
                    .filter(g => g.id > 0)
                    .slice()
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((f, idx) => (
                      <Draggable key={f.id} draggableId={String(f.id)} index={idx}>
                        {(provided, { isDragging }) => {
                          // https://github.com/atlassian/react-beautiful-dnd/issues/1881#issuecomment-691237307
                          const draggingStyle = provided.draggableProps.style as DraggingStyle;

                          if (isDragging && draggingStyle)
                            (provided.draggableProps.style as DraggingStyle).top =
                              draggingStyle.top - HEADER_HEIGHT;

                          return (
                            <TutorialEditGroupFormWrapper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <TutorialEditGroupForm
                                key={f.id}
                                groupForm={f}
                                isDragging={isDragging}
                                dragHandleProps={provided.dragHandleProps}
                                handleDeleteForm={getGroupDeleteHandler(f.id)}
                                deleteItemForm={getDeleteItemFormHandler(f.id)}
                                handleUpdateName={getGroupNameUpdateHandler(f.id)}
                                saveEmptyItemForm={getSaveEmptyItemFormHandler(f.id)}
                                deleteEmptyItemForm={getDeleteEmptyItemFormHandler(f.id)}
                                createEmptyItemForm={getCreateEmptyItemFormHandler(f.id)}
                                handleUpdateItemFormName={getUpdateItemFormNameHandler(f.id)}
                                handleUpdateItemFormLink={getUpdateItemFormLinkHandler(f.id)}
                                handleUpdateItemFormUsersIds={getUpdateItemFormUsersIdsHandler(
                                  f.id
                                )}
                                handleUpdateItemFormProducts={getUpdateItemFormProductsHandler(
                                  f.id
                                )}
                                handleChangeItemsFormsSortOrder={getChangeItemsFormsSortOrderHandler(
                                  f.id
                                )}
                              />
                            </TutorialEditGroupFormWrapper>
                          );
                        }}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </GroupFormList>
              )}
            </Droppable>
          </DragDropContext>
        </>
      ) : (
        <LoaderWrapper>
          <DefaultLoader />
        </LoaderWrapper>
      )}
    </Root>
  );
});

TutorialDrawerEditMode.displayName = 'TutorialDrawerEditMode';
export { TutorialDrawerEditMode };
