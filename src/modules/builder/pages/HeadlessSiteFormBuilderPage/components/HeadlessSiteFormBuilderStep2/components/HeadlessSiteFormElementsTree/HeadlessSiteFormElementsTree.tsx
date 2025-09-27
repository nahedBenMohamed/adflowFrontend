import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';
import type { SiteFormElementsFieldModel } from '../../../../../../shared';
import { SiteFormElementsSwitch } from '../../../../../SiteFormBuilderPage/components';

const Root = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;

  padding-top: 48px;
`;

const Content = styled.div`
  width: 640px;
  height: fit-content;
  min-height: 320px;

  display: flex;
  flex-direction: column;

  overflow: hidden;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 157px 44px 0px rgba(146, 151, 176, 0),
    0px 101px 40px 0px rgba(146, 151, 176, 0.01),
    0px 57px 34px 0px rgba(146, 151, 176, 0.05),
    0px 25px 25px 0px rgba(146, 151, 176, 0.09),
    0px 6px 14px 0px rgba(146, 151, 176, 0.1),
    0px 0px 0px 0px rgba(146, 151, 176, 0.1);
`;

const FieldsWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 24px;

  padding: 24px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

interface Props {
  fieldsModels: SiteFormElementsFieldModel[];
  handleDeleteField: (fieldId: number) => void;
}

const HeadlessSiteFormElementsTree = observer((props: Props) => {
  const { fieldsModels, handleDeleteField } = props;

  const onDragEnd = useCallback(
    ({ source, destination }: DropResult) => {
      if (!destination || destination.index === source.index) return;

      const [moved] = fieldsModels.splice(source.index, 1);

      if (!moved) throw new Error('Failed to end drag, nothing was moved');

      fieldsModels.splice(destination.index, 0, moved);

      fieldsModels.forEach((f, idx) => (f.sortOrder = idx));
    },
    [fieldsModels]
  );

  return (
    <Root>
      <Content>
        <FieldsWrapper>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="workspace__SiteFormElementsTree--List">
              {provided => (
                <List ref={provided.innerRef} {...provided.droppableProps}>
                  <SiteFormElementsSwitch
                    withoutCheckboxes
                    fields={fieldsModels}
                    fieldLabelEnabled={true}
                    fieldPlaceholderEnabled={false}
                    handleDeleteField={handleDeleteField}
                  />

                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </FieldsWrapper>
      </Content>
    </Root>
  );
});

HeadlessSiteFormElementsTree.displayName = 'HeadlessSiteFormElementsTree';
export { HeadlessSiteFormElementsTree };
