import { entityTypeStore } from '@/app';
import { FieldType, type Nullable, type Optional } from '@/shared';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  CalendarIcon,
  FileImageIcon,
  GiantOutlinedInput,
  GiantOutlinedTextarea,
  MultiselectCaretIcon,
  SelectCaretIcon,
  type SiteFormElementsFieldModel,
  type SiteFormFieldEntityFieldModel,
  type SiteFormFieldTextMeta,
  SiteFormFieldTextView,
  SiteFormFieldType,
  SwitchImageIcon,
} from '../../../../../../../../../shared';
import { SiteFormElementTemplate } from '../SiteFormElementTemplate/SiteFormElementTemplate';

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  pointer-events: none;
`;

interface Props {
  fieldLabelEnabled: boolean;
  fieldPlaceholderEnabled: boolean;
  field: SiteFormElementsFieldModel;
  dragHandleProps: DraggableProvided['dragHandleProps'];
  withoutCheckboxes?: boolean;
  onDelete: () => void;
}

interface FieldArtifacts {
  fieldType: Nullable<FieldType>;
  meta?: Nullable<SiteFormFieldTextMeta>;
}

const SiteFormEntityFieldElement = observer((props: Props) => {
  const {
    fieldLabelEnabled,
    fieldPlaceholderEnabled,
    field,
    dragHandleProps,
    withoutCheckboxes,
    onDelete,
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step2.tree.entity_field_element',
  });

  const { fieldType, meta } = useMemo<FieldArtifacts>(
    () => ({
      fieldType:
        field.settings && field.type === SiteFormFieldType.ENTITY_FIELD
          ? entityTypeStore
              .getById(field.settings.entityTypeId)
              .getFieldById((field.settings as SiteFormFieldEntityFieldModel).fieldId).type
          : null,
      meta: field.settings ? (field.settings as SiteFormFieldEntityFieldModel).meta : null,
    }),
    [field.settings, field.type]
  );

  const Icon = useMemo<Optional<ReactNode>>(() => {
    switch (fieldType) {
      case FieldType.DATE:
        return (
          <IconWrapper>
            <CalendarIcon />
          </IconWrapper>
        );

      case FieldType.SELECT:
      case FieldType.COLORED_SELECT:
        return (
          <IconWrapper>
            <SelectCaretIcon />
          </IconWrapper>
        );

      case FieldType.MULTISELECT:
      case FieldType.COLORED_MULTISELECT:
        return (
          <IconWrapper>
            <MultiselectCaretIcon />
          </IconWrapper>
        );

      case FieldType.SWITCH:
        return (
          <IconWrapper>
            <SwitchImageIcon />
          </IconWrapper>
        );

      case FieldType.FILE:
        return (
          <IconWrapper>
            <FileImageIcon />
          </IconWrapper>
        );

      default:
        return;
    }
  }, [fieldType]);

  const labelEnabled = useMemo(() => {
    switch (fieldType) {
      // date field always has label as it does not have placeholder by design
      case FieldType.DATE:
        return true;

      // switch does not have label by design and is labeled by placeholder (which is required)
      case FieldType.SWITCH:
        return false;

      default:
        return fieldLabelEnabled;
    }
  }, [fieldType, fieldLabelEnabled]);

  const placeholderDisabled = useMemo(() => {
    switch (fieldType) {
      // date field does not have placeholder
      case FieldType.DATE:
        return true;

      // switch field always has placeholder, because it does not have label
      case FieldType.SWITCH:
        return false;

      default:
        return !fieldPlaceholderEnabled;
    }
  }, [fieldType, fieldPlaceholderEnabled]);

  return (
    <SiteFormElementTemplate
      field={field}
      dragHandleProps={dragHandleProps}
      fieldLabelEnabled={labelEnabled}
      withoutCheckboxes={withoutCheckboxes}
      onDelete={onDelete}
    >
      {meta?.view === SiteFormFieldTextView.TEXTAREA ? (
        <GiantOutlinedTextarea
          minRows={2}
          maxRows={2}
          padding="8px 12px"
          model={field.placeholder}
          disabled={!fieldPlaceholderEnabled}
          placeholder={t('placeholder')}
        />
      ) : (
        <GiantOutlinedInput
          smaller
          model={field.placeholder}
          disabled={placeholderDisabled}
          placeholder={t('placeholder')}
          Icon={Icon}
        />
      )}
    </SiteFormElementTemplate>
  );
});

SiteFormEntityFieldElement.displayName = 'SiteFormEntityFieldElement';
export { SiteFormEntityFieldElement };
