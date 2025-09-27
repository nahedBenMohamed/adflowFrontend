import type { Nullable } from '@/shared';

const queryKeys = {
  products: ['products'],
  productsSection(sectionId: number) {
    return [...this.products, sectionId];
  },
  product({ sectionId, productId }: { sectionId: number; productId: number }) {
    return [...this.productsSection(sectionId), productId];
  },
  shipments({ sectionId, offset }: { sectionId: number; offset: number }) {
    return [...this.productsSection(sectionId), 'shipments', offset];
  },
  shipment({ sectionId, shipmentId }: { sectionId: number; shipmentId: number }) {
    return [...this.productsSection(sectionId), 'shipments', shipmentId];
  },
  rentals({
    sectionId,
    offset,
    startDate,
    endDate,
    categoryId,
  }: {
    sectionId: number;
    offset: number;
    startDate: string;
    endDate: string;
    categoryId: Nullable<number>;
  }) {
    return [...this.productsSection(sectionId), 'rentals', offset, startDate, endDate, categoryId];
  },
  rental({
    sectionId,
    productId,
    startDate,
    endDate,
  }: {
    sectionId: number;
    productId: number;
    startDate: string;
    endDate: string;
  }) {
    return [...this.productsSection(sectionId), 'rentals', productId, startDate, endDate];
  },
  sections() {
    return [...this.products, 'sections'];
  },
  section(sectionId: number) {
    return [...this.sections(), sectionId];
  },
  entityProductOrders(entityId: number) {
    return [...this.products, 'orders', 'entity', entityId];
  },
  entityRentalProductOrders({ sectionId, entityId }: { sectionId: number; entityId: number }) {
    return [...this.productsSection(sectionId), 'orders', 'entity', entityId];
  },
  searchRentalOrders(sectionId: number) {
    return [...this.productsSection(sectionId), 'orders', 'search'];
  },
} as const;

export const PRODUCTS_QUERY_KEYS = Object.freeze(queryKeys);
