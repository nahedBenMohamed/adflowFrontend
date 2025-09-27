import { type Field } from '../../../../modules/fields/shared/lib/models/Field/Field';
import { type FieldGroup } from '../../../../modules/fields/shared/lib/models/FieldGroup/FieldGroup';

export class UpdateEntityTypeFieldsModel {
  entityTypeId: number;
  fieldGroups: FieldGroup[];
  fields: Field[];

  constructor({ entityTypeId, fieldGroups, fields }: UpdateEntityTypeFieldsModel) {
    this.entityTypeId = entityTypeId;
    this.fieldGroups = fieldGroups;
    this.fields = fields;
  }
}
