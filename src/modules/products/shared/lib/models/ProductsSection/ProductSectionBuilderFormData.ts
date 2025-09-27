import { iconStore } from '@/app';
import {
  BooleanModel,
  ConvertTimeUtil,
  InputModel,
  validateForm,
  type Icon,
  type Nullable,
} from '@/shared';
import { makeAutoObservable } from 'mobx';
import { CreateProductsSectionDto, UpdateProductsSectionDto } from '../../../../api';
import type { ProductsSectionType } from './ProductsSectionType';

export class ProductSectionBuilderFormData {
  productsSectionType: ProductsSectionType;

  name: InputModel;
  icon: Icon;
  entityTypeIds: number[];
  schedulerIds: number[];
  enableWarehouse: BooleanModel;
  enableBarcode: BooleanModel;
  // in seconds
  cancelAfter: Nullable<number>;

  constructor({
    productsSectionType,
    name,
    icon,
    linkedSections,
    schedulerIds,
    enableWarehouse,
    enableBarcode,
    cancelAfter,
  }: {
    productsSectionType: ProductsSectionType;
    name: string;
    icon: Icon;
    linkedSections: number[];
    schedulerIds: number[];
    enableWarehouse: boolean;
    enableBarcode: boolean;
    cancelAfter: Nullable<number>;
  }) {
    this.productsSectionType = productsSectionType;

    this.name = InputModel.create(name).required();
    this.icon = icon;
    this.entityTypeIds = linkedSections;
    this.schedulerIds = schedulerIds;
    this.enableWarehouse = BooleanModel.create(enableWarehouse);
    this.enableBarcode = BooleanModel.create(enableBarcode);
    this.cancelAfter = cancelAfter ? ConvertTimeUtil.getSecondsFromHours(cancelAfter) : null;

    makeAutoObservable(this);
  }

  static empty({
    defaultTitle = '',
    moduleType,
  }: {
    defaultTitle?: string;
    moduleType: ProductsSectionType;
  }): ProductSectionBuilderFormData {
    return new ProductSectionBuilderFormData({
      productsSectionType: moduleType,
      name: defaultTitle,
      icon: iconStore.defaultProductsIcon,
      linkedSections: [],
      schedulerIds: [],
      enableWarehouse: false,
      enableBarcode: false,
      cancelAfter: null,
    });
  }

  get createProductsSectionDto(): CreateProductsSectionDto {
    return new CreateProductsSectionDto({
      name: this.name.value,
      icon: this.icon.name,
      type: this.productsSectionType,
      enableWarehouse: this.enableWarehouse.value,
      enableBarcode: this.enableBarcode.value,
      // in hours
      cancelAfter: this.cancelAfter ? ConvertTimeUtil.getHoursFromSeconds(this.cancelAfter) : null,
    });
  }

  get updateProductsSectionDto(): UpdateProductsSectionDto {
    return new UpdateProductsSectionDto({
      name: this.name.value,
      icon: this.icon.name,
      enableWarehouse: this.enableWarehouse.value,
      enableBarcode: this.enableBarcode.value,
      // in hours
      cancelAfter: this.cancelAfter ? ConvertTimeUtil.getHoursFromSeconds(this.cancelAfter) : null,
    });
  }

  setCancelAfter = (value: Nullable<number>): void => {
    this.cancelAfter = value;
  };

  setIcon = (icon: Icon): void => {
    this.icon = icon;
  };

  setEntityTypeIds = (linkedSectionsIds: number[]): void => {
    this.entityTypeIds = linkedSectionsIds;
  };

  setSchedulerIds = (schedulerIds: number[]): void => {
    this.schedulerIds = schedulerIds;
  };

  validate = (): boolean => {
    return validateForm(this);
  };
}
