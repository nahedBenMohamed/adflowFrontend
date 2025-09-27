import {
  FieldType,
  type DadataBankRequisitesSuggestion,
  type DadataOrgRequisitesSuggestion,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { FieldSettingsStore } from '../../../../store';
import {
  ChecklistFieldValue,
  ColoredMultiselectFieldValue,
  ColoredSelectFieldValue,
  DateFieldValue,
  Field,
  FieldSettingsProps,
  FieldValueBaseProps,
  FileFieldValue,
  FormulaFieldValue,
  LinkFieldValue,
  MultiselectFieldValue,
  MultitextFieldValue,
  NumberFieldValue,
  ParticipantFieldValue,
  ParticipantsFieldValue,
  SelectFieldValue,
  SwitchFieldValue,
  TextFieldValue,
} from '../../models';
import type { PossibleFieldValue } from '../../types';
import { CheckedMultiselectFieldValueComp } from './FieldValueComps/CheckedMultiselectFieldValueComp';
import { ColoredMultiselectFieldValueComp } from './FieldValueComps/ColoredMultiselectFieldValueComp';
import { ColoredSelectFieldValueComp } from './FieldValueComps/ColoredSelectFieldValueComp';
import { DateFieldValueComp } from './FieldValueComps/DateFieldValueComp';
import { FileFieldValueComp } from './FieldValueComps/FileFieldValueComp';
import { FormulaFieldValueComp } from './FieldValueComps/FormulaFieldValueComp';
import { LinkFieldValueComp } from './FieldValueComps/LinkFieldValueComp';
import { MultiselectFieldValueComp } from './FieldValueComps/MultiselectFieldValueComp';
import { ChecklistFieldValueComp } from './FieldValueComps/MultitextFieldValueComps/ChecklistFieldValueComp';
import { EmailFieldValueComp } from './FieldValueComps/MultitextFieldValueComps/EmailFieldValueComp/EmailFieldValueComp';
import { MultitextFieldValueComp } from './FieldValueComps/MultitextFieldValueComps/MultitextFieldValueComp';
import { PhoneFieldValueComp } from './FieldValueComps/MultitextFieldValueComps/PhoneFieldValueComp/PhoneFieldValueComp';
import { NumberFieldValueComp } from './FieldValueComps/NumberFieldValueComp';
import { ParticipantFieldValueComp } from './FieldValueComps/ParticipantFieldValueComp';
import { ParticipantsFieldValueComp } from './FieldValueComps/ParticipantsFieldValueComp';
import { RichTextFieldValueComp } from './FieldValueComps/RichTextFieldValueComp';
import { SelectFieldValueComp } from './FieldValueComps/SelectFieldValueComp';
import { SwitchFieldValueComp } from './FieldValueComps/SwitchFieldValueComp';
import { TextFieldValueComp } from './FieldValueComps/TextFieldValueComp';

interface Props {
  field: Field;
  fieldValue: PossibleFieldValue;
  readonly?: boolean;
  tableView?: boolean;
  hideEmailAction?: boolean;
  alwaysHideIndicator?: boolean;
  fieldSettingsStore?: FieldSettingsStore;
  isProjectFields?: boolean;
  rightIndicatorOnMobile?: boolean;
  onChange?: (fieldValue: PossibleFieldValue) => void;
  onSelectBankRequisitesSuggestion?: (suggestion: DadataBankRequisitesSuggestion) => void;
  onSelectOrgRequisitesSuggestion?: (suggestion: DadataOrgRequisitesSuggestion) => void;
}

const FieldValueSwitch = observer((props: Props) => {
  const {
    field,
    fieldValue,
    readonly,
    tableView,
    hideEmailAction,
    alwaysHideIndicator,
    fieldSettingsStore,
    isProjectFields,
    rightIndicatorOnMobile,
    onChange,
    onSelectBankRequisitesSuggestion,
    onSelectOrgRequisitesSuggestion,
  } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.field_value',
  });

  const fieldSettingsProps = useMemo<FieldSettingsProps>(
    (): FieldSettingsProps =>
      fieldSettingsStore
        ? {
            fieldSettings: fieldSettingsStore.findFieldSettingsById(field.id),
          }
        : {},
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fieldSettingsStore, fieldSettingsStore?.fieldsSettings, field.id]
  );

  const commonFieldValueProps = useMemo(
    () =>
      ({
        field,
        readonly,
        tableView,
        alwaysHideIndicator,
        rightIndicatorOnMobile,
        ...fieldSettingsProps,
        onChange,
      }) satisfies Partial<FieldValueBaseProps<PossibleFieldValue>>,
    [
      field,
      fieldSettingsProps,
      tableView,
      readonly,
      alwaysHideIndicator,
      rightIndicatorOnMobile,
      onChange,
    ]
  );

  switch (field.type) {
    case FieldType.TEXT:
      return (
        <TextFieldValueComp
          renderAs="textarea"
          {...commonFieldValueProps}
          isProjectFields={isProjectFields}
          fieldValue={fieldValue as TextFieldValue}
          onSelectBankRequisitesSuggestion={onSelectBankRequisitesSuggestion}
          onSelectOrgRequisitesSuggestion={onSelectOrgRequisitesSuggestion}
        />
      );

    case FieldType.FORMULA:
      return (
        <FormulaFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as FormulaFieldValue}
        />
      );

    case FieldType.VALUE:
      return (
        <NumberFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as NumberFieldValue}
          // if field.value is specified it means that budget field is calculated via formula so that
          // we're not able to manually change it
          readonly={Boolean(field.value)}
          title={
            field.value
              ? t('value_field_formula_calculation', {
                  value: (fieldValue as NumberFieldValue).value,
                })
              : undefined
          }
        />
      );

    case FieldType.NUMBER:
      return (
        <NumberFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as NumberFieldValue}
        />
      );

    case FieldType.MULTITEXT:
      return (
        <MultitextFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as MultitextFieldValue}
        />
      );

    case FieldType.PHONE:
      return (
        <PhoneFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as MultitextFieldValue}
        />
      );

    case FieldType.EMAIL:
      return (
        <EmailFieldValueComp
          {...commonFieldValueProps}
          hideEmailAction={hideEmailAction}
          fieldValue={fieldValue as MultitextFieldValue}
        />
      );

    case FieldType.SELECT:
      return (
        <SelectFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as SelectFieldValue}
        />
      );

    case FieldType.MULTISELECT:
      return (
        <MultiselectFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as MultiselectFieldValue}
        />
      );

    case FieldType.SWITCH:
      return (
        <SwitchFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as SwitchFieldValue}
        />
      );

    case FieldType.DATE:
      return (
        <DateFieldValueComp {...commonFieldValueProps} fieldValue={fieldValue as DateFieldValue} />
      );

    case FieldType.LINK:
      return (
        <LinkFieldValueComp {...commonFieldValueProps} fieldValue={fieldValue as LinkFieldValue} />
      );

    case FieldType.FILE:
      return (
        <FileFieldValueComp {...commonFieldValueProps} fieldValue={fieldValue as FileFieldValue} />
      );

    case FieldType.RICHTEXT:
      return (
        <RichTextFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as TextFieldValue}
        />
      );

    case FieldType.PARTICIPANTS:
      return (
        <ParticipantsFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as ParticipantsFieldValue}
        />
      );

    case FieldType.PARTICIPANT:
      return (
        <ParticipantFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as ParticipantFieldValue}
        />
      );

    case FieldType.COLORED_SELECT:
      return (
        <ColoredSelectFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as ColoredSelectFieldValue}
        />
      );

    case FieldType.COLORED_MULTISELECT:
      return (
        <ColoredMultiselectFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as ColoredMultiselectFieldValue}
        />
      );

    case FieldType.CHECKED_MULTISELECT:
      return (
        <CheckedMultiselectFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as MultiselectFieldValue}
        />
      );

    case FieldType.CHECKLIST:
      return (
        <ChecklistFieldValueComp
          {...commonFieldValueProps}
          fieldValue={fieldValue as ChecklistFieldValue}
        />
      );

    default:
      throw new Error(`Unknown field type: ${field.type}, failed to render field value`);
  }
});

FieldValueSwitch.displayName = 'FieldValueSwitch';
export { FieldValueSwitch };
