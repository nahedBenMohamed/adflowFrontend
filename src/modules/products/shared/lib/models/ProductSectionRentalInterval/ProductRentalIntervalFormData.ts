import { SelectModel, validateForm, type Nullable } from '@/shared';
import { RentalIntervalDto } from '../../../../api';
import { RentalIntervalType } from './RentalIntervalType';

export class ProductRentalIntervalFormData {
  type: SelectModel;
  startTime: SelectModel;

  constructor(type: RentalIntervalType, startTime: Nullable<string>) {
    this.type = SelectModel.create(type).required();
    this.startTime = SelectModel.create(startTime);
  }

  static empty(): ProductRentalIntervalFormData {
    return new ProductRentalIntervalFormData(RentalIntervalType.DAY, '09:00');
  }

  get rentalIntervalDto(): RentalIntervalDto {
    return new RentalIntervalDto({
      type: this.type.value as RentalIntervalType,
      startTime: this.startTime.value ? this.startTime.value : null,
    });
  }

  validate = (): boolean => {
    return validateForm(this);
  };
}
