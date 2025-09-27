import type { PagingMeta } from '@/shared';
import type { ShipmentDto } from './ShipmentDto';

export class GetShipmentsResultDto {
  meta: PagingMeta;
  shipments: ShipmentDto[];

  constructor({ meta, shipments }: GetShipmentsResultDto) {
    this.meta = meta;
    this.shipments = shipments;
  }
}
