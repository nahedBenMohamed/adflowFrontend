import type { DraggableProvided, DropResult } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import type { TutorialGroupForm } from '../../../../../../models';
import { CreateTutorialItemBlock } from '../CreateTutorialItemBlock/CreateTutorialItemBlock';
import { TutorialEditGroupItemsForms } from '../TutorialEditGroupItemsForms/TutorialEditGroupItemsForms';
import { TutorialGroupNameBlock } from '../TutorialGroupNameBlock/TutorialGroupNameBlock';

const Root = styled.div<{ $dragging: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding: 16px 16px 24px;
  border-bottom: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  ${p => p.$dragging && `opacity: 0.5`};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

interface Props {
  isDragging: boolean;
  groupForm: TutorialGroupForm;
  dragHandleProps: DraggableProvided['dragHandleProps'];
  handleDeleteForm: () => void;
  handleUpdateName: () => void;
  deleteEmptyItemForm: () => void;
  createEmptyItemForm: () => void;
  saveEmptyItemForm: () => Promise<void>;
  deleteItemForm: (itemId: number) => void;
  handleUpdateItemFormName: (itemId: number) => void;
  handleUpdateItemFormLink: (itemId: number) => void;
  handleUpdateItemFormUsersIds: (itemId: number) => void;
  handleUpdateItemFormProducts: (itemId: number) => void;
  handleChangeItemsFormsSortOrder: (result: DropResult) => void;
}

const TutorialEditGroupForm = observer((props: Props) => {
  const {
    isDragging,
    groupForm: { id: groupId, name, itemsForms, createdEmptyItemForm },
    dragHandleProps,
    handleDeleteForm,
    handleUpdateName,
    deleteEmptyItemForm,
    createEmptyItemForm,
    saveEmptyItemForm,
    deleteItemForm,
    handleUpdateItemFormName,
    handleUpdateItemFormLink,
    handleUpdateItemFormUsersIds,
    handleUpdateItemFormProducts,
    handleChangeItemsFormsSortOrder,
  } = props;

  const [isItemFromSaving, setIsItemFormSaving] = useState(false);

  const handleSaveEmptyItemForm = useCallback(async (): Promise<void> => {
    try {
      setIsItemFormSaving(true);

      await saveEmptyItemForm();
    } finally {
      setIsItemFormSaving(false);
    }
  }, [saveEmptyItemForm]);

  return (
    <Root $dragging={isDragging}>
      <TutorialGroupNameBlock
        model={name}
        dragHandleProps={dragHandleProps}
        handleDeleteForm={handleDeleteForm}
        handleChangeName={handleUpdateName}
      />

      <Content>
        <TutorialEditGroupItemsForms
          groupId={groupId}
          itemsForms={itemsForms}
          deleteItemForm={deleteItemForm}
          handleSaveForm={handleSaveEmptyItemForm}
          handleUpdateItemFormName={handleUpdateItemFormName}
          handleUpdateItemFormLink={handleUpdateItemFormLink}
          handleUpdateItemFormUsersIds={handleUpdateItemFormUsersIds}
          handleUpdateItemFormProducts={handleUpdateItemFormProducts}
          handleChangeItemsFormsSortOrder={handleChangeItemsFormsSortOrder}
        />

        <CreateTutorialItemBlock
          isSaving={isItemFromSaving}
          createdForm={createdEmptyItemForm}
          handleCreateForm={createEmptyItemForm}
          handleDeleteForm={deleteEmptyItemForm}
          handleSaveForm={handleSaveEmptyItemForm}
        />
      </Content>
    </Root>
  );
});

TutorialEditGroupForm.displayName = 'TutorialEditGroupForm';
export { TutorialEditGroupForm };
