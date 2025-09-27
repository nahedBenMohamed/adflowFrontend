import { CallReportBlockDto } from '../../../../../api';
import type { QuantityAmount } from '../../QuantityAmount';

export class TelephonyReportBlock {
  all: QuantityAmount;
  incoming: QuantityAmount;
  outgoing: QuantityAmount;
  missed: QuantityAmount;
  avgAll: QuantityAmount;
  avgIncoming: QuantityAmount;
  avgOutgoing: QuantityAmount;

  constructor({
    all,
    incoming,
    outgoing,
    missed,
    avgAll,
    avgIncoming,
    avgOutgoing,
  }: TelephonyReportBlock) {
    this.all = all;
    this.incoming = incoming;
    this.outgoing = outgoing;
    this.missed = missed;
    this.avgAll = avgAll;
    this.avgIncoming = avgIncoming;
    this.avgOutgoing = avgOutgoing;
  }

  static fromDto(dto: CallReportBlockDto): CallReportBlockDto {
    return new CallReportBlockDto({
      all: dto.all,
      incoming: dto.incoming,
      outgoing: dto.outgoing,
      missed: dto.missed,
      avgAll: dto.avgAll,
      avgIncoming: dto.avgIncoming,
      avgOutgoing: dto.avgOutgoing,
    });
  }
}
