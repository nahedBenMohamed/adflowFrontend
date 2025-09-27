import type { SubscriptionFeatureDto } from '@/app';

export class SubscriptionFeature {
  name: string;
  available: boolean;

  constructor({ name, available }: SubscriptionFeature) {
    this.name = name;
    this.available = available;
  }

  static fromDto(dto: SubscriptionFeatureDto): SubscriptionFeature {
    return new SubscriptionFeature({ name: dto.name, available: dto.available });
  }

  static fromDtos(dto: SubscriptionFeatureDto[]): SubscriptionFeature[] {
    return dto.map(this.fromDto);
  }
}
