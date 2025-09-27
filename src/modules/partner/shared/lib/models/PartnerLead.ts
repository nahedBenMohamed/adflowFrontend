import { UtcDate, type UtcDateValue } from '@/shared';
import type { PartnerLeadDto } from '../../../api';

export class PartnerLead {
  id: number;
  name: string;
  registrationDate: UtcDate;
  paymentDate: UtcDateValue;
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
  }: PartnerLead) {
    this.id = id;
    this.name = name;
    this.registrationDate = registrationDate;
    this.paymentDate = paymentDate;
    this.paymentAmount = paymentAmount;
    this.partnerBonus = partnerBonus;
    this.isPaidToPartner = isPaidToPartner;
  }

  static fromDto(dto: PartnerLeadDto): PartnerLead {
    return new PartnerLead({
      id: dto.id,
      name: dto.name,
      registrationDate: UtcDate.parseISO(dto.registrationDate),
      paymentDate: UtcDate.parseISONullable(dto.paymentDate),
      paymentAmount: dto.paymentAmount,
      partnerBonus: dto.partnerBonus,
      isPaidToPartner: dto.isPaidToPartner,
    });
  }

  static fromDtos(dtos: PartnerLeadDto[]): PartnerLead[] {
    return dtos.map(this.fromDto);
  }
}
