import type { PartnerSummaryDto } from '../../../api';

export class PartnerSummary {
  id: number;
  name: string;
  registrationsCount: number;
  payingLeadsCount: number;
  totalPayments: number;
  totalPartnerBonus: number;

  constructor({
    id,
    name,
    registrationsCount,
    payingLeadsCount,
    totalPayments,
    totalPartnerBonus,
  }: PartnerSummary) {
    this.id = id;
    this.name = name;
    this.registrationsCount = registrationsCount;
    this.payingLeadsCount = payingLeadsCount;
    this.totalPayments = totalPayments;
    this.totalPartnerBonus = totalPartnerBonus;
  }

  static fromDto(dto: PartnerSummaryDto): PartnerSummary {
    return new PartnerSummary({
      id: dto.id,
      name: dto.name,
      registrationsCount: dto.registrationsCount,
      payingLeadsCount: dto.payingLeadsCount,
      totalPayments: dto.totalPayments,
      totalPartnerBonus: dto.totalPartnerBonus,
    });
  }
}
