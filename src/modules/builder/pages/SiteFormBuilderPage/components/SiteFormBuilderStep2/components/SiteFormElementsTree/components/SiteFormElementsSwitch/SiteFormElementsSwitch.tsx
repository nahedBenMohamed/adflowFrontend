import { Draggable, type DraggableProvided } from '@hello-pangea/dnd';
import { useCallback } from 'react';
import styled from 'styled-components';
import { SiteFormFieldType, type SiteFormElementsFieldModel } from '../../../../../../../../shared';
import { SiteFormDelimiterFieldElement } from '../SiteFormElements/SiteFormDelimiterFieldElement/SiteFormDelimiterFieldElement';
import { SiteFormEntityFieldElement } from '../SiteFormElements/SiteFormEntityFieldElement/SiteFormEntityFieldElement';
import { SiteFormSchedulerFieldElement } from '../SiteFormElements/SiteFormSchedulerFieldElement/SiteFormSchedulerFieldElement';

const ListItem = styled.li<{ $dragging: boolean }>`
  width: 100%;

  margin-bottom: 24px;
  transition: opacity var(--transition-200);

  ${p => p.$dragging && `opacity: 0.6`};
`;

interface Props {
  fieldLabelEnabled: boolean;
  fieldPlaceholderEnabled: boolean;
  fields: SiteFormElementsFieldModel[];
  withoutCheckboxes?: boolean;
  handleDeleteField: (fieldId: number) => void;
}

const SiteFormElementsSwitch = (props: Props) => {
  const {
    fieldLabelEnabled,
    fieldPlaceholderEnabled,
    fields,
    withoutCheckboxes,
    handleDeleteField,
  } = props;

  const getDeleteFieldHandler = useCallback(
    (fieldId: number) => () => handleDeleteField(fieldId),
    [handleDeleteField]
  );

  const getFieldComponent = ({
    field,
    dragHandleProps,
  }: {
    field: SiteFormElementsFieldModel;
    dragHandleProps: DraggableProvided['dragHandleProps'];
  }) => {
    switch (field.type) {
      case SiteFormFieldType.ENTITY_FIELD:
        return (
          <SiteFormEntityFieldElement
            key={field.id}
            field={field}
            dragHandleProps={dragHandleProps}
            fieldLabelEnabled={fieldLabelEnabled}
            withoutCheckboxes={withoutCheckboxes}
            fieldPlaceholderEnabled={fieldPlaceholderEnabled}
            onDelete={getDeleteFieldHandler(field.id)}
          />
        );

      case SiteFormFieldType.ENTITY_NAME:
        return (
          <SiteFormEntityFieldElement
            key={field.id}
            field={field}
            dragHandleProps={dragHandleProps}
            fieldLabelEnabled={fieldLabelEnabled}
            withoutCheckboxes={withoutCheckboxes}
            fieldPlaceholderEnabled={fieldPlaceholderEnabled}
            onDelete={getDeleteFieldHandler(field.id)}
          />
        );

      case SiteFormFieldType.DELIMITER:
        return (
          <SiteFormDelimiterFieldElement
            key={field.id}
            field={field}
            dragHandleProps={dragHandleProps}
            onDelete={getDeleteFieldHandler(field.id)}
          />
        );

      case SiteFormFieldType.SCHEDULE:
      case SiteFormFieldType.SCHEDULE_PERFORMER:
      case SiteFormFieldType.SCHEDULE_DATE:
      case SiteFormFieldType.SCHEDULE_TIME:
        return (
          <SiteFormSchedulerFieldElement
            key={field.id}
            field={field}
            dragHandleProps={dragHandleProps}
            fieldLabelEnabled={fieldLabelEnabled}
            withoutCheckboxes={withoutCheckboxes}
            fieldPlaceholderEnabled={fieldPlaceholderEnabled}
          />
        );

      case SiteFormFieldType.FILE:
      default:
        throw new Error(`SiteFormElementsSwitch: not implemented field type ${field.type}`);
    }
  };

  return fields
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((f, idx) => (
      <Draggable key={f.id} draggableId={String(f.id)} index={idx}>
        {(provided, dragSnapshot) => (
          <ListItem
            ref={provided.innerRef}
            $dragging={dragSnapshot.isDragging}
            {...provided.draggableProps}
          >
            {getFieldComponent({ field: f, dragHandleProps: provided.dragHandleProps })}
          </ListItem>
        )}
      </Draggable>
    ));
};

export { SiteFormElementsSwitch };
