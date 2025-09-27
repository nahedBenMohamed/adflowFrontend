import type { SiteFormFieldEntityNameDto } from '../../../../../api';

export class SiteFormFieldEntityName {
  entityTypeId: number;

  constructor({ entityTypeId }: SiteFormFieldEntityName) {
    this.entityTypeId = entityTypeId;
  }

  static fromDto(dto: SiteFormFieldEntityNameDto): SiteFormFieldEntityName {
    return new SiteFormFieldEntityName({
      entityTypeId: dto.entityTypeId,
    });
  }
}
