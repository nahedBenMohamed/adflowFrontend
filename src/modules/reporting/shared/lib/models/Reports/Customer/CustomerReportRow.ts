import type { Nullable } from '@/shared';
import type { CustomerReportRowDto } from '../../../../../api';
import type { QuantityAmount } from '../../QuantityAmount';
import { CustomerReportField } from './CustomerReportField';

export class CustomerReportRow {
  ownerId: number;
  ownerName: string;
  ownerEntityTypeId: number;
  wonProductQuantity: number;
  won: QuantityAmount;
  open: QuantityAmount;
  lost: QuantityAmount;
  all: QuantityAmount;
  avgWonDealQuantity: number;
  avgWonDealBudget: number;
  avgWonDealTime: number;
  fields: Nullable<CustomerReportField[]>;

  constructor({
    ownerId,
    ownerName,
    ownerEntityTypeId,
    wonProductQuantity,
    won,
    open,
    lost,
    all,
    avgWonDealQuantity,
    avgWonDealBudget,
    avgWonDealTime,
    fields,
  }: CustomerReportRow) {
    this.ownerId = ownerId;
    this.ownerName = ownerName;
    this.ownerEntityTypeId = ownerEntityTypeId;
    this.wonProductQuantity = wonProductQuantity;
    this.won = won;
    this.open = open;
    this.lost = lost;
    this.all = all;
    this.avgWonDealQuantity = avgWonDealQuantity;
    this.avgWonDealBudget = avgWonDealBudget;
    this.avgWonDealTime = avgWonDealTime;
    this.fields = fields;
  }

  static fromDto(dto: CustomerReportRowDto): CustomerReportRow {
    return new CustomerReportRow({
      ownerId: dto.ownerId,
      ownerName: dto.ownerName,
      ownerEntityTypeId: dto.ownerEntityTypeId,
      wonProductQuantity: dto.wonProductQuantity,
      won: dto.won,
      open: dto.open,
      lost: dto.lost,
      all: dto.all,
      avgWonDealQuantity: dto.avgWonDealQuantity,
      avgWonDealBudget: dto.avgWonDealBudget,
      avgWonDealTime: dto.avgWonDealTime,
      fields: dto.fields ? CustomerReportField.fromDtos(dto.fields) : null,
    });
  }

  static fromDtos(dtos: CustomerReportRowDto[]): CustomerReportRow[] {
    return dtos.map(this.fromDto);
  }
}
