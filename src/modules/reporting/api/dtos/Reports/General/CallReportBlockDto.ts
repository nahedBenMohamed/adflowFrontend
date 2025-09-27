import type { QuantityAmount } from '../../../../shared';

export class CallReportBlockDto {
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
  }: CallReportBlockDto) {
    this.all = all;
    this.incoming = incoming;
    this.outgoing = outgoing;
    this.missed = missed;
    this.avgAll = avgAll;
    this.avgIncoming = avgIncoming;
    this.avgOutgoing = avgOutgoing;
  }
}
