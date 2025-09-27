import type { Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { productOrderStatusApi } from '../api';
import { OrderStatusCode, statusTransitions, type OrderStatus } from '../shared';

class OrderStatusStore {
  statuses: OrderStatus[];
  isLoaded: boolean;

  constructor() {
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    try {
      this.statuses = await productOrderStatusApi.getEntityProductOrderStatuses();
    } catch (e) {
      throw new Error(`Error while loading statuses: ${e}`);
    } finally {
      this.isLoaded = true;
    }
  };

  getOrderAvailableStatuses = (currentStatusId: Nullable<number>): OrderStatus[] => {
    if (currentStatusId === null) return this.getByCodes([OrderStatusCode.RESERVED]);

    return this.getAvailableStatuses(currentStatusId).filter(s =>
      [
        OrderStatusCode.SHIPPED,
        OrderStatusCode.RETURNED,
        OrderStatusCode.CANCELLED,
        OrderStatusCode.SENT_FOR_SHIPMENT,
      ].includes(s.code)
    );
  };

  getShipmentAvailableStatuses = (currentStatusId: number): OrderStatus[] => {
    return this.getAvailableStatuses(currentStatusId).filter(s =>
      [OrderStatusCode.SHIPPED, OrderStatusCode.RETURNED].includes(s.code)
    );
  };

  getAvailableStatuses = (currentStatusId: number): OrderStatus[] => {
    const currentStatus = this.getById(currentStatusId);

    const transition = statusTransitions.find(i => i.fromCode === currentStatus.code);

    if (!transition) return [];

    return this.getByCodes([currentStatus.code, ...transition.toCodes]);
  };

  getByCodes = (codes: OrderStatusCode[]): OrderStatus[] => {
    return this.statuses.filter(s => codes.includes(s.code));
  };

  getById = (id: number): OrderStatus => {
    const status = this.statuses.find(s => s.id === id);

    if (!status) throw new Error(`Status with id ${id} not found`);

    return status;
  };
}

export const orderStatusStore = new OrderStatusStore();
