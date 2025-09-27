import { PlusIconButton, type Nullable, type Optional } from '@/shared';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  AnalyticsSubgroupControls,
  type AnalyticsFieldSubgroupCode,
  type Field,
  type RequisitesFieldSubgroupCode,
} from '../../../../shared';
import type { FieldSettingsStore, FieldsStore } from '../../../../store';
import { EditFieldFormGroupComponent, RequisitesSubgroupControls } from './components';

const List = styled.ul`
  width: 100%;

  display: flex;
  flex-direction: column;

  padding: 20px 24px 24px;
`;

const ListItem = styled.li`
  width: 100%;
`;

const AddFieldButtonsWrapper = styled.div<{ $noPadding: boolean }>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  padding-left: ${p => p.$noPadding && '28px'};
`;

interface Props {
  // for display
  fields: Field[];
  // store with all entity type fields
  fieldsStore: FieldsStore;
  entityTypeId: Nullable<number>;
  fieldSettingsStore?: FieldSettingsStore;
  isAnalyticsGroup?: boolean;
  isRequisitesGroup?: boolean;
  onAddField: () => void;
  onAddAnalyticsSubgroup: (code: AnalyticsFieldSubgroupCode) => void;
  onAddRequisitesSubgroup: (code: RequisitesFieldSubgroupCode) => void;
}

const EditFields = observer((props: Props) => {
  const {
    fields,
    fieldsStore,
    entityTypeId,
    fieldSettingsStore,
    isAnalyticsGroup,
    isRequisitesGroup,
    onAddField,
    onAddAnalyticsSubgroup,
    onAddRequisitesSubgroup,
  } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.components.edit_fields',
  });

  const onDragEnd = useCallback(
    ({ source, destination }: DropResult) => {
      if (!destination || destination.index === source.index) return;

      const [moved] = fields.splice(source.index, 1);

      if (!moved) throw new Error('Failed to end drag, nothing was moved');

      fields.splice(destination.index, 0, moved);

      fields.forEach((f, idx) =>
        fieldsStore.changeFieldSortOrder({ fieldId: f.id, newSortOrder: idx })
      );
    },
    [fields, fieldsStore]
  );

  const hasFields = fields.length > 0;

  const getUpdateFieldSettingsHandler = useCallback(
    (fieldId: number): Optional<() => Promise<void>> =>
      fieldSettingsStore
        ? async (): Promise<void> => fieldSettingsStore.updateFieldSettings(fieldId)
        : undefined,
    [fieldSettingsStore]
  );

  // this is currently used to update Field value (e.g. for formula fields), this has no correlations with FieldValue
  const getUpdateFieldValueHandler = useCallback(
    (fieldId: number) => (value?: Nullable<string>) =>
      fieldsStore.updateFieldValue({ fieldId, value }),
    [fieldsStore]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="workspace__EditFields--DroppableList">
        {provided => (
          <List ref={provided.innerRef} {...provided.droppableProps}>
            {fields.length > 0 &&
              fields
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((f, idx) => (
                  <Draggable key={f.id} draggableId={String(f.id)} index={idx}>
                    {provided => (
                      <ListItem ref={provided.innerRef} {...provided.draggableProps}>
                        <EditFieldFormGroupComponent
                          field={f}
                          entityTypeId={entityTypeId}
                          isLast={idx === fields.length - 1}
                          fieldSettingsStore={fieldSettingsStore}
                          disableBudgetOption={fieldsStore.hasBudgetField}
                          dragHandleProps={provided.dragHandleProps}
                          handleAddField={onAddField}
                          onChangeType={fieldsStore.changeFieldType}
                          onDeleteField={f => fieldsStore.deleteField(f.id)}
                          updateFieldValue={getUpdateFieldValueHandler(f.id)}
                          updateFieldSettings={getUpdateFieldSettingsHandler(f.id)}
                        />
                      </ListItem>
                    )}
                  </Draggable>
                ))}

            {provided.placeholder}

            <AddFieldButtonsWrapper $noPadding={hasFields}>
              <PlusIconButton text={t('add_field')} onClick={onAddField} />

              {isAnalyticsGroup && (
                <AnalyticsSubgroupControls
                  fieldsStore={fieldsStore}
                  onAddAnalyticsSubgroup={onAddAnalyticsSubgroup}
                />
              )}

              {isRequisitesGroup && (
                <RequisitesSubgroupControls
                  fieldsStore={fieldsStore}
                  onAddRequisitesSubgroup={onAddRequisitesSubgroup}
                />
              )}
            </AddFieldButtonsWrapper>
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
});

EditFields.displayName = 'EditFields';
export { EditFields };
