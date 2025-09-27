import { SelectModel } from '@/shared';
import type { Shipment } from './Shipment';

export class ShipmentRow {
  shipment: Shipment;
  shipmentStatusModel: SelectModel;

  constructor(shipment: Shipment) {
    this.shipment = shipment;
    this.shipmentStatusModel = SelectModel.create(shipment.statusId);
  }
}
