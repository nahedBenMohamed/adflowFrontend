import { iconStore } from '@/app';
import type { Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  productSectionRentalIntervalApi,
  productsSectionApi,
  type CreateProductsSectionDto,
  type RentalIntervalDto,
  type UpdateProductsSectionDto,
} from '../api';
import {
  ProductRentalIntervalFormData,
  ProductSectionBuilderFormData,
  type ProductsSection,
  type ProductsSectionType,
  type RentalInterval,
} from '../shared';

export class ProductsSectionBuilderStore {
  productsSection: Nullable<ProductsSection> = null;
  rentalInterval: Nullable<RentalInterval> = null;
  moduleType: ProductsSectionType;

  sectionFormData: ProductSectionBuilderFormData;
  rentalIntervalFormData: ProductRentalIntervalFormData;

  isLoading = false;
  isLoaded = false;

  isCreatingSection = false;
  isCreatingInterval = false;

  isUpdating = false;
  areLinksUpdating = false;

  constructor({
    moduleType,
    defaultTitle,
  }: {
    moduleType: ProductsSectionType;
    defaultTitle: string;
  }) {
    this.moduleType = moduleType;

    this.sectionFormData = ProductSectionBuilderFormData.empty({ moduleType, defaultTitle });
    this.rentalIntervalFormData = ProductRentalIntervalFormData.empty();

    makeAutoObservable(this);
  }

  initializeProductsSectionFormData = (productsSection: ProductsSection): void => {
    this.sectionFormData = new ProductSectionBuilderFormData({
      productsSectionType: this.moduleType,
      name: productsSection.name,
      icon: iconStore.getByName(productsSection.icon),
      linkedSections: productsSection.entityTypeIds,
      schedulerIds: productsSection.schedulerIds,
      enableWarehouse: productsSection.enableWarehouse,
      enableBarcode: productsSection.enableBarcode,
      // in productsSection cancelAfter is in hours, in form it should be in seconds
      cancelAfter: productsSection.cancelAfter,
    });
  };

  initializeRentalIntervalFormData = (rentalInterval: RentalInterval): void => {
    this.rentalIntervalFormData = new ProductRentalIntervalFormData(
      rentalInterval.type,
      rentalInterval.startTime
    );
  };

  loadData = async (sectionId: number): Promise<void> => {
    try {
      this.isLoading = true;

      this.productsSection = await productsSectionApi.getProductsSection(sectionId);
      this.rentalInterval =
        await productSectionRentalIntervalApi.getProductSectionRentalInterval(sectionId);

      if (this.productsSection) this.initializeProductsSectionFormData(this.productsSection);

      if (this.rentalInterval) this.initializeRentalIntervalFormData(this.rentalInterval);
    } catch (e) {
      throw new Error(`Failed to load products section with id ${sectionId}: ${e}`);
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
    }
  };

  createProductsSection = async (dto: CreateProductsSectionDto): Promise<void> => {
    try {
      this.isCreatingSection = true;

      this.productsSection = await productsSectionApi.createProductsSection(dto);
    } catch (e) {
      throw new Error(`Failed to create products section: ${e}`);
    } finally {
      this.isCreatingSection = false;
    }
  };

  createProductsSectionRentalInterval = async (
    sectionId: number,
    dto: RentalIntervalDto
  ): Promise<void> => {
    try {
      this.isCreatingInterval = true;

      this.rentalInterval =
        await productSectionRentalIntervalApi.createProductSectionRentalInterval({
          sectionId,
          dto,
        });
    } catch (e) {
      throw new Error(`Failed to create products section rental interval: ${e}`);
    } finally {
      this.isCreatingInterval = false;
    }
  };

  updateProductsSection = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateProductsSectionDto;
  }): Promise<void> => {
    try {
      this.isUpdating = true;

      this.productsSection = await productsSectionApi.updateProductsSection({ sectionId: id, dto });
    } catch (e) {
      throw new Error(`Failed to update products section with id ${id}: ${e}`);
    } finally {
      this.isUpdating = false;
    }
  };

  updateProductsSectionLinks = async ({
    id,
    entityTypeIds,
    schedulerIds,
  }: {
    id: number;
    entityTypeIds: number[];
    schedulerIds: number[];
  }): Promise<void> => {
    try {
      this.areLinksUpdating = true;

      const result = await productsSectionApi.updateProductsSectionLinks({
        sectionId: id,
        entityTypeIds,
        schedulerIds,
      });

      if (result && this.productsSection) this.productsSection.entityTypeIds = entityTypeIds;
    } catch (e) {
      throw new Error(`Failed to update products section links with id ${id}: ${e}`);
    } finally {
      this.areLinksUpdating = false;
    }
  };
}
