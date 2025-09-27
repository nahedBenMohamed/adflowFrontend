import { generalSettingsStore } from '@/app';
import {
  Currency,
  InputModel,
  JsonStateHelper,
  SelectModel,
  validateForm,
  type FileInfo,
} from '@/shared';
import { computed, makeAutoObservable } from 'mobx';
import { CreateProductDto, UpdateStockDto, type CreateProductPriceDto } from '../api';
import {
  CreateStockRow,
  PriceForm,
  ProductType,
  ProductsSectionType,
  type Product,
  type Warehouse,
} from '../shared';

export class AddProductModalStore {
  sectionType: ProductsSectionType;

  name: InputModel;
  type: SelectModel;
  description: InputModel;
  sku: InputModel;
  unit: InputModel;
  tax: InputModel;
  prices: PriceForm[];
  categoryId: SelectModel;
  createStockRows: CreateStockRow[];

  // for rental products with enabled warehouses
  warehouseId: SelectModel;

  jsonState: JsonStateHelper;

  initializeJsonState = (): void => {
    this.jsonState = new JsonStateHelper(() =>
      JSON.stringify([
        this.name.value,
        this.type.value,
        this.description.value,
        this.sku.value,
        this.unit.value,
        this.tax.value,
        this.prices,
        this.categoryId,
        this.createStockRows,
        this.warehouseId,
      ])
    );

    this.jsonState.calculateState();
  };

  constructor({
    sectionType,
    warehouses,
    preset,
  }: {
    sectionType: ProductsSectionType;
    warehouses: Warehouse[];
    preset?: Partial<Product>;
  }) {
    this.sectionType = sectionType;

    const defaultCurrency = generalSettingsStore.accountSettings?.currency;

    this.name = InputModel.create(preset?.name).required();
    this.type = SelectModel.create(preset?.type ? preset.type : ProductType.PRODUCT);
    this.description = InputModel.create(preset?.description ?? undefined);
    this.sku = InputModel.create(preset?.sku ?? undefined);
    this.unit = InputModel.create(preset?.unit ?? undefined);
    this.tax = InputModel.createFromNumber(preset?.tax ?? undefined).between(0, 100);
    this.prices = [PriceForm.create(defaultCurrency ?? Currency.USD)];
    this.categoryId = SelectModel.create(preset?.categoryId ?? null);
    this.warehouseId = SelectModel.create();

    this.createStockRows =
      this.sectionType === ProductsSectionType.RENTAL
        ? []
        : warehouses.map<CreateStockRow>(w =>
            CreateStockRow.create({ warehouseId: w.id, stockQuantity: 0 })
          );

    this.initializeJsonState();

    makeAutoObservable(this);
  }

  generateCreateProductDto = (uploadedFiles: FileInfo[]): CreateProductDto =>
    new CreateProductDto({
      name: this.name.trimmedValue,
      type: this.type.value,
      sku: this.sku.valueOrNull(),
      unit: this.unit.valueOrNull(),
      tax: this.tax.asNumberOrNull(),
      categoryId: this.categoryId.value ?? null,
      description: this.description.valueOrNull(),
      prices: this.prices.map<CreateProductPriceDto>(p => p.toDto()),
      photoFileIds: uploadedFiles.map<string>(f => f.fileId),
      stocks:
        // if user selected a warehouse for rental product we create a stock in this warehouse with quantity === 1
        this.sectionType === ProductsSectionType.RENTAL
          ? this.warehouseId.value
            ? [new UpdateStockDto({ warehouseId: this.warehouseId.value, stockQuantity: 1 })]
            : []
          : this.type.value === ProductType.SERVICE
            ? []
            : this.createStockRows
                .map<UpdateStockDto>(r => r.toUpdateStockDto())
                .filter(r => typeof r.stockQuantity === 'number' && r.stockQuantity > 0),
    });

  validate = (): boolean => {
    return validateForm(this);
  };

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (this.jsonState) return this.jsonState.stateChanged;

    return false;
  };
}
