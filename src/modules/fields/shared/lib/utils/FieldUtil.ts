import { FieldType } from '@/shared';
import type { FieldValueDto } from '../../../api';
import {
  ChecklistFieldValue,
  ColoredMultiselectFieldValue,
  ColoredSelectFieldValue,
  DateFieldValue,
  FileFieldValue,
  LinkFieldValue,
  MultiselectFieldValue,
  MultitextFieldValue,
  NumberFieldValue,
  ParticipantFieldValue,
  ParticipantsFieldValue,
  SelectFieldValue,
  SwitchFieldValue,
  TextFieldValue,
} from '../models';
import type {
  ChecklistFieldValuePrimitive,
  ColoredMultiselectFieldValuePrimitive,
  ColoredSelectFieldValuePrimitive,
  DateFieldValueDtoPrimitive,
  FileFieldValuePrimitive,
  LinkFieldValuePrimitive,
  MultiselectFieldValuePrimitive,
  MultitextFieldValuePrimitive,
  NumberFieldValuePrimitive,
  ParticipantFieldValuePrimitive,
  ParticipantsFieldValuePrimitive,
  PossibleFieldValue,
  SelectFieldValuePrimitive,
  SwitchFieldValuePrimitive,
  TextFieldValuePrimitive,
} from '../types';

export class FieldUtil {
  private static readonly _availableTypes: FieldType[] = [
    FieldType.TEXT,
    FieldType.DATE,
    FieldType.LINK,
    FieldType.VALUE,
    FieldType.FILE,
    FieldType.PHONE,
    FieldType.EMAIL,
    FieldType.NUMBER,
    FieldType.SELECT,
    FieldType.SWITCH,
    FieldType.FORMULA,
    FieldType.RICHTEXT,
    FieldType.CHECKLIST,
    FieldType.MULTITEXT,
    FieldType.MULTISELECT,
    FieldType.PARTICIPANT,
    FieldType.PARTICIPANTS,
    FieldType.COLORED_SELECT,
    FieldType.COLORED_MULTISELECT,
    FieldType.CHECKED_MULTISELECT,
  ];

  static toDtos(fieldValues: PossibleFieldValue[]): FieldValueDto<unknown>[] {
    return fieldValues
      .filter(fv => this._availableTypes.includes(fv.fieldType) && fv.isCommittable())
      .map<FieldValueDto<unknown>>(fv => fv.toDto());
  }

  static fromDtos(dtos: FieldValueDto<unknown>[]): PossibleFieldValue[] {
    return dtos
      .filter(fv => this._availableTypes.includes(fv.fieldType))
      .map<PossibleFieldValue>(dto => {
        switch (dto.fieldType) {
          case FieldType.TEXT:
          case FieldType.FORMULA:
          case FieldType.RICHTEXT:
            return TextFieldValue.fromDto(dto as FieldValueDto<TextFieldValuePrimitive>);

          case FieldType.VALUE:
          case FieldType.NUMBER:
            return NumberFieldValue.fromDto(dto as FieldValueDto<NumberFieldValuePrimitive>);

          case FieldType.MULTITEXT:
          case FieldType.EMAIL:
          case FieldType.PHONE:
            return MultitextFieldValue.fromDto(dto as FieldValueDto<MultitextFieldValuePrimitive>);

          case FieldType.CHECKLIST:
            return ChecklistFieldValue.fromDto(dto as FieldValueDto<ChecklistFieldValuePrimitive>);

          case FieldType.SELECT:
            return SelectFieldValue.fromDto(dto as FieldValueDto<SelectFieldValuePrimitive>);

          case FieldType.MULTISELECT:
          case FieldType.CHECKED_MULTISELECT:
            return MultiselectFieldValue.fromDto(
              dto as FieldValueDto<MultiselectFieldValuePrimitive>
            );

          case FieldType.SWITCH:
            return SwitchFieldValue.fromDto(dto as FieldValueDto<SwitchFieldValuePrimitive>);

          case FieldType.DATE:
            return DateFieldValue.fromDto(dto as FieldValueDto<DateFieldValueDtoPrimitive>);

          case FieldType.LINK:
            return LinkFieldValue.fromDto(dto as FieldValueDto<LinkFieldValuePrimitive>);

          case FieldType.FILE:
            return FileFieldValue.fromDto(dto as FieldValueDto<FileFieldValuePrimitive>);

          case FieldType.PARTICIPANTS:
            return ParticipantsFieldValue.fromDto(
              dto as FieldValueDto<ParticipantsFieldValuePrimitive>
            );

          case FieldType.PARTICIPANT:
            return ParticipantFieldValue.fromDto(
              dto as FieldValueDto<ParticipantFieldValuePrimitive>
            );

          case FieldType.COLORED_SELECT:
            return ColoredSelectFieldValue.fromDto(
              dto as FieldValueDto<ColoredSelectFieldValuePrimitive>
            );

          case FieldType.COLORED_MULTISELECT:
            return ColoredMultiselectFieldValue.fromDto(
              dto as FieldValueDto<ColoredMultiselectFieldValuePrimitive>
            );

          default:
            throw new Error(
              `Unknown field type: ${dto.fieldType}, failed to convert FieldValueDto[] to FieldValue[]`
            );
        }
      });
  }
}
