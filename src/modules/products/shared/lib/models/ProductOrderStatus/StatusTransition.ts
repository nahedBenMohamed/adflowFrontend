import { OrderStatusCode } from './OrderStatusCode';

class StatusTransition {
  fromCode: OrderStatusCode;
  toCodes: OrderStatusCode[];

  constructor(fromCode: OrderStatusCode, toCodes: OrderStatusCode[]) {
    this.fromCode = fromCode;
    this.toCodes = toCodes;
  }

  static create(fromCode: OrderStatusCode, toCodes: OrderStatusCode[]): StatusTransition {
    return new StatusTransition(fromCode, toCodes);
  }
}

export const statusTransitions = [
  StatusTransition.create(OrderStatusCode.RESERVED, [
    OrderStatusCode.SENT_FOR_SHIPMENT,
    OrderStatusCode.CANCELLED,
  ]),
  StatusTransition.create(OrderStatusCode.SENT_FOR_SHIPMENT, [
    OrderStatusCode.SHIPPED,
    OrderStatusCode.CANCELLED,
  ]),
  StatusTransition.create(OrderStatusCode.SHIPPED, [
    OrderStatusCode.RETURNED,
    OrderStatusCode.CANCELLED,
  ]),
  StatusTransition.create(OrderStatusCode.CANCELLED, []),
  StatusTransition.create(OrderStatusCode.RETURNED, []),
];
