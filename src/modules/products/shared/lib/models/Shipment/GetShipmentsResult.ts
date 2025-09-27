import type { PagingMeta } from '@/shared';
import type { GetShipmentsResultDto } from '../../../../api';
import { Shipment } from './Shipment';

export class GetShipmentsResult {
  meta: PagingMeta;
  shipments: Shipment[];

  constructor({ meta, shipments }: GetShipmentsResult) {
    this.meta = meta;
    this.shipments = shipments;
  }

  static fromDto(dto: GetShipmentsResultDto): GetShipmentsResult {
    return new GetShipmentsResult({ meta: dto.meta, shipments: Shipment.fromDtos(dto.shipments) });
  }
}
