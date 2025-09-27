import type { Nullable } from '@/shared';

export class PartnerLeadDto {
  id: number;
  name: string;
  registrationDate: string;
  paymentDate: Nullable<string>;
  paymentAmount: number;
  partnerBonus: number;
  isPaidToPartner: boolean;

  constructor({
    id,
    name,
    registrationDate,
    paymentDate,
    paymentAmount,
    partnerBonus,
    isPaidToPartner,
  }: PartnerLeadDto) {
    this.id = id;
    this.name = name;
    this.registrationDate = registrationDate;
    this.paymentDate = paymentDate;
    this.paymentAmount = paymentAmount;
    this.partnerBonus = partnerBonus;
    this.isPaidToPartner = isPaidToPartner;
  }
}
