export class PartnerSummaryDto {
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
  }: PartnerSummaryDto) {
    this.id = id;
    this.name = name;
    this.registrationsCount = registrationsCount;
    this.payingLeadsCount = payingLeadsCount;
    this.totalPayments = totalPayments;
    this.totalPartnerBonus = totalPartnerBonus;
  }
}
