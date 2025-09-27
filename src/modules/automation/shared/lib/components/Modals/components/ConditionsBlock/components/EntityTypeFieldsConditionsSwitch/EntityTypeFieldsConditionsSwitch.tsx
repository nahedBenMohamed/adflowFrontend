import {
  FieldType,
  type BooleanFilterFormData,
  type DateFilterFormData,
  type EntityType,
  type NumberFilterFormData,
  type SelectFilterFormData,
  type StringFilterFormData,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import type { EntityTypeFieldConditionFormData } from '../../../../../../models';
import { EntityTypeFieldFilterBoolean } from '../EntityTypeFieldFilterBoolean/EntityTypeFieldFilterBoolean';
import { EntityTypeFieldFilterDate } from '../EntityTypeFieldFilterDate/EntityTypeFieldFilterDate';
import { EntityTypeFieldFilterNumber } from '../EntityTypeFieldFilterNumber/EntityTypeFieldFilterNumber';
import { EntityTypeFieldFilterParticipantsSelect } from '../EntityTypeFieldFilterParticipantsSelect/EntityTypeFieldFilterParticipantsSelect';
import { EntityTypeFieldFilterSelect } from '../EntityTypeFieldFilterSelect/EntityTypeFieldFilterSelect';
import { EntityTypeFieldFilterString } from '../EntityTypeFieldFilterString/EntityTypeFieldFilterString';

interface Props {
  entityType: EntityType;
  fieldsFormData: EntityTypeFieldConditionFormData;
}

const EntityTypeFieldsConditionsSwitch = observer((props: Props) => {
  const { entityType, fieldsFormData } = props;

  const field = entityType.getFieldById(fieldsFormData.fieldId.value);

  switch (field.type) {
    case FieldType.VALUE:
    case FieldType.NUMBER:
    case FieldType.FORMULA: {
      return (
        <EntityTypeFieldFilterNumber
          formData={fieldsFormData.filterFormData as NumberFilterFormData}
        />
      );
    }

    case FieldType.TEXT:
    case FieldType.LINK:
    case FieldType.PHONE:
    case FieldType.EMAIL:
    case FieldType.RICHTEXT:
    case FieldType.CHECKLIST:
    case FieldType.MULTITEXT: {
      return (
        <EntityTypeFieldFilterString
          formData={fieldsFormData.filterFormData as StringFilterFormData}
        />
      );
    }

    case FieldType.SWITCH: {
      return (
        <EntityTypeFieldFilterBoolean
          formData={fieldsFormData.filterFormData as BooleanFilterFormData}
        />
      );
    }

    case FieldType.PARTICIPANT:
    case FieldType.PARTICIPANTS: {
      return (
        <EntityTypeFieldFilterParticipantsSelect
          formData={fieldsFormData.filterFormData as SelectFilterFormData}
        />
      );
    }

    case FieldType.SELECT:
    case FieldType.MULTISELECT:
    case FieldType.COLORED_SELECT:
    case FieldType.CHECKED_MULTISELECT:
    case FieldType.COLORED_MULTISELECT: {
      return (
        <EntityTypeFieldFilterSelect
          field={field}
          formData={fieldsFormData.filterFormData as SelectFilterFormData}
        />
      );
    }

    case FieldType.DATE: {
      return (
        <EntityTypeFieldFilterDate formData={fieldsFormData.filterFormData as DateFilterFormData} />
      );
    }

    default:
      throw new Error(
        `Unknown field type: ${field.type}, failed to render corresponding entity type field filter block`
      );
  }
});

EntityTypeFieldsConditionsSwitch.displayName = 'EntityTypeFieldsConditionsSwitch';
export { EntityTypeFieldsConditionsSwitch };
