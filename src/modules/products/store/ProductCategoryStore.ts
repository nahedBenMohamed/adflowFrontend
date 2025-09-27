import { watchdogStore } from '@/app';
import type { DataStore } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  productCategoryApi,
  type CreateProductCategoryDto,
  type UpdateProductCategoryDto,
} from '../api';
import { type ProductCategory } from '../shared';

export class ProductCategoryStore implements DataStore {
  sectionId: number;
  categories: ProductCategory[] = [];

  isLoading = false;
  isLoaded = false;

  constructor(sectionId: number) {
    this.sectionId = sectionId;

    watchdogStore.watch(this);
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    try {
      this.isLoading = true;

      this.categories = await productCategoryApi.getProductCategories(this.sectionId);
    } catch (e) {
      throw new Error(`Error while loading categories: ${e}`);
    } finally {
      this.isLoading = false;
      this.isLoaded = true;
    }
  };

  getCategoryById = (id: number): ProductCategory => {
    for (const c of this.categories) {
      if (c.id === id) return c;

      for (const sc of c.children) {
        if (sc.id === id) return sc;
      }
    }

    throw new Error(`Category with id ${id} was not found`);
  };

  getCategoryIdxById = (id: number): number => {
    for (const c of this.categories) {
      if (c.id === id) return this.categories.indexOf(c);

      for (const sc of c.children) {
        if (sc.id === id) return c.children.indexOf(sc);
      }
    }

    throw new Error(`Category with id ${id} was not found`);
  };

  addCategory = async (dto: CreateProductCategoryDto): Promise<void> => {
    try {
      const createdCategory = await productCategoryApi.addProductCategory({
        sectionId: this.sectionId,
        dto,
      });

      if (!createdCategory.parentId) {
        this.categories = [createdCategory, ...this.categories];

        return;
      }

      const parentCategory = this.categories.find(c => c.id === createdCategory.parentId);

      if (!parentCategory)
        throw new Error(
          `Parent group ${createdCategory.parentId} for ${createdCategory.name} with id was not found`
        );

      parentCategory.children = [...parentCategory.children, createdCategory];
    } catch (e) {
      throw new Error(`Error while adding category ${dto.name}: ${e}`);
    }
  };

  updateCategory = async (categoryId: number, dto: UpdateProductCategoryDto): Promise<void> => {
    try {
      const updatedCategory = await productCategoryApi.updateProductCategory({
        sectionId: this.sectionId,
        categoryId,
        dto,
      });

      if (!updatedCategory.parentId) {
        const idx = this.getCategoryIdxById(categoryId);
        this.categories.splice(idx, 1, updatedCategory);

        return;
      }

      const parentCategory = this.categories.find(c => c.id === updatedCategory.parentId);

      if (!parentCategory)
        throw new Error(
          `Parent group ${updatedCategory.parentId} for ${updatedCategory.name} with id was not found`
        );

      parentCategory.children.map(c => (c.id === categoryId ? updatedCategory : c));
    } catch (e) {
      throw new Error(`Error while updating category ${dto.name}: ${e}`);
    }
  };

  deleteCategory = async (categoryId: number, newCategoryId?: number): Promise<void> => {
    try {
      await productCategoryApi.deleteProductCategory({
        sectionId: this.sectionId,
        categoryId,
        newCategoryId,
      });

      const parentCategory = this.categories.find(c => c.children.some(c => c.id === categoryId));

      if (!parentCategory) {
        this.categories = this.categories.filter(c => c.id !== categoryId);

        return;
      }

      parentCategory.children = parentCategory.children.filter(pc => pc.id !== categoryId);
    } catch (e) {
      throw new Error(`Error while deleting group ${categoryId}: ${e}`);
    }
  };

  reset = (): void => {
    this.categories = [];
  };
}
