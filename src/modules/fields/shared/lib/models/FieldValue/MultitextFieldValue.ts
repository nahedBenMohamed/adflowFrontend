import { generalSettingsStore } from '@/app';
import { FieldType, InputModel, ObjectState, PhoneFormat } from '@/shared';
import { action, makeObservable, observable, type IObservableArray } from 'mobx';
import type { FieldValueDto } from '../../../../api';
import type { MultitextFieldValuePrimitive } from '../../types';
import type { Field } from '../Field/Field';
import { FieldValue } from './FieldValue';

// we initialize values with [] just in case to prevent legacy errors
const generateModelsArray = ({
  fieldType,
  values = [],
}: {
  fieldType: FieldType;
  values: string[];
}) => {
  switch (fieldType) {
    case FieldType.EMAIL:
      const models = observable.array(
        // There is a usual error where API users makes values an empty string or other non-array type so we need to add this for safety and to make sure frontend won't break
        Array.isArray(values) && values.length
          ? values.map<InputModel>(v => InputModel.create(v).emailRFC5322())
          : [InputModel.create().emailRFC5322()]
      );

      models.forEach(m => {
        if (m.value.length > 0) m.validate();
      });

      return models;

    case FieldType.PHONE: {
      const { accountSettings } = generalSettingsStore;

      if (!accountSettings)
        throw new Error(
          `Failed to generateModelsArray for phone field in MultitextFieldValue, accountSettings is not defined`
        );

      let models: IObservableArray<InputModel>;

      if (accountSettings.phoneFormat === PhoneFormat.INTERNATIONAL) {
        models = observable.array(
          Array.isArray(values) && values.length
            ? values.map<InputModel>(v => InputModel.create(v).phoneInternational())
            : [InputModel.create().phoneInternational()]
        );
      } else {
        models = observable.array(
          Array.isArray(values) && values.length
            ? values.map<InputModel>(v => InputModel.create(v))
            : [InputModel.create()]
        );
      }

      models.forEach(m => {
        if (m.value.length > 0) m.validate();
      });

      return models;
    }

    default:
      return observable.array(
        Array.isArray(values) && values.length
          ? values.map<InputModel>(v => InputModel.create(v))
          : [InputModel.create()]
      );
  }
};

export class MultitextFieldValue extends FieldValue<
  MultitextFieldValuePrimitive,
  IObservableArray<InputModel>
> {
  values: string[] = [];

  constructor(fieldId: number, fieldType: FieldType, values: string[] = [], state: ObjectState) {
    super({
      state,
      fieldId,
      fieldType,
      // https://mobx.js.org/api.html#observablearray
      model: generateModelsArray({ fieldType, values }),
    });

    // There is a usual error where API users makes values an empty string or other non-array type so we need to add this for safety and to make sure frontend won't break
    this.values = Array.isArray(values) ? values : [];

    makeObservable(this, {
      state: true,
      values: true,
      model: observable,
      changeState: action,
      changeValues: action,
    });
  }

  static empty(field: Field): MultitextFieldValue {
    return new this(field.id, field.type, [], ObjectState.CREATED_EMPTY);
  }

  static fromDto({
    fieldId,
    fieldType,
    payload,
  }: FieldValueDto<MultitextFieldValuePrimitive>): MultitextFieldValue {
    return new this(fieldId, fieldType, payload.values, ObjectState.UNCHANGED);
  }

  toDto = (): FieldValueDto<MultitextFieldValuePrimitive> => {
    return this.toDtoWithPayload({ values: this.values });
  };

  changeValues = (values: string[]): void => {
    this.values = values;

    this.calculateStateAfterUpdate();
  };

  clearEmptyModels = (): void => {
    // we allow to have one empty model (for proper possible indicators display)
    if (this.model.length === 1) return;

    this.model.replace(this.model.filter(m => m.value.length > 0));
  };

  filled = (): boolean => {
    // to prevent legacy errors (cases where values are undefined or null)
    return this.values?.length > 0;
  };
}
